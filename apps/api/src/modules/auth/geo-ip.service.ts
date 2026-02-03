import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
}

interface IpApiResponse {
  status: 'success' | 'fail';
  message?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  query?: string;
}

@Injectable()
export class GeoIpService {
  private readonly logger = new Logger(GeoIpService.name);
  private readonly cache = new Map<string, { data: GeoLocation | null; expiresAt: number }>();
  private readonly cacheTimeout: number; // ms
  private readonly requestTimeout: number; // ms

  constructor(private configService: ConfigService) {
    // Cache 24h par defaut
    this.cacheTimeout = (this.configService.get<number>('GEOIP_CACHE_HOURS') || 24) * 60 * 60 * 1000;
    // Timeout 2s par defaut
    this.requestTimeout = this.configService.get<number>('GEOIP_TIMEOUT_MS') || 2000;
  }

  /**
   * Recherche la geolocalisation d'une IP
   * Utilise ip-api.com (gratuit, 45 req/min)
   * Cache les resultats pendant 24h
   */
  async lookup(ip: string): Promise<GeoLocation | null> {
    // Ignore les IPs privees/localhost
    if (this.isPrivateIp(ip)) {
      this.logger.debug(`IP privee ignoree: ${ip}`);
      return null;
    }

    // Verifie le cache
    const cached = this.cache.get(ip);
    if (cached && cached.expiresAt > Date.now()) {
      this.logger.debug(`Cache hit pour IP: ${ip}`);
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.logger.warn(`ip-api.com HTTP error: ${response.status}`);
        this.cacheResult(ip, null);
        return null;
      }

      const data: IpApiResponse = await response.json();

      if (data.status === 'fail') {
        this.logger.warn(`ip-api.com lookup failed for ${ip}: ${data.message}`);
        this.cacheResult(ip, null);
        return null;
      }

      const geoLocation: GeoLocation = {
        ip: data.query || ip,
        country: data.country || 'Inconnu',
        countryCode: data.countryCode || '',
        region: data.regionName || data.region || '',
        city: data.city || 'Inconnu',
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
      };

      this.cacheResult(ip, geoLocation);
      this.logger.debug(`GeoIP lookup: ${ip} -> ${geoLocation.city}, ${geoLocation.country}`);

      return geoLocation;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn(`GeoIP lookup timeout pour IP: ${ip}`);
      } else {
        this.logger.error(`GeoIP lookup error pour IP ${ip}:`, error);
      }
      this.cacheResult(ip, null);
      return null;
    }
  }

  /**
   * Verifie si une IP est privee/locale
   */
  private isPrivateIp(ip: string): boolean {
    // IPv4 privees
    if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1') {
      return true;
    }

    // 10.0.0.0/8
    if (ip.startsWith('10.')) {
      return true;
    }

    // 172.16.0.0/12
    if (ip.startsWith('172.')) {
      const second = parseInt(ip.split('.')[1], 10);
      if (second >= 16 && second <= 31) {
        return true;
      }
    }

    // 192.168.0.0/16
    if (ip.startsWith('192.168.')) {
      return true;
    }

    // IPv6 localhost
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      return true;
    }

    return false;
  }

  /**
   * Met en cache le resultat
   */
  private cacheResult(ip: string, data: GeoLocation | null): void {
    this.cache.set(ip, {
      data,
      expiresAt: Date.now() + this.cacheTimeout,
    });

    // Nettoyage periodique du cache (garde max 1000 entrees)
    if (this.cache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of this.cache) {
        if (value.expiresAt < now) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Vide le cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log('GeoIP cache cleared');
  }
}

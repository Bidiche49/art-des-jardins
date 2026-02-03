import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException, ThrottlerRequest } from '@nestjs/throttler';
import { Request, Response } from 'express';

/**
 * Custom throttler guard with:
 * - IP whitelist for health checks and internal services
 * - X-RateLimit-* headers in responses
 * - Logging of blocked IPs
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  // Default whitelist: localhost and private ranges for health checks
  private readonly defaultWhitelist = [
    '127.0.0.1',
    '::1',
    'localhost',
  ];

  /**
   * Get the real client IP, checking X-Forwarded-For header first
   */
  protected getTrackerFromRequest(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return ips.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  /**
   * Check if IP is in whitelist
   */
  private isWhitelisted(ip: string): boolean {
    // Check default whitelist
    if (this.defaultWhitelist.includes(ip)) {
      return true;
    }

    // Check for private IP ranges (for internal health checks)
    // 10.x.x.x
    if (ip.startsWith('10.')) {
      return true;
    }
    // 172.16.x.x - 172.31.x.x
    if (ip.startsWith('172.')) {
      const secondOctet = parseInt(ip.split('.')[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) {
        return true;
      }
    }
    // 192.168.x.x
    if (ip.startsWith('192.168.')) {
      return true;
    }

    return false;
  }

  /**
   * Override canActivate to add whitelist support and logging
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = this.getTrackerFromRequest(req);

    // Skip rate limiting for whitelisted IPs
    if (this.isWhitelisted(ip)) {
      this.logger.debug(`Skipping rate limit for whitelisted IP: ${ip}`);
      return true;
    }

    try {
      const result = await super.canActivate(context);
      return result;
    } catch (error) {
      if (error instanceof ThrottlerException) {
        this.logger.warn(
          `Rate limit exceeded for IP ${ip} on ${req.method} ${req.url}`,
          { ip, method: req.method, url: req.url, userAgent: req.headers['user-agent'] },
        );
      }
      throw error;
    }
  }

  /**
   * Override handleRequest to add rate limit headers
   */
  protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context, limit, ttl } = requestProps;
    const res = context.switchToHttp().getResponse<Response>();

    try {
      const result = await super.handleRequest(requestProps);

      // Add rate limit headers on successful requests
      if (res && !res.headersSent) {
        res.setHeader('X-RateLimit-Limit', limit.toString());
        res.setHeader('X-RateLimit-Policy', `${limit};w=${Math.ceil(ttl / 1000)}`);
      }

      return result;
    } catch (error) {
      if (error instanceof ThrottlerException) {
        // Add rate limit headers on throttled requests
        const retryAfter = Math.ceil(ttl / 1000);
        res.setHeader('Retry-After', retryAfter.toString());
        res.setHeader('X-RateLimit-Limit', limit.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl).toISOString());
      }
      throw error;
    }
  }
}

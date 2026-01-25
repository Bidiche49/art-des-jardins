import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import archiver from 'archiver';
import { Writable } from 'stream';

type ExportableTable = 'clients' | 'chantiers' | 'devis' | 'factures' | 'interventions' | 'users';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  private readonly tableConfig: Record<ExportableTable, { headers: string[]; getRows: (data: any[]) => string[][] }> = {
    clients: {
      headers: ['ID', 'Type', 'Nom', 'Prenom', 'Email', 'Telephone', 'Adresse', 'CodePostal', 'Ville', 'DateCreation'],
      getRows: (data) =>
        data.map((c) => [
          c.id,
          c.type,
          c.nom,
          c.prenom || '',
          c.email,
          c.telephone,
          c.adresse,
          c.codePostal,
          c.ville,
          c.createdAt.toISOString(),
        ]),
    },
    chantiers: {
      headers: ['ID', 'ClientID', 'Adresse', 'CodePostal', 'Ville', 'TypePrestation', 'Description', 'Statut', 'DateDebut', 'DateFin', 'DateCreation'],
      getRows: (data) =>
        data.map((ch) => [
          ch.id,
          ch.clientId,
          ch.adresse,
          ch.codePostal,
          ch.ville,
          ch.typePrestation.join(','),
          ch.description,
          ch.statut,
          ch.dateDebut?.toISOString() || '',
          ch.dateFin?.toISOString() || '',
          ch.createdAt.toISOString(),
        ]),
    },
    devis: {
      headers: ['ID', 'Numero', 'ChantierID', 'DateEmission', 'DateValidite', 'TotalHT', 'TotalTVA', 'TotalTTC', 'Statut', 'DateAcceptation'],
      getRows: (data) =>
        data.map((d) => [
          d.id,
          d.numero,
          d.chantierId,
          d.dateEmission.toISOString(),
          d.dateValidite.toISOString(),
          d.totalHT.toString(),
          d.totalTVA.toString(),
          d.totalTTC.toString(),
          d.statut,
          d.dateAcceptation?.toISOString() || '',
        ]),
    },
    factures: {
      headers: ['ID', 'Numero', 'DevisID', 'DateEmission', 'DateEcheance', 'TotalHT', 'TotalTVA', 'TotalTTC', 'Statut', 'DatePaiement', 'ModePaiement'],
      getRows: (data) =>
        data.map((f) => [
          f.id,
          f.numero,
          f.devisId,
          f.dateEmission.toISOString(),
          f.dateEcheance.toISOString(),
          f.totalHT.toString(),
          f.totalTVA.toString(),
          f.totalTTC.toString(),
          f.statut,
          f.datePaiement?.toISOString() || '',
          f.modePaiement || '',
        ]),
    },
    interventions: {
      headers: ['ID', 'ChantierID', 'EmployeID', 'Date', 'HeureDebut', 'HeureFin', 'DureeMinutes', 'Description', 'Valide'],
      getRows: (data) =>
        data.map((i) => [
          i.id,
          i.chantierId,
          i.employeId,
          i.date.toISOString(),
          i.heureDebut.toISOString(),
          i.heureFin?.toISOString() || '',
          i.dureeMinutes?.toString() || '',
          i.description || '',
          i.valide ? 'Oui' : 'Non',
        ]),
    },
    users: {
      headers: ['ID', 'Email', 'Nom', 'Prenom', 'Role', 'Actif', 'DerniereConnexion', 'DateCreation'],
      getRows: (data) =>
        data.map((u) => [
          u.id,
          u.email,
          u.nom,
          u.prenom,
          u.role,
          u.actif ? 'Oui' : 'Non',
          u.derniereConnexion?.toISOString() || '',
          u.createdAt.toISOString(),
        ]),
    },
  };

  async exportCsv(table: ExportableTable): Promise<string> {
    const config = this.tableConfig[table];
    if (!config) {
      throw new BadRequestException(`Table '${table}' non exportable`);
    }

    const data = await this.fetchTableData(table);
    const rows = config.getRows(data);

    const csv = [
      config.headers.join(';'),
      ...rows.map((row) => row.map((cell) => this.escapeCsvCell(cell)).join(';')),
    ].join('\n');

    return csv;
  }

  async exportFull(outputStream: Writable): Promise<void> {
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(outputStream);

    const tables: ExportableTable[] = ['clients', 'chantiers', 'devis', 'factures', 'interventions', 'users'];

    for (const table of tables) {
      const csv = await this.exportCsv(table);
      archive.append(csv, { name: `${table}.csv` });
    }

    // Add metadata
    const metadata = {
      exportDate: new Date().toISOString(),
      tables: tables,
      version: '1.0',
    };
    archive.append(JSON.stringify(metadata, null, 2), { name: 'metadata.json' });

    await archive.finalize();
  }

  private async fetchTableData(table: ExportableTable): Promise<any[]> {
    switch (table) {
      case 'clients':
        return this.prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
      case 'chantiers':
        return this.prisma.chantier.findMany({ orderBy: { createdAt: 'desc' } });
      case 'devis':
        return this.prisma.devis.findMany({ orderBy: { createdAt: 'desc' } });
      case 'factures':
        return this.prisma.facture.findMany({ orderBy: { createdAt: 'desc' } });
      case 'interventions':
        return this.prisma.intervention.findMany({ orderBy: { date: 'desc' } });
      case 'users':
        return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
      default:
        throw new BadRequestException(`Table '${table}' inconnue`);
    }
  }

  private escapeCsvCell(value: string): string {
    if (!value) return '';
    // Escape quotes and wrap in quotes if contains special chars
    if (value.includes(';') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  getExportableTables(): string[] {
    return Object.keys(this.tableConfig);
  }
}

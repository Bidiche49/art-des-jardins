import { Injectable, Logger } from '@nestjs/common';
import PDFDocument = require('pdfkit');

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  siret?: string;
}

export interface ClientInfo {
  nom: string;
  prenom?: string;
  raisonSociale?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  email: string;
}

export interface DocumentLine {
  designation: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  montantHT: number;
}

export interface SignatureData {
  imageBase64: string;
  signedAt: Date;
  ipAddress: string;
  reference: string;
}

export interface DevisData {
  numero: string;
  dateCreation: Date;
  dateValidite: Date;
  client: ClientInfo;
  lignes: DocumentLine[];
  totalHT: number;
  tauxTVA: number;
  montantTVA: number;
  totalTTC: number;
  notes?: string;
  signature?: SignatureData;
}

export interface FactureData {
  numero: string;
  dateCreation: Date;
  dateEcheance: Date;
  client: ClientInfo;
  lignes: DocumentLine[];
  totalHT: number;
  tauxTVA: number;
  montantTVA: number;
  totalTTC: number;
  devisNumero?: string;
  notes?: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  private readonly company: CompanyInfo = {
    name: 'Art & Jardin',
    address: '15 rue des Jardins, 49000 Angers',
    phone: '02 41 XX XX XX',
    email: 'contact@artjardin.fr',
    siret: 'XXX XXX XXX XXXXX',
  };

  async generateDevis(data: DevisData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        this.addHeader(doc, 'DEVIS');

        // Document info
        doc.fontSize(10);
        doc.text(`Devis N° ${data.numero}`, 400, 100, { align: 'right' });
        doc.text(`Date: ${this.formatDate(data.dateCreation)}`, { align: 'right' });
        doc.text(`Validité: ${this.formatDate(data.dateValidite)}`, { align: 'right' });

        // Client info
        this.addClientInfo(doc, data.client, 150);

        // Lines table
        this.addLinesTable(doc, data.lignes, 280);

        // Totals
        const totalsY = 280 + 30 + data.lignes.length * 25 + 20;
        this.addTotals(doc, data, totalsY);

        // Notes
        if (data.notes) {
          doc.moveDown(2);
          doc.fontSize(9).text(`Notes: ${data.notes}`);
        }

        // Footer / Signature
        if (data.signature) {
          this.addElectronicSignature(doc, data.signature);
        } else {
          this.addDevisFooter(doc);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateFacture(data: FactureData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        this.addHeader(doc, 'FACTURE');

        // Document info
        doc.fontSize(10);
        doc.text(`Facture N° ${data.numero}`, 400, 100, { align: 'right' });
        doc.text(`Date: ${this.formatDate(data.dateCreation)}`, { align: 'right' });
        doc.text(`Échéance: ${this.formatDate(data.dateEcheance)}`, { align: 'right' });
        if (data.devisNumero) {
          doc.text(`Réf. Devis: ${data.devisNumero}`, { align: 'right' });
        }

        // Client info
        this.addClientInfo(doc, data.client, 150);

        // Lines table
        this.addLinesTable(doc, data.lignes, 280);

        // Totals
        const totalsY = 280 + 30 + data.lignes.length * 25 + 20;
        this.addTotals(doc, data, totalsY);

        // Notes
        if (data.notes) {
          doc.moveDown(2);
          doc.fontSize(9).text(`Notes: ${data.notes}`);
        }

        // Footer
        this.addFactureFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(doc: PDFKit.PDFDocument, title: string): void {
    // Company info
    doc.fontSize(18).font('Helvetica-Bold').text(this.company.name, 50, 50);
    doc.fontSize(9).font('Helvetica');
    doc.text(this.company.address);
    doc.text(`Tél: ${this.company.phone}`);
    doc.text(`Email: ${this.company.email}`);
    if (this.company.siret) {
      doc.text(`SIRET: ${this.company.siret}`);
    }

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text(title, 400, 50, { align: 'right' });
  }

  private addClientInfo(doc: PDFKit.PDFDocument, client: ClientInfo, y: number): void {
    doc.fontSize(10).font('Helvetica-Bold').text('DESTINATAIRE', 350, y);
    doc.font('Helvetica');

    const clientName = client.raisonSociale || `${client.prenom || ''} ${client.nom}`.trim();
    doc.text(clientName, 350, y + 15);
    doc.text(client.adresse);
    doc.text(`${client.codePostal} ${client.ville}`);
    doc.text(client.email);
  }

  private addLinesTable(doc: PDFKit.PDFDocument, lignes: DocumentLine[], startY: number): void {
    const tableTop = startY;
    const colWidths = [200, 60, 50, 80, 80];
    const headers = ['Désignation', 'Qté', 'Unité', 'P.U. HT', 'Total HT'];

    // Header row
    doc.font('Helvetica-Bold').fontSize(9);
    let x = 50;
    headers.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: i > 0 ? 'right' : 'left' });
      x += colWidths[i] + 10;
    });

    // Separator line
    doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

    // Data rows
    doc.font('Helvetica').fontSize(9);
    let y = tableTop + 25;

    lignes.forEach((ligne) => {
      x = 50;
      doc.text(ligne.designation, x, y, { width: colWidths[0] });
      x += colWidths[0] + 10;
      doc.text(ligne.quantite.toString(), x, y, { width: colWidths[1], align: 'right' });
      x += colWidths[1] + 10;
      doc.text(ligne.unite, x, y, { width: colWidths[2], align: 'right' });
      x += colWidths[2] + 10;
      doc.text(this.formatMoney(ligne.prixUnitaire), x, y, { width: colWidths[3], align: 'right' });
      x += colWidths[3] + 10;
      doc.text(this.formatMoney(ligne.montantHT), x, y, { width: colWidths[4], align: 'right' });
      y += 25;
    });

    // Bottom line
    doc.moveTo(50, y).lineTo(545, y).stroke();
  }

  private addTotals(doc: PDFKit.PDFDocument, data: DevisData | FactureData, y: number): void {
    const x = 400;
    doc.fontSize(10);

    doc.text('Total HT:', x, y);
    doc.text(this.formatMoney(data.totalHT), x + 80, y, { align: 'right', width: 65 });

    doc.text(`TVA (${data.tauxTVA}%):`, x, y + 15);
    doc.text(this.formatMoney(data.montantTVA), x + 80, y + 15, { align: 'right', width: 65 });

    doc.font('Helvetica-Bold');
    doc.text('Total TTC:', x, y + 35);
    doc.text(this.formatMoney(data.totalTTC), x + 80, y + 35, { align: 'right', width: 65 });
    doc.font('Helvetica');
  }

  private addDevisFooter(doc: PDFKit.PDFDocument): void {
    const y = doc.page.height - 100;
    doc.fontSize(8);
    doc.text(
      'Conditions: Ce devis est valable 30 jours à compter de sa date d\'émission. ' +
      'Toute commande implique l\'acceptation des présentes conditions.',
      50, y, { width: 500 }
    );
    doc.moveDown();
    doc.text('Signature précédée de la mention "Bon pour accord":');
    doc.moveDown(2);
    doc.text('Date:                          Signature:');
  }

  private addElectronicSignature(doc: PDFKit.PDFDocument, signature: SignatureData): void {
    const y = doc.page.height - 180;
    const boxWidth = 500;
    const boxX = 50;

    // Separator line
    doc.moveTo(boxX, y).lineTo(boxX + boxWidth, y).stroke();

    // Title
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('SIGNATURE ELECTRONIQUE', boxX, y + 10, { align: 'center', width: boxWidth });

    // Signature image
    doc.font('Helvetica');
    if (signature.imageBase64) {
      try {
        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64Data = signature.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Center the signature image
        doc.image(imageBuffer, boxX + 150, y + 30, {
          fit: [200, 80],
          align: 'center',
        });
      } catch (error) {
        this.logger.warn('Failed to embed signature image in PDF', error);
        doc.fontSize(9).text('[Signature electronique enregistree]', boxX, y + 50, {
          align: 'center',
          width: boxWidth
        });
      }
    }

    // Signature details
    const signedDate = new Date(signature.signedAt);
    const dateStr = signedDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = signedDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    doc.fontSize(10);
    doc.text(`Signe le ${dateStr} a ${timeStr}`, boxX, y + 120, { align: 'center', width: boxWidth });

    // Legal mention
    doc.fontSize(8).fillColor('#666666');
    doc.text(
      'Document signe electroniquement conformement aux articles 1366 et 1367 du Code civil.',
      boxX, y + 140, { align: 'center', width: boxWidth }
    );

    // Technical reference (small text)
    doc.fontSize(7).fillColor('#999999');
    doc.text(
      `Ref: ${signature.reference} | IP: ${signature.ipAddress}`,
      boxX, y + 155, { align: 'center', width: boxWidth }
    );

    // Reset color
    doc.fillColor('#000000');

    // Bottom line
    doc.moveTo(boxX, y + 170).lineTo(boxX + boxWidth, y + 170).stroke();
  }

  private addFactureFooter(doc: PDFKit.PDFDocument): void {
    const y = doc.page.height - 80;
    doc.fontSize(8);
    doc.text(
      `Conditions de paiement: Paiement à réception de facture. ` +
      `En cas de retard de paiement, des pénalités de 3 fois le taux d'intérêt légal seront appliquées. ` +
      `Indemnité forfaitaire de recouvrement: 40€.`,
      50, y, { width: 500 }
    );
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  private formatMoney(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }
}

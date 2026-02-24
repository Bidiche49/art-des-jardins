import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { StorageService } from '../storage/storage.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private storageService: StorageService,
    private configService: ConfigService,
  ) {}

  async submitContact(
    dto: CreateContactDto,
    files?: Express.Multer.File[],
    ip?: string,
    userAgent?: string,
  ): Promise<{ success: true; id: string }> {
    // Honeypot: si rempli, c'est un bot → 200 silencieux
    if (dto.honeypot) {
      this.logger.debug('Honeypot triggered, ignoring submission');
      return { success: true, id: 'ignored' };
    }

    // Upload photos vers S3 si presentes
    const photoKeys: string[] = [];
    if (files?.length && this.storageService.isConfigured()) {
      for (const file of files) {
        try {
          const result = await this.storageService.upload(file, 'contact-photos');
          photoKeys.push(result.key);
        } catch (error) {
          this.logger.warn(`Failed to upload photo: ${(error as Error).message}`);
        }
      }
    }

    // Creer ContactRequest en BDD
    const contactRequest = await this.prisma.contactRequest.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        city: dto.city,
        service: dto.service,
        message: dto.message,
        photoKeys,
        source: 'website',
        ipAddress: ip,
        userAgent,
      },
    });

    // Envoyer email de notification
    const recipientEmail = this.configService.get<string>(
      'CONTACT_RECIPIENT_EMAIL',
      'artdesjardins49@gmail.com',
    );

    const serviceLabel = dto.service || 'Demande generale';
    const subject = `Nouveau contact — ${serviceLabel} — ${dto.name}`;

    const photoLinksHtml = photoKeys.length
      ? `<p><strong>Photos jointes :</strong> ${photoKeys.length} fichier(s)</p>
         <ul>${photoKeys.map((key) => `<li>${key}</li>`).join('')}</ul>`
      : '';

    const html = `
      <h2>Nouvelle demande de contact</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nom</td><td style="padding:8px;border:1px solid #ddd;">${dto.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${dto.email}">${dto.email}</a></td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Telephone</td><td style="padding:8px;border:1px solid #ddd;">${dto.phone || 'Non renseigne'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Ville</td><td style="padding:8px;border:1px solid #ddd;">${dto.city || 'Non renseigne'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Service</td><td style="padding:8px;border:1px solid #ddd;">${serviceLabel}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap;">${dto.message}</p>
      ${photoLinksHtml}
      <hr>
      <p style="color:#888;font-size:12px;">Source : formulaire vitrine | IP : ${ip || 'inconnue'}</p>
    `;

    try {
      await this.mailService.sendMail({
        to: recipientEmail,
        subject,
        html,
        documentType: 'contact',
        documentId: contactRequest.id,
        templateName: 'contact-notification',
        skipBcc: true,
      });
    } catch (error) {
      this.logger.error(`Failed to send contact notification email: ${(error as Error).message}`);
      // On ne fail pas la requete si l'email echoue — le lead est sauve en BDD
    }

    this.logger.log(`New contact request created: ${contactRequest.id} from ${dto.name}`);
    return { success: true, id: contactRequest.id };
  }
}

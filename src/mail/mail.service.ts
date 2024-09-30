import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as nodemailerSendgrid from 'nodemailer-sendgrid';
import * as nodemailerMailgun from 'nodemailer-mailgun-transport';
import * as quotedPrintable from 'quoted-printable';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    const mailServiceMode = process.env.MAIL_SERVICE_MODE;
    if (mailServiceMode === 'local') {
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    } else if (mailServiceMode === 'sendgrid') {
      this.transporter = nodemailer.createTransport(nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
      }));
    } else if (mailServiceMode === 'mailgun') {
      this.transporter = nodemailer.createTransport(nodemailerMailgun({
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        }
      }));
    }
  }
  async sendEmail(to: string): Promise<void> {
    const mailOptions = {
      from: '"YourAppName" <noreply@yourapp.com>',
      to,
      subject: 'Password Reset Request',
      html: `This is a testing email`,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      if (process.env.MAIL_SERVICE_MODE === 'local') {
        console.log('Local email content:', quotedPrintable.decode(info.message.toString()));
      } else {
        console.log('Email sent: %s', info.messageId);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
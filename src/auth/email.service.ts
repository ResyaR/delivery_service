import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get('GMAIL_USER');
    const pass = this.configService.get('GMAIL_APP_PASSWORD');
    
    if (!user || !pass) {
      console.error('Email configuration missing:', {
        hasUser: !!user,
        hasPass: !!pass
      });
      throw new Error('Email configuration is missing');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: user,
        pass: pass,
      },
      debug: false // Disable debugging
    });

    // Verify the connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email transport verification failed:', error);
      } else {
        console.log('Email transport is ready to take messages');
      }
    });
  }

  async sendVerificationEmail(to: string, otp: string) {
    const mailOptions = {
      from: '"No Reply - MT Trans" <noreply@deliveryservice.com>',
      to,
      subject: 'Email Verification - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for registering. To complete your registration, please use the following OTP code:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0066cc; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 5 minutes. You can request a new code after it expires.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
      });
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
}
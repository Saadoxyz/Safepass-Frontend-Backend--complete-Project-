import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

/* -------------------- */
/* TYPE DEFINITIONS */
/* -------------------- */

interface Visitor {
  name: string;
  visitDate: Date | string;
  purpose: string;
}

interface GatePass {
  gatePassNumber: string;
  validUntil: Date;
  qrCode: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD) {
      throw new Error('Missing email configuration environment variables');
    }

    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: false, // true for 465, false for others
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
  }

  /* -------------------- */
  /* PASSWORD RESET */
  /* -------------------- */

  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    isRegistered: boolean = true,
  ): Promise<void> {
    try {
      this.logger.log(`Sending password reset email to ${email}`);

      // Determine email subject and content based on whether user is registered
      const htmlContent = isRegistered
        ? this.getRegisteredUserResetEmailHtml(resetUrl)
        : this.getUnregisteredUserResetEmailHtml();

      const textContent = isRegistered
        ? this.getRegisteredUserResetEmailText(resetUrl)
        : this.getUnregisteredUserResetEmailText();

      const info = await this.transporter.sendMail({
        from: `"SafePass" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'SafePass - Password Reset Request',
        html: htmlContent,
        text: textContent,
      });

      this.logger.log(
        `Password reset email sent successfully to ${email}: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}:`,
        error,
      );
      throw error;
    }
  }

  private getRegisteredUserResetEmailHtml(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>SafePass</h2>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h3>Hello,</h3>
              <p>We received a request to reset the password for your SafePass account. If you didn't make this request, you can ignore this email.</p>
              
              <p>To reset your password, click the button below:</p>
              
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                <small>${resetUrl}</small>
              </p>
              
              <div class="warning">
                <strong>⏰ Important:</strong> This password reset link will expire in 1 hour. If you need to reset your password after this time, please request a new reset link.
              </div>
              
              <p><strong>For Security:</strong></p>
              <ul>
                <li>Never share this link with anyone</li>
                <li>SafePass will never ask for your password via email</li>
                <li>Make sure you're resetting your password on the official SafePass website</li>
              </ul>
              
              <div class="footer">
                <p>If you have any questions or concerns, please contact your administrator.</p>
                <p>© SafePass Security System. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getUnregisteredUserResetEmailHtml(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .info-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>SafePass</h2>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h3>Hello,</h3>
              <p>We received a password reset request for this email address. However, this email is not currently registered with a SafePass account.</p>
              
              <div class="info-box">
                <strong>What does this mean?</strong>
                <p>If you have a SafePass account, please make sure you're using the correct email address associated with your account.</p>
              </div>
              
              <p><strong>What you can do:</strong></p>
              <ul>
                <li>If you have an account, try resetting with your registered email</li>
                <li>If you don't have an account yet, please contact your administrator to register</li>
                <li>If you need help, reach out to your system administrator</li>
              </ul>
              
              <p>If you did not request a password reset, you can safely ignore this email.</p>
              
              <div class="footer">
                <p>If you have any questions or concerns, please contact your administrator.</p>
                <p>© SafePass Security System. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getRegisteredUserResetEmailText(resetUrl: string): string {
    return `
Password Reset Request

Hello,

We received a request to reset the password for your SafePass account. If you didn't make this request, you can ignore this email.

To reset your password, visit this link:
${resetUrl}

IMPORTANT: This link will expire in 1 hour.

For Security:
- Never share this link with anyone
- SafePass will never ask for your password via email
- Make sure you're resetting your password on the official SafePass website

If you have any questions, please contact your administrator.

© SafePass Security System
    `;
  }

  private getUnregisteredUserResetEmailText(): string {
    return `
Password Reset Request

Hello,

We received a password reset request for this email address. However, this email is not currently registered with a SafePass account.

What does this mean?
If you have a SafePass account, please make sure you're using the correct email address associated with your account.

What you can do:
- If you have an account, try resetting with your registered email
- If you don't have an account yet, please contact your administrator to register
- If you need help, reach out to your system administrator

If you did not request a password reset, you can safely ignore this email.

If you have any questions, please contact your administrator.

© SafePass Security System
    `;
  }

  /* -------------------- */
  /* VISITOR REQUEST */
  /* -------------------- */

  async sendVisitorRequestEmail(
    email: string,
    visitor: Visitor,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"SafePass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Visitor Registration Confirmation',
      html: `
        <h2>Visitor Registration Successful</h2>
        <p>Dear ${visitor.name},</p>
        <p>Your visitor registration has been submitted successfully.</p>

        <ul>
          <li>Visit Date: ${new Date(visitor.visitDate).toLocaleDateString()}</li>
          <li>Purpose: ${visitor.purpose}</li>
          <li>Status: Pending Approval</li>
        </ul>

        <p>You will receive an email once your visit is approved.</p>
      `,
    });
  }

  /* -------------------- */
  /* VISITOR APPROVAL */
  /* -------------------- */

  async sendVisitorApprovalEmail(
    email: string,
    visitor: Visitor,
    gatePass: GatePass,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"SafePass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Visitor Request Approved - Gate Pass Attached',
      html: `
        <h2>Your Visit Has Been Approved!</h2>
        <p>Dear ${visitor.name},</p>

        <p><strong>Gate Pass Details:</strong></p>
        <ul>
          <li>Gate Pass Number: ${gatePass.gatePassNumber}</li>
          <li>Valid Until: ${gatePass.validUntil.toLocaleString()}</li>
        </ul>

        <p>
          Download your gate pass:
          <a href="${process.env.FRONTEND_URL}/gate-pass/${gatePass.gatePassNumber}">
            Download
          </a>
        </p>

        <img
          src="${gatePass.qrCode}"
          alt="QR Code"
          style="width:200px;height:200px;"
        />
      `,
    });
  }

  /* -------------------- */
  /* VISITOR REJECTION */
  /* -------------------- */

  async sendVisitorRejectionEmail(
    email: string,
    visitor: Visitor,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"SafePass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Visitor Request Update',
      html: `
        <h2>Visitor Request Status Update</h2>
        <p>Dear ${visitor.name},</p>
        <p>Your visitor request has not been approved at this time.</p>
        <p>If you have questions, please contact the host.</p>
      `,
    });
  }
}

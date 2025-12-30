import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserDocument } from '../users/schemas/user.schema';

// Helper function for safe ID conversion
function getUserId(user: UserDocument): string {
  // Check if _id exists and has toString method
  if (user._id && typeof user._id.toString === 'function') {
    return user._id.toString();
  }
  // Fallback for any other case
  return String(user._id);
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const userId = getUserId(user);

    const payload = {
      email: user.email,
      sub: userId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const userId = getUserId(user);

    const payload = {
      email: user.email,
      sub: userId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        profileImage: user.profileImage,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.usersService.findByEmail(
        forgotPasswordDto.email,
      );

      if (user) {
        // User exists - generate reset token and send reset email
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000);

        const userId = getUserId(user);

        await this.usersService.updateResetToken(
          userId,
          resetPasswordToken,
          resetPasswordExpires,
        );

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        this.logger.log(`Initiating password reset for user: ${user.email}`);
        await this.emailService.sendPasswordResetEmail(
          user.email,
          resetUrl,
          true,
        );
      } else {
        // User doesn't exist - still send email for security (don't leak whether email is registered)
        this.logger.log(
          `Forgot password request for non-existent email (still sending email): ${forgotPasswordDto.email}`,
        );
        await this.emailService.sendPasswordResetEmail(
          forgotPasswordDto.email,
          '',
          false,
        );
      }

      return {
        message: 'If email exists, reset link will be sent',
      };
    } catch (error) {
      this.logger.error(
        `Error in forgotPassword for ${forgotPasswordDto.email}:`,
        error,
      );
      // Still return generic message for security
      return {
        message: 'If email exists, reset link will be sent',
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    const user = await this.usersService.findByResetToken(hashedToken);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    const userId = getUserId(user);

    await this.usersService.updatePassword(userId, hashedPassword);

    return { message: 'Password reset successful' };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}

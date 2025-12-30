import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

// Define JWT payload interface
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
  ) {}

  @Post('profile-image')
  @UseInterceptors(
    FileInterceptor('file', new UploadService().getMulterConfig()),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: JwtPayload },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      console.log('Uploading profile image for user:', req.user.userId);
      console.log('File info:', {
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      });

      const imageUrl = `/uploads/profiles/${file.filename}`;
      console.log('Saving image URL to MongoDB:', imageUrl);

      const result = await this.usersService.updateProfileImage(
        req.user.userId,
        imageUrl,
      );
      console.log('MongoDB update result:', result ? 'SUCCESS' : 'FAILED');

      return {
        message: 'Profile image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
}

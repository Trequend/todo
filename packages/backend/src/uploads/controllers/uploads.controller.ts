import {
  Controller,
  Get,
  Param,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { FileFilterService } from '../services/file-filter.service';
import { UploadsService } from '../services/uploads.service';
import { FilteredFile } from '../types/filtered-file.type';

@Auth()
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly fileFilterService: FileFilterService
  ) {}

  @Get()
  async getFiles(@UserId() userId: string): Promise<Array<FilteredFile>> {
    const files = await this.uploadsService.findUserFiles(userId);
    return files.map((file) => this.fileFilterService.filterFile(file));
  }

  @Get(':id/info')
  async getFile(
    @UserId() userId: string,
    @Param('id') id: string
  ): Promise<FilteredFile> {
    const file = await this.uploadsService.getUserFileById(id, userId);
    return this.fileFilterService.filterFile(file);
  }

  @Get(':id')
  async readFile(
    @Response({ passthrough: true }) response: any,
    @UserId() userId: string,
    @Param('id') id: string
  ) {
    const file = await this.uploadsService.getUserFileById(id, userId);
    const stream = await this.uploadsService.getFileReadStream(id, userId);
    response.header('Content-Type', file.contentType);
    return new StreamableFile(stream);
  }
}

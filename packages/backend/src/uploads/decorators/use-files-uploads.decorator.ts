import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesUploadsInterceptor } from '../interceptors/files-uploads.interceptor';
import { FilesUploadsOptions as OptionsType } from '../types/files-uploads-options.type';
import { FilesUploadsOptions } from './files-uploads-options.decorator';

export const UseFilesUploads = (options?: OptionsType) =>
  applyDecorators(
    FilesUploadsOptions(options),
    UseInterceptors(FilesUploadsInterceptor)
  );

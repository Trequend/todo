import { SetMetadata } from '@nestjs/common';
import { FILES_UPLOADS_OPTIONS } from '../constants';
import { FilesUploadsOptions as OptionsType } from '../types/files-uploads-options.type';

export const FilesUploadsOptions = (options: OptionsType) =>
  SetMetadata(FILES_UPLOADS_OPTIONS, options);

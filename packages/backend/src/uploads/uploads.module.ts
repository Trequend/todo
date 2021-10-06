import { Global, Module } from '@nestjs/common';
import { UploadsController } from './controllers/uploads.controller';
import { UploadsService } from './services/uploads.service';
import { FileFilterService } from './services/file-filter.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { BUCKET } from './constants';
import { FilesUploadsInterceptor } from './interceptors/files-uploads.interceptor';

@Global()
@Module({
  providers: [
    UploadsService,
    FileFilterService,
    FilesUploadsInterceptor,
    {
      provide: BUCKET,
      useFactory: async (connection: Connection) => {
        await new Promise((resolve, reject) => {
          connection.on('open', resolve).on('error', reject);
        });

        return new GridFSBucket(connection.db);
      },
      inject: [getConnectionToken()],
    },
  ],
  controllers: [UploadsController],
  exports: [UploadsService, FilesUploadsInterceptor],
})
export class UploadsModule {}

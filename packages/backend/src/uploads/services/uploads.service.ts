import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MultipartFile } from 'fastify-multipart';
import {
  GridFSBucket,
  GridFSFile,
  FindOptions,
  Document,
  Filter,
  ObjectId,
  GridFSBucketReadStream,
} from 'mongodb';
import { Writable } from 'stream';
import { BUCKET } from '../constants';
import { pipeline } from 'stream/promises';

@Injectable()
export class UploadsService {
  constructor(@Inject(BUCKET) private readonly bucket: GridFSBucket) {}

  isUserFile(file: GridFSFile, userId: string) {
    return file.metadata && file.metadata.userId === userId;
  }

  async findOne(filter: Filter<GridFSFile>): Promise<GridFSFile | undefined> {
    const cursor = this.bucket.find(filter, { limit: 1 });
    const hasNext = await cursor.hasNext();
    if (hasNext) {
      return await cursor.next();
    } else {
      return undefined;
    }
  }

  async findById(id: string): Promise<GridFSFile | undefined> {
    return await this.findOne({ _id: new ObjectId(id) });
  }

  async find(
    filter: Filter<GridFSFile> | undefined,
    options?: FindOptions<Document>
  ): Promise<Array<GridFSFile>> {
    const cursor = this.bucket.find(filter, options);
    const result: Array<GridFSFile> = [];
    while (await cursor.hasNext()) {
      const file = await cursor.next();
      result.push(file);
    }

    return result;
  }

  async uploadFile(
    userId: string,
    { file, filename, mimetype }: MultipartFile,
    metadata?: Record<string, any>
  ): Promise<string> {
    const id = new ObjectId();
    const uploadStream = this.bucket.openUploadStreamWithId(id, filename, {
      contentType: mimetype,
      metadata: { ...(metadata ?? {}), userId },
    });

    await pipeline(file, uploadStream as Writable);
    if ((file as any).truncated) {
      this.deleteFile(id.toString(), userId);
      throw new BadRequestException('File too large');
    }

    return id.toString();
  }

  async findUserFiles(userId: string, options?: FindOptions<Document>) {
    return await this.find(
      {
        metadata: {
          userId,
        },
      },
      options
    );
  }

  async getUserFileById(id: string, userId: string): Promise<GridFSFile> {
    const file = await this.findById(id);
    if (file && this.isUserFile(file, userId)) {
      return file;
    } else {
      throw new NotFoundException('File not found');
    }
  }

  async getFileReadStream(
    id: string,
    userId: string
  ): Promise<GridFSBucketReadStream> {
    const file = await this.findById(id);
    if (file && this.isUserFile(file, userId)) {
      return this.bucket.openDownloadStream(new ObjectId(id));
    } else {
      throw new NotFoundException('File not found');
    }
  }

  async deleteFile(id: string, userId: string) {
    const file = await this.findById(id);
    if (file && this.isUserFile(file, userId)) {
      await this.bucket.delete(new ObjectId(id));
    }
  }
}

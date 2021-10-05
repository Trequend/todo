import { Injectable } from '@nestjs/common';
import { GridFSFile } from 'mongodb';
import { FilteredFile } from '../types/filtered-file.type';

@Injectable()
export class FileFilterService {
  filterFile(file: GridFSFile): FilteredFile {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { _id, chunkSize, aliases, ...rest } = file;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}

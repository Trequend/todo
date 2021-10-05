import { GridFSFile } from 'mongodb';

export type FilteredFile = Omit<
  { id: string } & GridFSFile,
  '_id' | 'aliases' | 'chunkSize'
>;

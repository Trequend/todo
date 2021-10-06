import { DynamicModule, Module } from '@nestjs/common';
import {
  getConnectionToken,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MODEL } from './constants';
import { WatchModelService } from './services/watch-model.service';

@Module({
  providers: [WatchModelService],
  exports: [WatchModelService],
})
export class WatchModelModule {
  static register(model: ModelDefinition): DynamicModule {
    const databaseModule = MongooseModule.forFeature([model]);

    return {
      module: WatchModelModule,
      imports: [databaseModule],
      providers: [
        {
          provide: MODEL,
          useFactory: (connection: Connection) => {
            return connection.model(model.name, model.schema);
          },
          inject: [getConnectionToken()],
        },
      ],
      exports: [databaseModule],
    };
  }
}

import { Inject, Injectable, MessageEvent } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  interval,
  map,
  merge,
  Observable,
  Observer,
  Subject,
  Subscription,
} from 'rxjs';
import { DatabaseEvent } from './types/database-event';

@Injectable()
export class WatchModelService<TModel, TDocument = TModel & Document> {
  private subject = new Subject<DatabaseEvent<TDocument>>();

  constructor(@Inject('MODEL') private readonly model: Model<TModel>) {
    this.watch(model);
  }

  private watch(model: Model<TModel>) {
    model
      .watch(undefined, {
        fullDocument: 'updateLookup',
      })
      .on('change', (event) => {
        const id = event.documentKey['_id'].toString();
        switch (event.operationType) {
          case 'insert':
            this.subject.next({
              id,
              type: 'insert',
              document: event.fullDocument as TDocument,
            });
            break;
          case 'update':
            this.subject.next({
              id,
              type: 'update',
              document: event.fullDocument as TDocument,
            });
            break;
          case 'delete':
            this.subject.next({
              id,
              type: 'delete',
            });
            break;
        }
      });
  }

  subscribe(
    observer: Partial<Observer<DatabaseEvent<TDocument>>>
  ): Subscription {
    return this.subject.subscribe(observer);
  }

  stream(
    id: string,
    transform?: (model: TDocument) => any
  ): Observable<MessageEvent> {
    const TWENTY_SECONDS = 1000 * 20;
    const comment = this.createCommentStream(TWENTY_SECONDS);
    const database = this.createDatabaseStream(id, transform);
    return merge(comment, database);
  }

  private createCommentStream(period: number): Observable<MessageEvent> {
    return interval(period).pipe(
      map(() => {
        return {
          type: 'comment',
          data: 'ALIVE',
        };
      })
    );
  }

  private createDatabaseStream(
    id: string,
    transform?: (model: TDocument) => any
  ): Observable<MessageEvent> {
    return this.subject.pipe(
      map((event) => {
        if (event.id !== id) {
          return;
        }

        switch (event.type) {
          case 'insert':
            return {
              type: 'init',
              data: transform ? transform(event.document) : event.document,
            };
          case 'update':
            return {
              type: 'init',
              data: transform ? transform(event.document) : event.document,
            };
          case 'delete':
            return {
              type: 'delete',
              data: event.id,
            };
          default:
            throw new Error('Not implemented');
        }
      })
    );
  }
}

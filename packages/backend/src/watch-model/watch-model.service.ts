import { Inject, Injectable, MessageEvent } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { interval, map, merge, Observable } from 'rxjs';
import { MODEL } from './constants';

export type StreamOptions<TDocument> = {
  transform?: (model: TDocument) => any;
};

const TWENTY_SECONDS = 1000 * 20;

@Injectable()
export class WatchModelService<TModel, TDocument = TModel & Document> {
  constructor(@Inject(MODEL) private readonly model: Model<TModel>) {}

  watch(
    pipeline?: Record<string, unknown>[],
    options: StreamOptions<TDocument> = {}
  ) {
    const comment$ = this.createCommentStream(TWENTY_SECONDS);
    const database$ = this.createDatabaseStream(pipeline, options);
    return merge(comment$, database$);
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
    pipeline?: Record<string, unknown>[],
    { transform }: StreamOptions<TDocument> = {}
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      let closed = false;

      const stream = this.model
        .watch(pipeline, {
          fullDocument: 'updateLookup',
        })
        .on('change', (event) => {
          const document =
            event.fullDocument && transform
              ? transform(event.fullDocument as TDocument)
              : event.fullDocument;

          switch (event.operationType) {
            case 'insert':
              subscriber.next({
                type: 'init',
                data: JSON.stringify(document),
              });
              break;
            case 'update':
              if (event.updateDescription.updatedFields.deleted) {
                subscriber.next({
                  type: 'delete',
                  data: {
                    id: event.fullDocument._id.toString(),
                  },
                });
              } else {
                subscriber.next({
                  type: 'init',
                  data: JSON.stringify(document),
                });
              }

              break;
          }
        })
        .on('close', () => {
          if (closed) {
            return;
          }

          subscriber.complete();
        });

      return () => {
        closed = true;
        stream.close();
      };
    });
  }
}

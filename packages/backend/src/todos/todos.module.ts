import { Module } from '@nestjs/common';
import { WatchModelModule } from 'src/watch-model/watch-model.module';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [
    WatchModelModule.register({
      name: Todo.name,
      schema: TodoSchema,
    }),
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}

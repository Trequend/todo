import { Module } from '@nestjs/common';
import { WatchModelModule } from 'src/watch-model/watch-model.module';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodosController } from './controllers/todos.controller';
import { TodosService } from './services/todos.service';

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

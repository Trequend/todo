import {
  Body,
  Controller,
  Delete,
  Get,
  MessageEvent,
  Post,
  Put,
  Sse,
  Param,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { WatchModelService } from 'src/watch-model/services/watch-model.service';
import { ChangeTodoDto } from '../dto/change-todo.dto';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../schemas/todo.schema';
import { TodosService } from '../services/todos.service';
import { FilteredTodo } from '../types/filtered-todo';

@Auth()
@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly watchModelService: WatchModelService<Todo>
  ) {}

  @Get()
  async getTodos(@UserId() userId: string): Promise<FilteredTodo[]> {
    const todos = await this.todosService.getUserTodos(userId);
    return todos.map(this.todosService.filterTodo);
  }

  @Post()
  async createTodo(
    @UserId() userId: string,
    @Body() createTodoDto: CreateTodoDto
  ): Promise<FilteredTodo> {
    const todo = await this.todosService.createTodo(userId, createTodoDto);
    return this.todosService.filterTodo(todo);
  }

  @Put(':id')
  async changeTodo(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() changeTodoDto: ChangeTodoDto
  ) {
    const todo = await this.todosService.changeTodo(userId, id, changeTodoDto);
    return this.todosService.filterTodo(todo);
  }

  @Delete(':id')
  async deleteTodo(@UserId() userId: string, @Param('id') id: string) {
    await this.todosService.deleteTodo(userId, id);
  }

  @Sse('sse')
  sse(@UserId() userId: string): Observable<MessageEvent> {
    return this.watchModelService.watch(
      [
        {
          $match: {
            'fullDocument.userId': userId,
          },
        },
      ],
      {
        transform: this.todosService.filterTodo,
      }
    );
  }
}

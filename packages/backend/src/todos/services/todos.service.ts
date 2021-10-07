import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo, TodoDocument } from '../schemas/todo.schema';
import { FilteredTodo } from '../types/filtered-todo';
import { ChangeTodoDto } from '../dto/change-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>
  ) {}

  async getUserTodos(userId: string) {
    return await this.todoModel
      .find({
        userId,
      })
      .exec();
  }

  async createTodo(userId: string, createTodoDto: CreateTodoDto) {
    const todo = new this.todoModel({
      userId,
      text: createTodoDto.text,
      done: false,
    });

    return todo.save();
  }

  async deleteTodo(userId: string, id: string) {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo || todo.userId !== userId) {
      throw new NotFoundException();
    }

    await todo.updateOne({ deleted: new Date() }).exec();
  }

  async changeTodo(userId: string, id: string, { text, done }: ChangeTodoDto) {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo || todo.userId !== userId) {
      throw new NotFoundException();
    }

    await todo.updateOne({ text, done }).exec();
    return await this.todoModel.findById(id).exec();
  }

  filterTodo(todo: TodoDocument): FilteredTodo {
    return {
      id: todo._id.toString(),
      text: todo.text,
      done: todo.done,
    };
  }
}

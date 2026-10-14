import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TodoDto } from './todo.dto';
import { LlmService } from '../llm.service';

@Component({
  selector: 'app-todo',
  imports: [
    MatSelectionList,
    MatListOption,
    MatProgressBar,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatInputModule,
    MatFabButton,
  ],
  templateUrl: './todo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './todo.scss'
})
export class Todo {
  protected llmService = new LlmService();
  protected readonly reply = signal('');
  protected readonly todos = signal<TodoDto[]>([]);

  async runPrompt(userPrompt: string, inferenceEngine: string) {
    this.reply.set('…');

    const chunks = this.inferPromptApi(userPrompt);

    let reply = '';
    for await (const chunk of chunks) {
      reply += chunk;
      this.reply.set(reply);
    }
  }

  async* inferPromptApi(userPrompt: string): AsyncGenerator<string> {
    // LAB #3
    const systemPrompt = `
    The user will ask questions about their todo list.
    Here's the user's todo list: ${JSON.stringify(this.todos())}`;

    const languageModel = await LanguageModel.create({
      initialPrompts: [{ role: "system", content: systemPrompt }],
    });

    const chunks = languageModel.promptStreaming(userPrompt);
    for await (const chunk of chunks) {
      yield chunk;
    }
  }

  addTodo(text: string | null = null) {
    text ??= prompt() ?? '';
    this.todos.update(todos => [...todos, { done: false, text }]);
  }
}

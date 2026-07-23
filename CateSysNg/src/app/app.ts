import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './modules/login/login';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cateSysNg');
}

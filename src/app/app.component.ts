import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `<div class="flex flex-col h-screen overflow-hidden bg-slate-50"><app-navbar class="shrink-0"></app-navbar><main class="flex-1 overflow-y-auto"><router-outlet/></main></div>`,
  styles: []
})
export class AppComponent {}

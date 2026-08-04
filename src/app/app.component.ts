import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `<app-navbar/><main class="scroll-area"><router-outlet/></main>`,
  styles: [`.scroll-area { height: calc(100vh - 58px); overflow-y: auto; }`]
})
export class AppComponent {}

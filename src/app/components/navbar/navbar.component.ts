import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  links = [
    { path: '/dashboard',   label: 'Dashboard' },
    { path: '/upload',      label: 'Upload' },
    { path: '/analysis',    label: 'AI Analysis' },
    { path: '/performance', label: 'Model Performance' },
    { path: '/project',     label: 'Project Details' },
  ];
}

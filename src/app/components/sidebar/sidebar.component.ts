import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  navItems = [
    { path: '/dashboard', label: 'Dashboard', iconId: 'grid' },
    { path: '/upload', label: 'Upload Scan', iconId: 'upload' },
    { path: '/analysis', label: 'AI Analysis', iconId: 'analysis' },
    { path: '/performance', label: 'Model Performance', iconId: 'chart' },
    { path: '/project', label: 'Project Details', iconId: 'info' },
  ];
}

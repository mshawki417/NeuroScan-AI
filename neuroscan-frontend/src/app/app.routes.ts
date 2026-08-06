import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'upload',      loadComponent: () => import('./pages/upload/upload.component').then(m => m.UploadComponent) },
  { path: 'analysis',    loadComponent: () => import('./pages/analysis/analysis.component').then(m => m.AnalysisComponent) },
  { path: 'performance', loadComponent: () => import('./pages/performance/performance.component').then(m => m.PerformanceComponent) },
  { path: 'project',     loadComponent: () => import('./pages/project/project.component').then(m => m.ProjectComponent) },
  { path: '**', redirectTo: '' }
];

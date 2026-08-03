import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard', standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = [
    { icon: 'scan',  label: 'Total Scans',     value: '125',    change: '+12% this month', pos: true },
    { icon: 'ai',    label: 'AI Analyses',      value: '98',     change: '+15% this month', pos: true },
    { icon: 'acc',   label: 'Best Accuracy',    value: '95.69%', change: 'ConvNeXt-Tiny',   pos: null },
    { icon: 'model', label: 'Models Available', value: '3',      change: 'Deep Learning Models', pos: null },
  ];
  rows = [
    { id: 'MR-2024-125', scan: 'Brain MRI', pred: 'Meningioma', cls: 'b-yellow', conf: 95.6, date: 'May 20, 2024' },
    { id: 'MR-2024-124', scan: 'Brain MRI', pred: 'Glioma',     cls: 'b-red',    conf: 92.1, date: 'May 20, 2024' },
    { id: 'MR-2024-123', scan: 'Brain MRI', pred: 'No Tumor',   cls: 'b-green',  conf: 98.3, date: 'May 19, 2024' },
    { id: 'MR-2024-122', scan: 'Brain MRI', pred: 'Pituitary',  cls: 'b-blue',   conf: 97.5, date: 'May 18, 2024' },
    { id: 'MR-2024-121', scan: 'Brain MRI', pred: 'No Tumor',   cls: 'b-green',  conf: 99.1, date: 'May 17, 2024' },
  ];
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-analysis', standalone: true, imports: [RouterLink],
  templateUrl: './analysis.component.html', styleUrl: './analysis.component.scss'
})
export class AnalysisComponent {
  probs = [
    { label: 'Meningioma', val: 95.6, color: '#eab308', barCls: 'bar-y' },
    { label: 'Glioma',     val: 2.1,  color: '#ef4444', barCls: 'bar-r' },
    { label: 'Pituitary',  val: 1.7,  color: '#3b8ef0', barCls: 'bar-b' },
    { label: 'No Tumor',   val: 0.6,  color: '#22c55e', barCls: 'bar-g' },
  ];
}

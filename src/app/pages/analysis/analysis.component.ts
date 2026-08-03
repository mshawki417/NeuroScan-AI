import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PredictResult } from '../../services/api.service';

@Component({
  selector: 'app-analysis', standalone: true, imports: [RouterLink],
  templateUrl: './analysis.component.html', styleUrl: './analysis.component.scss'
})
export class AnalysisComponent implements OnInit {
  result = signal<PredictResult | null>(null);

  // Demo fallback probabilities when no result
  demoPreds = [
    { label: 'Meningioma', val: 95.6, color: '#eab308' },
    { label: 'Glioma',     val: 2.1,  color: '#ef4444' },
    { label: 'Pituitary',  val: 1.7,  color: '#3b8ef0' },
    { label: 'No Tumor',   val: 0.6,  color: '#22c55e' },
  ];

  ngOnInit() {
    const raw = sessionStorage.getItem('lastResult');
    if (raw) {
      try { this.result.set(JSON.parse(raw)); } catch {}
    }
  }

  get probEntries() {
    const r = this.result();
    if (!r) return this.demoPreds;
    return Object.entries(r.probabilities).map(([label, val]) => ({
      label, val,
      color: this.colorFor(label)
    })).sort((a, b) => b.val - a.val);
  }

  colorFor(label: string): string {
    const map: Record<string, string> = {
      'Glioma': '#ef4444', 'Meningioma': '#eab308',
      'No Tumor': '#22c55e', 'Pituitary': '#3b8ef0'
    };
    return map[label] || '#94a3b8';
  }

  badgeCls(color: string): string {
    const m: Record<string, string> = { yellow: 'b-yellow', green: 'b-green', red: 'b-red', blue: 'b-blue' };
    return m[color] || 'b-blue';
  }

  get predDisplay(): string {
    return this.result()?.prediction ?? 'Meningioma';
  }
  get confDisplay(): number {
    return this.result()?.confidence ?? 95.6;
  }
  get scanId(): string {
    return this.result()?.scan_id ?? 'MR-DEMO-001';
  }
  get modelUsed(): string {
    const k = this.result()?.model_used ?? 'convnext_tiny';
    return k === 'convnext_tiny' ? 'ConvNeXt-Tiny' : 'EfficientNet-B4';
  }
  get infTime(): string {
    return (this.result()?.metadata?.total_inference_ms ?? 84) + ' ms';
  }
  get analyzedAt(): string {
    const d = this.result()?.metadata?.analyzed_at;
    return d ? new Date(d).toLocaleString() : new Date().toLocaleString();
  }
  get warnings(): string[] {
    return this.result()?.warnings ?? [];
  }
  get arabic(): string {
    return this.result()?.arabic_label ?? 'ورم سحائي';
  }
  get badgeColor(): string {
    return this.badgeCls(this.result()?.badge_color ?? 'yellow');
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DualResult } from '../../services/api.service';

@Component({
  selector: 'app-analysis', standalone: true, imports: [RouterLink],
  templateUrl: './analysis.component.html', styleUrl: './analysis.component.scss'
})
export class AnalysisComponent implements OnInit {
  result    = signal<DualResult|null>(null);
  demoB64   = signal<string|null>(null);   // file base64 for demo overlay

  ngOnInit() {
    const raw = sessionStorage.getItem('dualResult');
    if (raw) {
      try {
        const r = JSON.parse(raw) as any;
        if (r._demo_file_b64) { this.demoB64.set(r._demo_file_b64); delete r._demo_file_b64; }
        this.result.set(r);
      } catch {}
    }
  }

  bboxSrc(): string {
    const r = this.result();
    if (r?.bbox?.image_b64) return 'data:image/jpeg;base64,' + r.bbox.image_b64;
    // demo fallback
    const d = this.demoB64();
    if (d) return 'data:image/jpeg;base64,' + d;
    return '';
  }

  heatSrc(): string {
    const r = this.result();
    if (r?.heatmap?.image_b64) return 'data:image/jpeg;base64,' + r.heatmap.image_b64;
    const d = this.demoB64();
    if (d) return 'data:image/jpeg;base64,' + d;
    return '';
  }

  probsOf(which: 'bbox'|'heatmap') {
    const r = this.result();
    const probs = r?.[which]?.prediction?.probabilities ?? {};
    return Object.entries(probs)
      .map(([label, val]) => ({ label, val: Number(val), color: this.colorFor(label) }))
      .sort((a,b) => b.val - a.val);
  }

  colorFor(label: string): string {
    return ({ 'Glioma':'#ef4444','Meningioma':'#eab308','No Tumor':'#22c55e','Pituitary':'#3b8ef0' } as any)[label] ?? '#94a3b8';
  }

  badgeCls(color: string): string {
    return ({ yellow:'b-yellow',green:'b-green',red:'b-red',blue:'b-blue' } as any)[color] ?? 'b-blue';
  }

  get bboxPred() { return this.result()?.bbox?.prediction; }
  get heatPred() { return this.result()?.heatmap?.prediction; }
  get scanId()   { return this.result()?.scan_id ?? '—'; }
  get totalMs()  { return this.result()?.total_ms ?? 0; }
  get isDemo()   { return this.result()?.demo_mode ?? false; }
  get warnings() { return this.result()?.warnings ?? []; }
  get analyzedAt(){ const d=this.result()?.analyzed_at; return d ? new Date(d).toLocaleString() : ''; }

  download(which: 'bbox'|'heatmap') {
    const src = which === 'bbox' ? this.bboxSrc() : this.heatSrc();
    if (!src) return;
    const a  = document.createElement('a');
    a.href   = src;
    a.download = `neuroscan_${which}_${this.scanId}.jpg`;
    a.click();
  }
}

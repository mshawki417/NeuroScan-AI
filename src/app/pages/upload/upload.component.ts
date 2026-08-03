import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, PredictResult } from '../../services/api.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [ApiService],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  private api    = inject(ApiService);
  private router = inject(Router);

  drag      = signal(false);
  file      = signal<File | null>(null);
  loading   = signal(false);
  progress  = signal(0);
  error     = signal('');
  result    = signal<PredictResult | null>(null);
  model     = signal('convnext_tiny');
  demoMode  = signal(false);

  guidelines = [
    'Use high quality MRI scan',
    'Use axial, sagittal or coronal view',
    'Clear and unblurred images',
    'Supported: T1, T2, FLAIR'
  ];

  models = [
    { key: 'convnext_tiny',   name: 'ConvNeXt-Tiny',   acc: '95.69%' },
    { key: 'efficientnet_b4', name: 'EfficientNet-B4',  acc: '94.75%' },
  ];

  onDragOver(e: DragEvent)  { e.preventDefault(); this.drag.set(true); }
  onDragLeave()              { this.drag.set(false); }
  onDrop(e: DragEvent)       { e.preventDefault(); this.drag.set(false); const f = e.dataTransfer?.files[0]; if (f) this.setFile(f); }
  onSelect(e: Event)         { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.setFile(f); }

  setFile(f: File) {
    this.file.set(f);
    this.result.set(null);
    this.error.set('');
  }

  fmtSize(b: number) { return (b / 1024 / 1024).toFixed(2) + ' MB'; }

  async analyze() {
    const f = this.file();
    if (!f) return;

    this.loading.set(true);
    this.error.set('');
    this.progress.set(0);

    // Simulate progress while waiting
    const progressInterval = setInterval(() => {
      this.progress.update(p => p < 85 ? p + 5 : p);
    }, 150);

    this.api.predict(f, this.model()).subscribe({
      next: (res) => {
        clearInterval(progressInterval);
        this.progress.set(100);
        setTimeout(() => {
          this.loading.set(false);
          this.result.set(res);
          // Store result and navigate to analysis
          sessionStorage.setItem('lastResult', JSON.stringify(res));
          this.router.navigate(['/analysis']);
        }, 400);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.loading.set(false);
        this.progress.set(0);
        if (err.status === 0) {
          // Server unreachable — run demo
          this.demoMode.set(true);
          this.runDemo();
        } else {
          this.error.set(err.error?.detail || 'Analysis failed. Please try again.');
        }
      }
    });
  }

  runDemo() {
    // Demo mode: simulate a real prediction when backend is offline
    this.loading.set(true);
    const progressInterval = setInterval(() => {
      this.progress.update(p => p < 90 ? p + 8 : p);
    }, 120);

    setTimeout(() => {
      clearInterval(progressInterval);
      this.progress.set(100);
      const demoResult: PredictResult = {
        scan_id: 'MR-DEMO-001',
        filename: this.file()?.name || 'demo.jpg',
        prediction: 'Meningioma',
        prediction_key: 'meningioma',
        confidence: 95.6,
        risk_level: 'medium',
        badge_color: 'yellow',
        arabic_label: 'ورم سحائي',
        probabilities: { 'Glioma': 2.1, 'Meningioma': 95.6, 'No Tumor': 0.6, 'Pituitary': 1.7 },
        warnings: ['Running in DEMO mode — backend not connected'],
        model_used: this.model(),
        metadata: {
          original_size: '512×512', preprocessed_size: '224×224',
          clahe: true, total_inference_ms: 84,
          analyzed_at: new Date().toISOString()
        },
        clinical_note: 'Demo result only. Connect backend for real predictions.'
      };
      this.loading.set(false);
      sessionStorage.setItem('lastResult', JSON.stringify(demoResult));
      this.router.navigate(['/analysis']);
    }, 1800);
  }

  reset() { this.file.set(null); this.result.set(null); this.error.set(''); this.progress.set(0); this.demoMode.set(false); }
}

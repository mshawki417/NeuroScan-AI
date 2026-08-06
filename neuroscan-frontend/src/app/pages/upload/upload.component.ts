import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-upload', standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, NavbarComponent],
  providers: [ApiService],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  private api    = inject(ApiService);
  private router = inject(Router);

  drag      = signal(false);
  file      = signal<File|null>(null);
  loading   = signal(false);
  progress  = signal(0);
  error     = signal('');
  demoMode  = signal(false);
  statusMsg = signal('Uploading scan…');

  guidelines = [
    'Use high quality MRI scan',
    'Use axial, sagittal or coronal view',
    'Clear and unblurred images',
    'Supported: T1, T2, FLAIR',
  ];

  get isDragging() { return this.drag(); }
  get fileSizeDisplay() { return this.file() ? this.fmtSize(this.file()!.size) : ''; }

  onDragOver(e: DragEvent)  { e.preventDefault(); this.drag.set(true); }
  onDragLeave(e?: DragEvent){ if(e) e.preventDefault(); this.drag.set(false); }
  onDrop(e: DragEvent)      { e.preventDefault(); this.drag.set(false); const f=e.dataTransfer?.files[0]; if(f) this.setFile(f); }
  onFileSelected(e: Event)  { const f=(e.target as HTMLInputElement).files?.[0]; if(f) this.setFile(f); }
  onSelect(e: Event)        { this.onFileSelected(e); }
  setFile(f: File)          { this.file.set(f); this.error.set(''); this.progress.set(0); }
  removeFile()              { this.file.set(null); }
  fmtSize(b: number)        { return (b/1024/1024).toFixed(2)+' MB'; }

  analyze() {
    const f = this.file();
    if (!f) return;

    this.loading.set(true);
    this.error.set('');
    this.progress.set(0);
    this.statusMsg.set('Uploading scan…');

    // Progress simulation
    const tick = setInterval(() => {
      this.progress.update(p => {
        if (p < 30)  { this.statusMsg.set('Uploading scan…');                return p + 6; }
        if (p < 55)  { this.statusMsg.set('Preprocessing image (CLAHE)…');  return p + 4; }
        if (p < 72)  { this.statusMsg.set('Running EfficientNet-B4…');       return p + 3; }
        if (p < 85)  { this.statusMsg.set('Running ConvNeXt-Tiny…');         return p + 2; }
        if (p < 92)  { this.statusMsg.set('Generating GradCAM maps…');       return p + 1; }
        return p;
      });
    }, 140);

    this.api.predictDual(f).subscribe({
      next: (res) => {
        clearInterval(tick);
        this.progress.set(100);
        this.statusMsg.set('Done!');
        sessionStorage.setItem('dualResult', JSON.stringify(res));
        setTimeout(() => { this.loading.set(false); this.router.navigate(['/analysis']); }, 350);
      },
      error: (err) => {
        clearInterval(tick);
        this.loading.set(false);
        this.progress.set(0);
        if (err.status === 0) {
          this.demoMode.set(true);
          this.runDemo(f);
        } else {
          this.error.set(err.error?.detail || 'Analysis failed. Check backend connection.');
        }
      }
    });
  }

  runDemo(f: File) {
    this.loading.set(true);
    this.progress.set(0);
    const msgs = [
      'Uploading scan…','Preprocessing (CLAHE)…',
      'Running EfficientNet-B4…','Generating BBox…',
      'Running ConvNeXt-Tiny…','Generating Heatmap…','Done!'
    ];
    let mi = 0;
    this.statusMsg.set(msgs[0]);
    const tick = setInterval(() => {
      this.progress.update(p => Math.min(p + 7, 96));
      mi = Math.min(mi + 1, msgs.length - 1);
      this.statusMsg.set(msgs[mi]);
    }, 280);

    // Read file as base64 for demo images
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        clearInterval(tick);
        this.progress.set(100);
        // Store a demo result with the actual image as placeholder
        const demoRes = {
          scan_id: 'MR-DEMO-' + Date.now(),
          filename: f.name,
          demo_mode: true,
          total_ms: 1240,
          analyzed_at: new Date().toISOString(),
          warnings: ['DEMO MODE — backend not connected'],
          clinical_note: 'Demo result only.',
          bbox: {
            model: 'EfficientNet-B4',
            image_b64: null,          // will be rendered as demo in analysis page
            prediction: { label:'Meningioma', arabic:'ورم سحائي', confidence:94.8, badge_color:'yellow', risk_level:'medium',
              probabilities:{'Glioma':3.2,'Meningioma':94.8,'No Tumor':0.7,'Pituitary':1.3} }
          },
          heatmap: {
            model: 'ConvNeXt-Tiny',
            image_b64: null,
            prediction: { label:'Meningioma', arabic:'ورم سحائي', confidence:95.6, badge_color:'yellow', risk_level:'medium',
              probabilities:{'Glioma':2.1,'Meningioma':95.6,'No Tumor':0.6,'Pituitary':1.7} }
          },
          _demo_file_b64: (reader.result as string).split(',')[1] ?? null,
        };
        sessionStorage.setItem('dualResult', JSON.stringify(demoRes));
        this.loading.set(false);
        this.router.navigate(['/analysis']);
      }, 2200);
    };
    reader.readAsDataURL(f);
  }

  reset() { this.file.set(null); this.error.set(''); this.progress.set(0); this.demoMode.set(false); }
}

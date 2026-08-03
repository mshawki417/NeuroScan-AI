import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-upload', standalone: true, imports: [RouterLink],
  templateUrl: './upload.component.html', styleUrl: './upload.component.scss'
})
export class UploadComponent {
  drag   = signal(false);
  file   = signal<File|null>(null);
  loading= signal(false);
  done   = signal(false);

  guidelines = ['Use high quality MRI scan','Use axial, sagittal or coronal view','Clear and unblurred images','Supported: T1, T2, FLAIR'];

  onDragOver(e: DragEvent){ e.preventDefault(); this.drag.set(true); }
  onDragLeave(){ this.drag.set(false); }
  onDrop(e: DragEvent){ e.preventDefault(); this.drag.set(false); const f=e.dataTransfer?.files[0]; if(f) this.setFile(f); }
  onSelect(e: Event){ const f=(e.target as HTMLInputElement).files?.[0]; if(f) this.setFile(f); }
  setFile(f: File){ this.file.set(f); this.done.set(false); }
  fmtSize(b: number){ return (b/1024/1024).toFixed(2)+' MB'; }
  analyze(){ this.loading.set(true); setTimeout(()=>{ this.loading.set(false); this.done.set(true); },2200); }
  reset(){ this.file.set(null); this.done.set(false); }
}

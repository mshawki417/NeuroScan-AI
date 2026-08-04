import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-mri',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-mri.component.html',
  styleUrls: ['./upload-mri.component.scss'],
})
export class UploadMriComponent {
  isDragging = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  dimensions = '';
  scanType = '';

  get fileSizeDisplay(): string {
    if (!this.selectedFile) return '—';
    const bytes = this.selectedFile.size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    this.selectedFile = file;
    this.previewUrl = null;
    this.dimensions = '';

    // Detect scan type from extension
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'dcm') this.scanType = 'DICOM';
    else if (ext === 'nii') this.scanType = 'NIfTI';
    else if (['jpg', 'jpeg', 'png'].includes(ext)) this.scanType = 'Image';
    else this.scanType = 'Unknown';

    // Preview for images
    if (['jpg', 'jpeg', 'png'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          this.dimensions = `${img.width} × ${img.height} px`;
        };
        img.src = this.previewUrl;
      };
      reader.readAsDataURL(file);
    }
  }
}

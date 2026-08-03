import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, from } from 'rxjs';

export interface PredictResult {
  scan_id: string;
  filename: string;
  prediction: string;
  prediction_key: string;
  confidence: number;
  risk_level: 'none' | 'low' | 'medium' | 'high';
  badge_color: 'green' | 'yellow' | 'blue' | 'red';
  arabic_label: string;
  probabilities: Record<string, number>;
  warnings: string[];
  model_used: string;
  metadata: {
    original_size: string;
    preprocessed_size: string;
    clahe: boolean;
    total_inference_ms: number;
    analyzed_at: string;
  };
  clinical_note: string;
}

export interface ModelInfo {
  key: string;
  name: string;
  loaded: boolean;
  exists: boolean;
  is_default: boolean;
  accuracy: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Change this to your backend URL after deploying
  private readonly BASE = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  predict(file: File, model = 'convnext_tiny'): Observable<PredictResult> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<PredictResult>(
      `${this.BASE}/predict?model=${model}`, fd
    );
  }

  getModels(): Observable<{ models: ModelInfo[] }> {
    return this.http.get<{ models: ModelInfo[] }>(`${this.BASE}/models`);
  }

  getHealth(): Observable<any> {
    return this.http.get(`${this.BASE}/health`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.BASE}/stats`);
  }
}

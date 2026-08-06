import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PredictResult {
  scan_id: string;
  filename: string;
  prediction: string;
  prediction_key: string;
  confidence: number;
  risk_level: 'none'|'low'|'medium'|'high';
  badge_color: 'green'|'yellow'|'blue'|'red';
  arabic_label: string;
  probabilities: Record<string,number>;
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

export interface DualResult {
  scan_id:       string;
  filename:      string;
  demo_mode:     boolean;
  total_ms:      number;
  analyzed_at:   string;
  warnings:      string[];
  clinical_note: string;
  bbox: {
    model:      string;
    image_b64:  string;
    prediction: {
      label:         string;
      arabic:        string;
      confidence:    number;
      badge_color:   string;
      risk_level:    string;
      probabilities: Record<string,number>;
    };
  };
  heatmap: {
    model:      string;
    image_b64:  string;
    prediction: {
      label:         string;
      arabic:        string;
      confidence:    number;
      badge_color:   string;
      risk_level:    string;
      probabilities: Record<string,number>;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  /**
   * Dynamic base URL resolution:
   * - Development (localhost) → http://localhost:8000/api/v1
   * - Production → deployed Render backend
   *
   * To override, set window.__NEUROSCAN_API_URL before app loads.
   */
  get BASE(): string {
    // Allow runtime override via global variable (set in index.html or env scripts)
    const override = (window as any).__NEUROSCAN_API_URL;
    if (override) return override.replace(/\/$/, '') + '/api/v1';

    return environment.apiUrl;
  }

  constructor(private http: HttpClient) {}

  /** Single model — returns prediction JSON */
  predict(file: File, model = 'convnext_tiny'): Observable<PredictResult> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<PredictResult>(`${this.BASE}/predict?model=${model}`, fd);
  }

  /** Dual model — returns BBox + Heatmap images as base64 */
  predictDual(file: File): Observable<DualResult> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<DualResult>(`${this.BASE}/predict/dual`, fd);
  }

  getModels()  { return this.http.get<any>(`${this.BASE}/models`); }
  getHealth()  { return this.http.get<any>(`${this.BASE}/health`); }
  getStats()   { return this.http.get<any>(`${this.BASE}/stats`); }
  getClasses() { return this.http.get<any>(`${this.BASE}/classes`); }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface Testimonial { name: string; role: string; company: string; avatar: string; avatarColor: string; quote: string; rating: number; }

@Component({
  selector: 'app-testimonials', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './testimonials.component.html', styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [];
  stars(n: number): number[] { return Array(n).fill(0); }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface FaqItem { q: string; a: string; }

@Component({
  selector: 'app-faq', standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, TranslatePipe],
  templateUrl: './faq.component.html', styleUrl: './faq.component.scss'
})
export class FaqComponent {
  faqs: FaqItem[] = [];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface PlanFeature { text: string; included: boolean; }
interface Plan { name: string; monthlyPrice: number; annualPrice: number; description: string; badge?: string; highlighted: boolean; cta: string; features: PlanFeature[]; }

@Component({
  selector: 'app-pricing', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatSlideToggleModule, TranslatePipe],
  templateUrl: './pricing.component.html', styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  isAnnual = false;
  plans: Plan[] = [];
  currentPrice(plan: Plan): number { return this.isAnnual ? plan.annualPrice : plan.monthlyPrice; }
}

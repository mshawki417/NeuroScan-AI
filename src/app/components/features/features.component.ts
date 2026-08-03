import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService, Translations } from '../../services/translation.service';

interface Feature { icon: string; titleKey: keyof Translations; descKey: keyof Translations; color: string; }

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  ts = inject(TranslationService);

  features: Feature[] = [
    { icon: 'dashboard',              titleKey: 'feat_0_title', descKey: 'feat_0_desc', color: 'teal' },
    { icon: 'schedule',               titleKey: 'feat_1_title', descKey: 'feat_1_desc', color: 'gold' },
    { icon: 'visibility',             titleKey: 'feat_2_title', descKey: 'feat_2_desc', color: 'navy' },
    { icon: 'account_balance_wallet', titleKey: 'feat_3_title', descKey: 'feat_3_desc', color: 'teal' },
    { icon: 'groups',                 titleKey: 'feat_4_title', descKey: 'feat_4_desc', color: 'gold' },
    { icon: 'folder_open',            titleKey: 'feat_5_title', descKey: 'feat_5_desc', color: 'navy' },
  ];
}

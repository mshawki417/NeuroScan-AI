import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService, Translations } from '../../services/translation.service';

interface FooterLink  { labelKey: keyof Translations; href: string; }
interface FooterCol   { titleKey: keyof Translations; links: FooterLink[]; }
interface SocialLink  { icon: string; label: string; href: string; }

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  ts = inject(TranslationService);
  year = new Date().getFullYear();

  columns: FooterCol[] = [
    {
      titleKey: 'footer_col_product',
      links: [
        { labelKey: 'footer_link_dashboard',  href: '#' },
        { labelKey: 'footer_link_scheduling', href: '#' },
        { labelKey: 'footer_link_budget',     href: '#' },
        { labelKey: 'footer_link_field',      href: '#' },
        { labelKey: 'footer_link_mobile',     href: '#' },
      ]
    },
    {
      titleKey: 'footer_col_company',
      links: [
        { labelKey: 'footer_link_about',    href: '#' },
        { labelKey: 'footer_link_careers',  href: '#' },
        { labelKey: 'footer_link_blog',     href: '#' },
        { labelKey: 'footer_link_press',    href: '#' },
        { labelKey: 'footer_link_partners', href: '#' },
      ]
    },
    {
      titleKey: 'footer_col_support',
      links: [
        { labelKey: 'footer_link_help',    href: '#' },
        { labelKey: 'footer_link_contact', href: '#' },
        { labelKey: 'footer_link_status',  href: '#' },
        { labelKey: 'footer_link_privacy', href: '#' },
        { labelKey: 'footer_link_terms',   href: '#' },
      ]
    }
  ];

  socials: SocialLink[] = [
    { icon: 'facebook',        label: 'Facebook',   href: '#' },
    { icon: 'linkedin',        label: 'LinkedIn',   href: '#' },
    { icon: 'alternate_email', label: 'Twitter / X',href: '#' },
    { icon: 'smart_display',   label: 'YouTube',    href: '#' },
  ];

  scrollTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

import { Component, HostListener, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface LangOption { label: string; code: string; flag: string; }
interface LangRegion  { region: string; langs: LangOption[]; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  ts = inject(TranslationService);

  isScrolled        = false;
  isMobileOpen      = false;
  isLangOpen        = false;
  isSearchOpen      = false;
  searchQuery       = '';
  activeDropdown: string | null = null;

  langRegions: LangRegion[] = [
    {
      region: 'Americas',
      langs: [
        { label: 'América Latina (Español)', code: 'es-419', flag: '🇲🇽' },
        { label: 'Canada (English)',          code: 'en-CA',  flag: '🇨🇦' },
        { label: 'United States (English)',   code: 'en-US',  flag: '🇺🇸' },
      ]
    },
    {
      region: 'Europe & Middle East',
      langs: [
        { label: 'Deutschland (Deutsch)',     code: 'de-DE', flag: '🇩🇪' },
        { label: 'España (Español)',           code: 'es-ES', flag: '🇪🇸' },
        { label: 'France (Français)',          code: 'fr-FR', flag: '🇫🇷' },
        { label: 'United Kingdom (English)',   code: 'en-GB', flag: '🇬🇧' },
        { label: 'الإمارات (العربية)',         code: 'ar-AE', flag: '🇦🇪' },
        { label: 'مصر (العربية)',              code: 'ar-EG', flag: '🇪🇬' },
        { label: 'المملكة العربية السعودية',   code: 'ar-SA', flag: '🇸🇦' },
      ]
    },
    {
      region: 'Asia Pacific',
      langs: [
        { label: 'Australia & New Zealand',   code: 'en-AU', flag: '🇦🇺' },
        { label: 'Singapore (English)',        code: 'en-SG', flag: '🇸🇬' },
      ]
    }
  ];

  selectedLang: LangOption = { label: 'EN', code: 'en-US', flag: '🇺🇸' };

  constructor(private elRef: ElementRef) {}
  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 0; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event): void {
    if (!this.elRef.nativeElement.contains(e.target)) {
      this.isLangOpen = false; this.isSearchOpen = false; this.activeDropdown = null;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isLangOpen = false; this.isSearchOpen = false;
    this.activeDropdown = null; this.isMobileOpen = false;
  }

  toggleSearch(e: Event): void {
    e.stopPropagation();
    this.isSearchOpen = !this.isSearchOpen; this.isLangOpen = false; this.activeDropdown = null;
  }

  toggleLang(e: Event): void {
    e.stopPropagation();
    this.isLangOpen = !this.isLangOpen; this.isSearchOpen = false; this.activeDropdown = null;
  }

  selectLang(lang: LangOption): void {
    this.selectedLang = lang;
    this.isLangOpen   = false;
    this.ts.setLang(lang.code);
  }

  getLangCode(code: string): string {
    return code.split('-')[0].toUpperCase();
  }

  hoverItem(key: string): void { this.activeDropdown = key; }
  leaveNav(): void { this.activeDropdown = null; }
  toggleMobile(): void { this.isMobileOpen = !this.isMobileOpen; }

  scrollTo(fragment: string): void {
    const el = document.getElementById(fragment);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    this.isMobileOpen = false; this.isLangOpen = false; this.activeDropdown = null;
  }
}

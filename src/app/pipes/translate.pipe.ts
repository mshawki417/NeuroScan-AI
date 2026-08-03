import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService, Translations } from '../services/translation.service';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private ts = inject(TranslationService);

  transform(key: keyof Translations): string {
    return this.ts.t()[key] ?? key;
  }
}

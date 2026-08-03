import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface Company { name: string; abbr: string; }

@Component({
  selector: 'app-trusted-by',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './trusted-by.component.html',
  styleUrl: './trusted-by.component.scss'
})
export class TrustedByComponent {
  companies: Company[] = [
    { name: 'Summit Builders',   abbr: 'SB'  },
    { name: 'Apex Construction', abbr: 'AC'  },
    { name: 'Matrix Group',      abbr: 'MG'  },
    { name: 'Baker Lewis',       abbr: 'BL'  },
    { name: 'GT Construction',   abbr: 'GTC' },
    { name: 'Dawnwood',          abbr: 'DW'  },
  ];
}

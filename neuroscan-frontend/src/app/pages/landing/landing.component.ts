import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {}

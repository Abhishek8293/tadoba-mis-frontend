import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAngleDown,
  faBars,
  faBoxOpen,
  faClipboardList,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent {
  hamBurgerMenu = faBars;
  closeMenu = faTimes;
  productIcon = faBoxOpen;
  taskIcon = faClipboardList;
  plusIcon = faPlus;
  angleDown = faAngleDown;

  isMenuOpen = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

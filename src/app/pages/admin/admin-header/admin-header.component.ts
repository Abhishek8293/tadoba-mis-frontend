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
import { MatIcon } from '@angular/material/icon';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, MatIcon],
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

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.localStorageService.clearUser();
    this.router.navigate(['/login']);
  }
}

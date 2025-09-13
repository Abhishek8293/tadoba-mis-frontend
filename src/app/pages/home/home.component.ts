import { Component } from '@angular/core';
import { MatListModule } from "@angular/material/list";
import { MatSidenavContainer } from "@angular/material/sidenav";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatListModule, MatSidenavContainer],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
sideNavWidht() {
throw new Error('Method not implemented.');
}
collapse() {
throw new Error('Method not implemented.');
}
menuItems() {
throw new Error('Method not implemented.');
}

}

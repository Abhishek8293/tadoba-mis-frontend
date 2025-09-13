import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpHeaderComponent } from "../emp-header/emp-header.component";

@Component({
  selector: 'app-emp',
  standalone: true,
  imports: [CommonModule, RouterModule, EmpHeaderComponent],
  templateUrl: './emp.component.html',
  styleUrl: './emp.component.css'
})
export class EmpComponent {

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-date-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-popup.component.html',
  styleUrl: './date-popup.component.scss',
})
export class DatePopupComponent {
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}

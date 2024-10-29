import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-popup.component.html',
  styleUrl: './date-popup.component.scss',
})
export class DatePopupComponent {
  isOpen = false;
  selectedDate!: string;

  @Output() dateSelected = new EventEmitter<string>();

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
  }

  confirmDate() {
    this.dateSelected.emit(this.selectedDate);
    this.close();
  }
}

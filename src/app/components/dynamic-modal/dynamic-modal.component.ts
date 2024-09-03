import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.showModal = false;
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.modal-content')) {
      return;
    }
    this.close();
  }
}

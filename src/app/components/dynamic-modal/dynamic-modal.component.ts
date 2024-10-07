import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent implements OnChanges, OnDestroy {
  @Input() title: string = '';
  @Input() showModal: boolean = false;
  @Input() mWClass: string = 'max-w-xl';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showModal']) {
      if (this.showModal) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }

  ngOnDestroy() {
    document.body.classList.remove('overflow-hidden');
  }
}

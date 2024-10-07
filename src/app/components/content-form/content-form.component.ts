import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RupiahPipe } from '../../pipes/rupiah.pipe';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [CommonModule, RupiahPipe],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss',
})
export class ContentFormComponent {
  @Input() title: string = '';
  @Input() value!: number;
  @Input() hasValue: boolean = false;
  @Input() id: string = '';
  @Input() hasId: boolean = false;
  @Input() isRequestInvalid: boolean = true;
  @Output() submitForm = new EventEmitter<void>();

  constructor(private router: Router) {}

  backNavigate() {
    this.router.navigate(['/document-cash-out']);
  }

  onSubmitClick() {
    this.submitForm.emit();
  }
}

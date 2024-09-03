import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss',
})
export class ContentFormComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() hasValue: boolean = false;
  @Input() id: string = '';
  @Input() hasId: boolean = false;

  constructor(private router: Router) {}

  backNavigate() {
    this.router.navigate(['/document-cash-out']);
  }
}

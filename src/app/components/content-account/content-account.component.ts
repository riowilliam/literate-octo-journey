import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-content-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-account.component.html',
  styleUrl: './content-account.component.scss',
})
export class ContentAccountComponent {
  @Input() bgColor: string = '';
  @Input() hasTrademark: boolean = false;
  contentAccount!: boolean;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.contentAccount = !(
          url === '/login' ||
          url === '/forgot-password' ||
          url === '/change-password' ||
          url === '/change-full-name'
        );
      });
  }
}

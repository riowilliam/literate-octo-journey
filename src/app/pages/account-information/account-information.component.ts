import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentAccountComponent } from '../../components/content-account/content-account.component';
import { DynamicAccountComponent } from '../../components/dynamic-account/dynamic-account.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-information',
  standalone: true,
  imports: [CommonModule, ContentAccountComponent, DynamicAccountComponent],
  templateUrl: './account-information.component.html',
  styleUrl: './account-information.component.scss',
})
export class AccountInformationComponent {
  constructor(private router: Router) {}

  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}

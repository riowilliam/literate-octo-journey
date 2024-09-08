import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentAccountComponent } from '../../components/content-account/content-account.component';
import { DynamicAccountComponent } from '../../components/dynamic-account/dynamic-account.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { ProfileResponse } from './dto/profile.dto';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-account-information',
  standalone: true,
  imports: [CommonModule, ContentAccountComponent, DynamicAccountComponent],
  templateUrl: './account-information.component.html',
  styleUrl: './account-information.component.scss',
})
export class AccountInformationComponent {
  fullName!: string;
  email!: string;
  contact!: string;
  roleCode!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.loaderService.show();
      this.fullName = this.authService.getFullName();
      this.loadProfile(username);
    }
  }

  loadProfile(username: string): void {
    this.httpService
      .get<ProfileResponse>(
        environment.API_URL,
        'api/user/getProfile',
        new HttpParams({ fromObject: { username: username } }),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          if (response?.status === 200 && response?.data) {
            const { email, contact, roleCode } = response?.data;
            this.email = email;
            this.profileService.setEmail(email);
            this.contact = contact;
            this.profileService.setContact(contact);
            this.roleCode = roleCode;
            this.profileService.setRoleCode(roleCode);
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show(
            'Loan profile failed. Please check your credentials!',
            'error'
          );
          console.error('Login error:', error);
        },
      });
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}

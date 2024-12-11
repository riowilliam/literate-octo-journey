import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContentAccountComponent } from '../../components/content-account/content-account.component';
import { DynamicAccountComponent } from '../../components/dynamic-account/dynamic-account.component';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { LoaderService } from '../../services/loader.service';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from './dto/change-password.dto';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  showNewPassword: boolean = false;
  showOldPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      oldPassword: ['', Validators.required],
    });
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const { newPassword, oldPassword } = this.changePasswordForm.value;
      this.loaderService.show();
      this.httpService
        .post<ChangePasswordResponse>(
          environment.API_URL,
          'api/user/changePassword',
          new ChangePasswordRequest(
            this.authService.getUsername(),
            newPassword,
            oldPassword
          ),
          new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
          })
        )
        .subscribe({
          next: (response) => {
            this.loaderService.hide();
            if (
              response?.status === 200 &&
              response?.info?.toLowerCase() ===
                'password has changed. please re login using your new password.'
            ) {
              this.notificationService.show(response?.info, 'success');
              this.authService.flush();
              this.router.navigate(['/login']);
            } else {
              this.notificationService.show(response?.info, 'info');
            }
          },
          error: (error) => {
            this.loaderService.hide();
            this.notificationService.show('Error changing password.', 'error');
            console.error('Change password error:', error);
          },
        });
    } else {
      this.notificationService.show(
        'Form is invalid. Please check your input.',
        'error'
      );
    }
  }
}

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
import { ForgotPasswordResponse } from './dto/forgot-password.dto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;

      this.loaderService.show();

      this.httpService
        .post<ForgotPasswordResponse>(
          environment.API_URL,
          `api/sendResetPassword?email=${email}`,
          null
        )
        .subscribe({
          next: (response) => {
            this.loaderService.hide();
            if (
              response?.status === 200 &&
              response?.info?.toLowerCase() ===
                'email sent, please check your email.'
            ) {
              this.notificationService.show(response?.info, 'success');
              this.router.navigate(['/login']);
            } else {
              this.notificationService.show(response?.info, 'info');
            }
          },
          error: (error) => {
            this.loaderService.hide();
            this.notificationService.show(
              'Failed to send reset instructions.',
              'error'
            );
            console.error('Forgot password error:', error);
          },
        });
    } else {
      this.notificationService.show(
        'Please enter a valid email address.',
        'error'
      );
    }
  }
}

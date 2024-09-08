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
import {
  ChangeUsernameRequest,
  ChangeUsernameResponse,
} from './dto/change-username.dto';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './change-username.component.html',
  styleUrl: './change-username.component.scss',
})
export class ChangeUsernameComponent {
  changeUsernameForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.changeUsernameForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  onSubmit() {
    if (this.changeUsernameForm.valid) {
      const { username, password } = this.changeUsernameForm.value;
      this.loaderService.show();
      this.httpService
        .post<ChangeUsernameResponse>(
          environment.API_URL,
          'api/user/changeUsername',
          new ChangeUsernameRequest(
            this.authService.getUsername(),
            username,
            this.authService.getFullName(),
            password
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
              response?.info.toLowerCase() ===
                'username has changed. please re login using your new username.'
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
            this.notificationService.show('Error changing username.', 'error');
            console.error('Change username error:', error);
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

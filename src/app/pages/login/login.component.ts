import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentAccountComponent } from '../../components/content-account/content-account.component';
import { DynamicAccountComponent } from '../../components/dynamic-account/dynamic-account.component';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const loginRequest = new LoginRequest(username, password);
      this.loaderService.show();
      this.httpService
        .post<LoginResponse>(environment.API_URL, 'api/login', loginRequest)
        .subscribe({
          next: (response) => {
            this.loaderService.hide();
            if (response?.status === 200 && response?.data?.isValid) {
              const { jwtToken, fullName, userRole, username } = response?.data;
              this.authService.setToken(jwtToken);
              this.authService.setFullName(fullName);
              this.authService.setUserRole(userRole);
              this.authService.setUsername(username);
              this.notificationService.show('Login was successful!', 'success');
              this.router.navigate(['/dashboard']);
            } else {
              this.notificationService.show(response?.info, 'info');
            }
          },
          error: (error) => {
            this.loaderService.hide();
            this.notificationService.show(
              'Login failed. Please check your credentials!',
              'error'
            );
            console.error('Login error:', error);
          },
        });
    } else {
      this.notificationService.show(
        'Please fill in both username and password.',
        'error'
      );
    }
  }
}

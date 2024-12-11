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
  ChangeFullNameRequest,
  ChangeFullNameResponse,
} from './dto/change-full-name.dto';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-full-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './change-full-name.component.html',
  styleUrl: './change-full-name.component.scss',
})
export class ChangeFullNameComponent {
  changeFullNameForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.changeFullNameForm = this.fb.group({
      newFullName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  onSubmit() {
    if (this.changeFullNameForm.valid) {
      const { newFullName, password } = this.changeFullNameForm.value;
      this.loaderService.show();
      this.httpService
        .post<ChangeFullNameResponse>(
          environment.API_URL,
          'api/user/changeFullName',
          new ChangeFullNameRequest(
            this.authService.getUsername(),
            newFullName,
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
              response?.info?.toLowerCase() === 'full name has changed.'
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
            this.notificationService.show('Error changing full name.', 'error');
            console.error('Change full name error:', error);
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

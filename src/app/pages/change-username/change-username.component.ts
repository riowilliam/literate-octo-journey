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
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.changeUsernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.required]],
    });
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  onSubmit() {
    if (this.changeUsernameForm.valid) {
      const { username } = this.changeUsernameForm.value;
      if (username === 'user') {
        this.loaderService.show();
        setTimeout(() => {
          this.loaderService.hide();
          this.notificationService.show(
            'Change Username was successful!',
            'success'
          );
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.loaderService.show();
        setTimeout(() => {
          this.loaderService.hide();
          this.notificationService.show('Something went wrong!', 'error');
        }, 1500);
      }
    }
  }
}

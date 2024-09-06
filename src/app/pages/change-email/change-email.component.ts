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

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.scss',
})
export class ChangeEmailComponent {
  changeEmailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.changeEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  onSubmit() {
    if (this.changeEmailForm.valid) {
      // const { email } = this.changeEmailForm.value;
      // if (email === 'user@gmail.com') {
      //   this.loaderService.show();
      //   setTimeout(() => {
      //     this.loaderService.hide();
      //     this.notificationService.show(
      //       'Change Email was successful!',
      //       'success'
      //     );
      //     this.authService.removeToken();
      //     this.router.navigate(['/login']);
      //   }, 1500);
    } else {
      // this.loaderService.show();
      // setTimeout(() => {
      //   this.loaderService.hide();
      //   this.notificationService.show('Something went wrong!', 'error');
      // }, 1500);
      // }
    }
  }
}

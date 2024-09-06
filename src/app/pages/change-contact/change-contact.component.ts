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
  selector: 'app-change-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentAccountComponent,
    DynamicAccountComponent,
  ],
  templateUrl: './change-contact.component.html',
  styleUrl: './change-contact.component.scss',
})
export class ChangeContactComponent {
  changeContactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.changeContactForm = this.fb.group({
      contact: ['', [Validators.required, Validators.required]],
    });
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  onSubmit() {
    if (this.changeContactForm.valid) {
      // const { contact } = this.changeContactForm.value;
      // if (contact === '082244862020') {
      //   this.loaderService.show();
      //   setTimeout(() => {
      //     this.loaderService.hide();
      //     this.notificationService.show(
      //       'Change Contact was successful!',
      //       'success'
      //     );
      //     this.authService.removeToken();
      //     this.router.navigate(['/login']);
      //   }, 1500);
    } else {
      //   this.loaderService.show();
      //   setTimeout(() => {
      //     this.loaderService.hide();
      //     this.notificationService.show('Something went wrong!', 'error');
      //   }, 1500);
      // }
    }
  }
}

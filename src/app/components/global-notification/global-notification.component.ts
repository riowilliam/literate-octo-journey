import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-global-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-notification.component.html',
  styleUrl: './global-notification.component.scss',
})
export class GlobalNotificationComponent {
  message: string | null | undefined = null;
  type: 'success' | 'error' | 'info' | undefined = 'info';

  constructor(private notificationService: NotificationService) {
    this.notificationService.notification$.subscribe((notification) => {
      this.message = notification?.message;
      this.type = notification?.type;
      setTimeout(() => this.clear(), 5000);
    });
  }

  getNotificationClass() {
    switch (this.type) {
      case 'success':
        return 'bg-custom-light-green';
      case 'error':
        return 'bg-custom-light-red';
      case 'info':
      default:
        return 'bg-custom-light-yellow';
    }
  }

  clear() {
    this.message = null;
  }
}

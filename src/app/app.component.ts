import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { GlobalLoaderComponent } from './components/global-loader/global-loader.component';
import { LoaderService } from './services/loader.service';
import { GlobalNotificationComponent } from './components/global-notification/global-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    GlobalLoaderComponent,
    GlobalNotificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fision';

  showHeader = true;

  isLoading = false;

  constructor(private router: Router, private loaderService: LoaderService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.showHeader = !(
          url === '/login' ||
          url === '/forgot-password' ||
          url === '/change-contact' ||
          url === '/change-email' ||
          url === '/change-username'
        );
      });

    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}

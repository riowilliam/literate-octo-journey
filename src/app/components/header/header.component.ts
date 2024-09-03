import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuItems = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
    },
    {
      name: 'Project Monitoring',
      link: '/project-monitoring',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
    },
    {
      name: 'AR Monitoring',
      link: '/ar-monitoring',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
    },
    {
      name: 'Cash In',
      link: '/cash-in',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
    },
    {
      name: 'Cash Out',
      link: null,
      subMenu: [
        { name: 'Document', link: '/document-cash-out', isActive: false },
        {
          name: 'Regular Mutation',
          link: '/regular-cash-out',
          isActive: false,
        },
        { name: 'Facility', link: '/facility-asset', isActive: false },
      ],
      subMenuOpen: false,
      isActive: false,
    },
    {
      name: 'Master Data',
      link: null,
      subMenu: [
        { name: 'Partner', link: '/partner', isActive: false },
        { name: 'Vendor', link: '/vendor', isActive: false },
        { name: 'Project', link: '/project', isActive: false },
        { name: 'Contract', link: '/contract', isActive: false },
        { name: 'Items', link: '/items', isActive: false },
      ],
      subMenuOpen: false,
      isActive: false,
    },
  ];

  menuOpen = false;

  userName = 'user';

  mobileMenuOpen = false;
  isMasterDataOpen: boolean = false;
  isCashOutOpen: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveStates();
      }
    });
  }

  toggleMasterDataMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMasterDataOpen = !this.isMasterDataOpen;
    if (this.isMasterDataOpen) {
      this.isCashOutOpen = false;
    }
  }

  toggleCashOutMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isCashOutOpen = !this.isCashOutOpen;
    if (this.isCashOutOpen) {
      this.isMasterDataOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isClickInsideMenu(event)) {
      if (this.hasAnySubMenuOpen()) {
        this.resetAllSubMenus();
      }
    }
  }

  private isClickInsideMenu(event: MouseEvent): boolean | undefined {
    const menu = document.querySelector('.md\\:inline-block');
    const mobileMenu = document.querySelector('.md\\:hidden');
    const subMenu = document.querySelector('.absolute');

    return (
      menu?.contains(event.target as Node) ||
      mobileMenu?.contains(event.target as Node) ||
      subMenu?.contains(event.target as Node)
    );
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleSubmenu(item: any) {
    if (item) {
      if (item.subMenu) {
        item.subMenuOpen = !item.subMenuOpen;
      }
    }
  }

  handleMenuItemClick(item: any) {
    if (item) {
      if (item.subMenu) {
        this.toggleSubmenu(item);
      } else {
        this.router.navigate([item.link]);
        this.menuOpen = false;
      }
    }
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account-information']);
  }

  updateActiveStates() {
    this.menuItems.forEach((item) => {
      if (item) {
        if (item.subMenu) {
          item.subMenu.forEach((subItem) => {
            subItem.isActive = this.router.url === subItem.link;
          });
        }
        item.isActive = this.router.url === item.link;
      }
    });
  }

  hasAnySubMenuOpen(): boolean {
    return this.menuItems.some((item) => item.subMenuOpen);
  }

  resetAllSubMenus() {
    this.menuItems.forEach((item) => {
      item.subMenuOpen = false;
    });
  }

  isActive(item: any): boolean {
    if (item.link && this.router.url === item.link) {
      return true;
    }

    if (item.subMenu) {
      return item.subMenu.some(
        (subItem: any) => this.router.url === subItem.link
      );
    }

    return false;
  }
}

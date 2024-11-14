import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { RoleResponse } from './role.dto';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

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
      requiredPermissions: ['view_dashboard'],
    },
    {
      name: 'Project Monitoring',
      link: '/project-monitoring',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
      requiredPermissions: ['view_project_monitoring'],
    },
    {
      name: 'AR Monitoring',
      link: '/ar-monitoring',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
      requiredPermissions: ['view_ar_monitoring'],
    },
    {
      name: 'Cash In',
      link: '/cash-in',
      subMenu: null,
      subMenuOpen: false,
      isActive: false,
      requiredPermissions: ['view_cash_in'],
    },
    {
      name: 'Cash Out',
      link: null,
      subMenu: [
        {
          name: 'Document',
          link: '/document-cash-out',
          isActive: false,
          requiredPermissions: ['manage_documents'],
        },
        {
          name: 'Regular Mutation',
          link: '/regular-cash-out',
          isActive: false,
          requiredPermissions: ['manage_regular_mutation'],
        },
        {
          name: 'Facility',
          link: '/facility-asset',
          isActive: false,
          requiredPermissions: ['manage_facility'],
        },
      ],
      subMenuOpen: false,
      isActive: false,
      requiredPermissions: ['view_cash_out_menu'],
    },
    {
      name: 'Master Data',
      link: null,
      subMenu: [
        {
          name: 'Partner',
          link: '/partner',
          isActive: false,
          requiredPermissions: ['manage_partner'],
        },
        {
          name: 'Vendor',
          link: '/vendor',
          isActive: false,
          requiredPermissions: ['manage_vendor'],
        },
        {
          name: 'Project',
          link: '/project',
          isActive: false,
          requiredPermissions: ['manage_project'],
        },
        {
          name: 'Contract',
          link: '/contract',
          isActive: false,
          requiredPermissions: ['manage_contract'],
        },
        {
          name: 'Items',
          link: '/items',
          isActive: false,
          requiredPermissions: ['manage_items'],
        },
        {
          name: 'User',
          link: '/user',
          isActive: false,
          requiredPermissions: ['manage_user'],
        },
      ],
      subMenuOpen: false,
      isActive: false,
      requiredPermissions: ['view_master_data'],
    },
  ];

  menuOpen = false;

  fullName!: string;

  mobileMenuOpen = false;
  isMasterDataOpen: boolean = false;
  isCashOutOpen: boolean = false;

  roles: { roleCode: string; roleName: string; permissions: string[] }[] = [];
  permissions: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private notificationService: NotificationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveStates();
      }
    });

    const storedRoles = sessionStorage.getItem('role_permissions');
    if (storedRoles) {
      try {
        this.roles = JSON.parse(storedRoles);
      } catch (error) {
        this.fetchRoles();
      }
    } else {
      this.fetchRoles();
    }
  }

  ngOnInit(): void {
    this.fullName = this.authService.getFullName();
  }

  fetchRoles() {
    this.loaderService.show();
    this.httpService
      .get<RoleResponse>(
        environment.API_URL,
        'api/user/getRoleList',
        undefined,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.roles = response.data.map((role: any) => {
              if (role.roleCode === 'S-ADM') {
                this.permissions = [
                  'view_dashboard',
                  'view_project_monitoring',
                  'view_ar_monitoring',
                  'view_cash_in',
                  'view_cash_out_menu',
                  'view_master_data',
                  'manage_documents',
                  'manage_regular_mutation',
                  'manage_facility',
                  'manage_partner',
                  'manage_vendor',
                  'manage_project',
                  'manage_contract',
                  'manage_items',
                  'manage_user',
                ];
              } else if (role.roleCode === 'ADMN') {
                this.permissions = [
                  'view_dashboard',
                  'view_project_monitoring',
                  'view_ar_monitoring',
                  'view_cash_in',
                  'view_cash_out_menu',
                  'view_master_data',
                  'manage_documents',
                  'manage_regular_mutation',
                  'manage_facility',
                  'manage_partner',
                  'manage_vendor',
                  'manage_project',
                  'manage_contract',
                  'manage_items',
                ];
              } else if (role.roleCode === 'USER') {
                this.permissions = [
                  'view_dashboard',
                  'view_project_monitoring',
                  'view_ar_monitoring',
                  'view_cash_in',
                  'view_cash_out_menu',
                  'view_master_data',
                  'manage_documents',
                  'manage_regular_mutation',
                  'manage_facility',
                  'manage_partner',
                  'manage_vendor',
                  'manage_project',
                  'manage_contract',
                  'manage_items',
                ];
              } else if (role.roleCode === 'USR-V') {
                this.permissions = [
                  'view_dashboard',
                  'view_project_monitoring',
                  'view_ar_monitoring',
                  'view_cash_in',
                  'view_cash_out_menu',
                  'view_master_data',
                  'manage_documents',
                  'manage_regular_mutation',
                  'manage_facility',
                  'manage_partner',
                  'manage_vendor',
                  'manage_project',
                  'manage_contract',
                  'manage_items',
                ];
              }

              return {
                roleCode: role.roleCode,
                roleName: role.roleName,
                permissions: this.permissions,
              };
            });
            sessionStorage.setItem(
              'role_permissions',
              JSON.stringify(this.roles)
            );
            this.filterMenuItems();
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch roles', error);
        },
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
    this.loaderService.show();
    setTimeout(() => {
      this.loaderService.hide();
      this.authService.flush();
      this.router.navigate(['/login']);
    }, 1500);
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

  filterMenuItems(): void {
    this.menuItems = this.menuItems.filter((item) =>
      this.hasAccess(item.requiredPermissions)
    );

    this.menuItems.forEach((item) => {
      if (item.subMenu) {
        item.subMenu = item.subMenu.filter((subItem) =>
          this.hasAccess(subItem.requiredPermissions)
        );
      }
    });
  }

  hasAccess(requiredPermissions: string[] | null): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = this.roles.flatMap((role) => {
      if (this.authService.getUserRole() === role.roleName) {
        return role.permissions;
      }
      return [];
    });

    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );
  }
}

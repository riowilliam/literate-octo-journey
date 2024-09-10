import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string {
    const token = sessionStorage.getItem('token');
    return token ? token : '';
  }

  setFullName(fullName: string): void {
    sessionStorage.setItem('full_name', fullName);
  }

  getFullName(): string {
    const fullName = sessionStorage.getItem('full_name');
    return fullName ? fullName : '';
  }

  setUserRole(userRole: string): void {
    sessionStorage.setItem('user_role', userRole);
  }

  getUserRole(): string {
    const userRole = sessionStorage.getItem('user_role');
    return userRole ? userRole : '';
  }

  setUsername(fullName: string): void {
    sessionStorage.setItem('username', fullName);
  }

  getUsername(): string {
    const username = sessionStorage.getItem('username');
    return username ? username : '';
  }

  flush(): void {
    sessionStorage.clear();
  }

  logout() {
    this.flush();
    this.router.navigate(['/login']);
  }
}

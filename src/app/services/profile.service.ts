import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  setEmail(email: string): void {
    sessionStorage.setItem('email', email);
  }

  getEmail(): string {
    const email = sessionStorage.getItem('email');
    return email ? email : '';
  }

  removeEmail(): void {
    sessionStorage.removeItem('email');
  }

  setContact(contact: string): void {
    sessionStorage.setItem('contact', contact);
  }

  getContact(): string {
    const contact = sessionStorage.getItem('contact');
    return contact ? contact : '';
  }

  removeContanct(): void {
    sessionStorage.removeItem('contact');
  }

  setRoleCode(roleCode: string): void {
    sessionStorage.setItem('role_code', roleCode);
  }

  getRoleCode(): string {
    const roleCode = sessionStorage.getItem('role_code');
    return roleCode ? roleCode : '';
  }

  removeRoleCode(): void {
    sessionStorage.removeItem('role_code');
  }
}

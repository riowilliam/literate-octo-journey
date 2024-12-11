export class ChangePasswordRequest {
  username!: string;
  newPassword!: string;
  oldPassword!: string;

  constructor(username: string, newPassword: string, oldPassword: string) {
    this.username = username;
    this.newPassword = newPassword;
    this.oldPassword = oldPassword;
  }
}

export class ChangePasswordResponse {
  info!: string;
  data: any;
  status!: number;
}

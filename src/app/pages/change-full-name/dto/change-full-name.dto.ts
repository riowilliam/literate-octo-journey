export class ChangeFullNameRequest {
  username!: string;
  newFullName!: string;
  password!: string;

  constructor(username: string, newFullName: string, password: string) {
    this.username = username;
    this.newFullName = newFullName;
    this.password = password;
  }
}

export class ChangeFullNameResponse {
  info!: string;
  data: any;
  status!: number;
}

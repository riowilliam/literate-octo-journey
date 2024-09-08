export class ChangeUsernameRequest {
  oldUsername!: string;
  newUsername!: string;
  fullName!: string;
  password!: string;

  constructor(
    oldUsername: string,
    newUsername: string,
    fullName: string,
    password: string
  ) {
    this.oldUsername = oldUsername;
    this.newUsername = newUsername;
    this.fullName = fullName;
    this.password = password;
  }
}

export class ChangeUsernameResponse {
  info!: string;
  data: any;
  status!: number;
}

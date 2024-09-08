export class LoginRequest {
  username!: string;
  password!: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class LoginResponseData {
  isValid!: boolean;
  jwtToken!: string;
  username!: string;
  fullName!: string;
  userRole!: string;
}

export class LoginResponse {
  info!: string;
  data!: LoginResponseData;
  status!: number;
}

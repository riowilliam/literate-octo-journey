export class ProfileData {
  username: string;
  fullName: string;
  email: string;
  contact: string;
  roleCode: string;

  constructor(
    username: string,
    fullName: string,
    email: string,
    contact: string,
    roleCode: string
  ) {
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.contact = contact;
    this.roleCode = roleCode;
  }
}

export class ProfileResponse {
  info: string;
  data: ProfileData;
  status: number;

  constructor(info: string, data: ProfileData, status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

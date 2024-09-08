export class UserList {
  username!: string;
  fullName!: string;
  email!: string;
  roleName!: string | null;
  roleCode!: string | null;
  contact!: string;
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;

  static fromApiResponse(data: UserList[]): User[] {
    return data.map((userData, index) => ({
      no: index + 1,
      username: userData?.username,
      fullname: userData?.fullName,
      email: userData?.email,
      role: userData?.roleName ? userData?.roleName : userData?.roleCode,
      contact: userData?.contact,
      created_date: userData?.createdDate,
      created_by: userData?.createdBy,
      modified_date: userData?.modifiedDate,
      modified_by: userData?.modifiedBy,
      action: 'Edit',
    }));
  }
}

export class User {
  no!: number;
  username!: string;
  fullname!: string;
  email!: string;
  role!: string | null;
  contact!: string;
  created_date!: string;
  created_by!: string;
  modified_date!: string;
  modified_by!: string;
  action!: string;
}

export class Pageable {
  sort!: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  pageNumber!: number;
  pageSize!: number;
  offset!: number;
  paged!: boolean;
  unpaged!: boolean;
}

export class Data {
  content!: UserList[];
  pageable!: Pageable;
  last!: boolean;
  totalPages!: number;
  totalElements!: number;
  numberOfElements!: number;
  sort!: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first!: boolean;
  size!: number;
  number!: number;
  empty!: boolean;
}

export class UserResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormUserRequest {
  username!: string;
  fullName!: string;
  email!: string;
  contact!: string;
  roleCode!: string;

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

export class FormUserResponse {
  info!: string;
  data!: any;
  status!: number;
}

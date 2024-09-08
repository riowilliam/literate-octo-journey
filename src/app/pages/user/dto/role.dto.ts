export class Role {
  roleCode: string;
  roleName: string;

  constructor(roleCode: string, roleName: string) {
    this.roleCode = roleCode;
    this.roleName = roleName;
  }
}

export class RoleResponse {
  info!: string;
  data!: Role[];
  status!: number;
}

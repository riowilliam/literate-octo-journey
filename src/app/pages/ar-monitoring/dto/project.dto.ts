export class ProjectList {
  projectName!: string;
  projectId!: number;
}

export class ProjectListResponse {
  info: string;
  data: ProjectList[];
  status: number;

  constructor(info: string, data: ProjectList[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

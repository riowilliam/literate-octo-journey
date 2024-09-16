export class ProjectList {
  projectName!: string;
  startDate!: string;
  status!: string;
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;

  static fromApiResponse(data: ProjectList[]): Project[] {
    return data.map((projectData, index) => ({
      no: index + 1,
      project_name: projectData?.projectName,
      start_date: projectData?.startDate,
      status: projectData?.status === 'ACTIVE' ? 'Active' : 'Inactive',
      created_date: projectData?.createdDate,
      created_by: projectData?.createdBy,
      modified_date: projectData?.modifiedDate,
      modified_by: projectData?.modifiedBy,
      action: 'Edit',
    }));
  }
}

export class Project {
  no!: number;
  project_name!: string;
  start_date!: string;
  status!: string;
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
  content!: ProjectList[];
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

export class ProjectResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormProjectRequest {
  projectName!: string;
  startDate!: string;
  status!: string;

  constructor(projectName: string, startDate: string, status: string) {
    this.projectName = projectName;
    this.startDate = startDate;
    this.status = status;
  }
}

export class FormProjectResponse {
  info!: string;
  data!: any;
  status!: number;
}

export class ProjectListOfValue {
  projectName: string;
  projectId: number;

  constructor(projectName: string, projectId: number) {
    this.projectName = projectName;
    this.projectId = projectId;
  }
}

export class ProjectListOfValueResponse {
  info!: string;
  data!: ProjectListOfValue[];
  status!: number;
}

export class PartnerList {
  partnerName!: string;
  documentTracking!: string;
  ppnWapu!: string;
  activeProject!: string[];
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;

  static fromApiResponse(data: PartnerList[]): Partner[] {
    return data.map((partnerData, index) => ({
      no: index + 1,
      partner_name: partnerData?.partnerName,
      ppn_wapu: partnerData?.ppnWapu === 'YES' ? 'Yes' : 'No',
      active_project: partnerData?.activeProject,
      created_date: partnerData?.createdDate,
      created_by: partnerData?.createdBy,
      modified_date: partnerData?.modifiedDate,
      modified_by: partnerData?.modifiedBy,
      action: 'Edit',
    }));
  }
}

export class Partner {
  no!: number;
  partner_name!: string;
  ppn_wapu!: string;
  active_project!: string[];
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
  content!: PartnerList[];
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

export class PartnerResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormPartnerRequest {
  partnerName!: string;
  ppnWapu!: number;
  documentTracking!: number;
  activeProject!: string;

  constructor(
    partnerName: string,
    ppnWapu: string,
    documentTracking: string,
    activeProject: string
  ) {
    this.partnerName = partnerName;
    this.ppnWapu = ppnWapu === 'YES' ? 1 : 0;
    this.documentTracking = documentTracking === 'YES' ? 1 : 0;
    this.activeProject = activeProject?.toString();
  }
}

export class FormPartnerResponse {
  info!: string;
  data!: any;
  status!: number;
}

export class ProjectList {
  value!: number;
  label!: string;

  static fromApiResponse(data: ProjectList[]): Project[] {
    return data.map((projectData, index) => ({
      no: index + 1,
      project_id: projectData?.value,
      project_name: projectData?.label,
    }));
  }
}

export class Project {
  no!: number;
  project_id!: number;
  project_name!: string;
}

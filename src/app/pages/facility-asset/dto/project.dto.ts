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

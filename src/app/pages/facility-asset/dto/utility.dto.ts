export class UtilityList {
  desc!: string;
  value!: string;

  constructor(label: string, value: string) {
    this.desc = label;
    this.value = value;
  }
}

export class UtilityListResponse {
  info!: string;
  data!: UtilityList[];
  status!: number;
}

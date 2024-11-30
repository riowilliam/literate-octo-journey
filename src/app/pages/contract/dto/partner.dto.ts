export class PartnerData {
  partnerList!: PartnerList[];
  pphList!: PPPHList[];
}

export class PartnerList {
  ppnWapu!: boolean;
  documentTracking!: boolean;
  partnerId!: number;
  partnerName!: string;
  ppnValue!: number;
  activeProject!: string[];
}

export class PPPHList {
  desc!: string;
  value!: string;
}

export class PartnerListResponse {
  info: string;
  data: PartnerData;
  status: number;

  constructor(info: string, data: PartnerData, status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

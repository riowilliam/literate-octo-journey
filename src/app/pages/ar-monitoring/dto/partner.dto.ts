export class PartnerList {
  ppnWapu!: boolean;
  documentTracking!: boolean;
  partnerId!: number;
  partnerName!: string;
}

export class PartnerListResponse {
  info: string;
  data: PartnerList[];
  status: number;

  constructor(info: string, data: PartnerList[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

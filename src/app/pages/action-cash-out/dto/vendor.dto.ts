export class Vendor {
  vendorId: number;
  vendorName: string;

  constructor(vendorId: number, vendorName: string) {
    this.vendorId = vendorId;
    this.vendorName = vendorName;
  }
}

export class VendorListOfValueResponse {
  info: string;
  data: Vendor[];
  status: number;

  constructor(info: string, data: Vendor[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

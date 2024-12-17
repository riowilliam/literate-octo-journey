export class Vendor {
  vendorId: number;
  vendorName: string;
  bankAccount: string;
  bankAccountName: string;
  bankName: string;

  constructor(
    vendorId: number,
    vendorName: string,
    bankAccount: string,
    bankAccountName: string,
    bankName: string
  ) {
    this.vendorId = vendorId;
    this.vendorName = vendorName;
    this.bankAccount = bankAccount;
    this.bankAccountName = bankAccountName;
    this.bankName = bankName;
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

export class InvoiceList {
  invoiceNo!: string;
  partnerName!: string;
  contractName!: string;
  projectName!: string;
  bappNo!: string;
  amount!: number;
  ppn!: number;
  pph!: number;
  deduction!: number;
  totalAmount!: number;
  documentTracking!: string;
  invoiceStatus!: number;
  paymentStatus!: string;
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;
}

export class InvoiceListResponse {
  info: string;
  data: InvoiceList[];
  status: number;

  constructor(info: string, data: InvoiceList[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

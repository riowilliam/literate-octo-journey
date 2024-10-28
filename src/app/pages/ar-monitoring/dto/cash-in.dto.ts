export class FormCashInRequest {
  invoiceNo: string;
  partnerName: string;
  contractName: string;
  projectName: string;
  invoiceAmount: number;
  paymentAmount: number;
  paymentType: number;
  deduction: number;
  cashInStatus: string;

  constructor(data: any) {
    this.invoiceNo = data.invoiceNo;
    this.partnerName = data.partnerName;
    this.contractName = data.contractName;
    this.projectName = data.projectName;
    this.invoiceAmount = this.parseCurrency(data.paidAmount);
    this.paymentAmount = this.parseCurrency(data.netAmount);
    this.paymentType = Number(data.paymentType);
    this.deduction = this.parseCurrency(data.deduction);
    this.cashInStatus = this.determineCashInStatus(data.cashInStatus);
  }

  private parseCurrency(value: string | number): number {
    if (typeof value === 'string') {
      return Number(value.replace(/\./g, '').replace(',', '.'));
    }
    return value;
  }

  private determineCashInStatus(cashInStatus: string): string {
    if (cashInStatus === 'Pending Cash In') {
      return 'Incompleted';
    } else {
      return 'Completed';
    }
  }
}

export class FormCashInResponse {
  info!: string;
  data!: any;
  status!: number;
}

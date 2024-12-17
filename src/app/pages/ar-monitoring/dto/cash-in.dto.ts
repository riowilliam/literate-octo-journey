export class FormCashInRequest {
  invoiceNo: string;
  partnerName: string;
  contractName: string;
  projectName: string;
  invoiceAmount: number;
  paymentAmount: number;
  paymentType: number;
  interestDeduction: number;
  otherDeduction: number;
  cashInStatus: string;
  paymentBankCode: string;

  constructor(data: any) {
    this.invoiceNo = data.invoiceNo;
    this.partnerName = data.partnerName;
    this.contractName = data.contractName;
    this.projectName = data.projectName;
    this.invoiceAmount = this.parseCurrency(data.paidAmount);
    this.paymentAmount = this.parseCurrency(data.netAmount);
    this.paymentType = Number(data.paymentType);
    this.interestDeduction = this.parseCurrency(data.interestDeduction);
    this.otherDeduction = this.parseCurrency(data.otherDeduction);
    this.cashInStatus =
      Number(data.paymentType) === 2
        ? 'Incompleted'
        : this.determineCashInStatus(data.cashInStatus);
    this.paymentBankCode = data.paymentBank;
  }

  private parseCurrency(value: string | number): number {
    if (typeof value === 'string') {
      return Number(value.replace(/\./g, '').replace(',', '.'));
    }
    return value;
  }

  private determineCashInStatus(cashInStatus: string): string {
    if (
      cashInStatus === 'Pending Cash In' ||
      cashInStatus === null ||
      cashInStatus === undefined
    ) {
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

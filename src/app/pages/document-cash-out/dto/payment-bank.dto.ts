export class PaymentBankList {
  bankName!: string;
  bankAccount!: string;
  bankAccountName!: string;
  bankCodeInternal!: string;
}

export class PaymentBankListResponse {
  info: string;
  data: PaymentBankList[];
  status: number;

  constructor(info: string, data: PaymentBankList[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

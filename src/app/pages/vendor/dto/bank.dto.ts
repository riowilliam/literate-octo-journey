export class BankList {
  bankCode: string;
  bankName: string;
  bankShortName: string;

  constructor(bankCode: string, bankName: string, bankShortName: string) {
    this.bankCode = bankCode;
    this.bankName = bankName;
    this.bankShortName = bankShortName;
  }
}

export class BankListResponse {
  info!: string;
  data!: BankList[];
  status!: number;
}

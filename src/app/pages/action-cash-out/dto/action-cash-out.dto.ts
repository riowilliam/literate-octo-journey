export class FormCashOutDocumentResponse {
  info!: string;
  data!: any;
  status!: number;
}

export class CashOutDetail {
  no?: number;
  idTmpCashOut!: number;
  vendorName!: string;
  invoice!: string;
  projectName!: string;
  bankAccount!: string;
  bankAccountName!: string;
  bankName!: string;
  transferAmount!: any;
  transferFee!: any;
  paymentAmount!: any;
}

export class FormCashOutDocumentRequest {
  documentName!: string;
  subTotal!: number;
  cashOutDetailList!: CashOutDetail[];

  constructor(
    documentName: string,
    subTotal: number,
    cashOutDetailList: CashOutDetail[]
  ) {
    this.documentName = documentName;
    this.subTotal = subTotal;
    this.cashOutDetailList = cashOutDetailList;
  }
}

export class DocumentDetailResponse {
  info!: string;
  data!: CashOutData;
  status!: number;
}

export class CashOutData {
  cashOutDetailList!: CashOutDetailList[];
  documentName!: string;
  subTotal!: number;
}

export class CashOutDetailList {
  idTmpCashOut!: number;
  vendorName!: string;
  invoice!: string;
  projectName!: string;
  bankAccount!: string;
  bankAccountName!: string;
  bankName!: string;
  transferAmount!: string;
  transferFee!: string;
  paymentAmount!: string;

  static fromApiResponse(data: CashOutDetailList[]): CashOutDetail[] {
    return data.map((cashOutDetailData, index) => ({
      no: index + 1,
      idTmpCashOut: cashOutDetailData.idTmpCashOut,
      vendorName: cashOutDetailData.vendorName,
      invoice: cashOutDetailData.invoice,
      projectName: cashOutDetailData.projectName,
      bankAccount: cashOutDetailData.bankAccount,
      bankAccountName: cashOutDetailData.bankAccountName,
      bankName: cashOutDetailData.bankName,
      transferAmount: cashOutDetailData.transferAmount,
      transferFee: cashOutDetailData.transferFee,
      paymentAmount: cashOutDetailData.paymentAmount,
    }));
  }
}

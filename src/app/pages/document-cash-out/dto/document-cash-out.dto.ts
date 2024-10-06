export class DocumentCashOutList {
  documentCashOutId!: number;
  documentName!: string;
  totalAmount!: number;
  status!: number;
  createdTm!: string;
  createdBy!: string;
  modifiedTm!: string;
  modifiedBy!: string;

  static fromApiResponse(data: DocumentList[]): DocumentCashOutDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.documentCashOutList.map((cashOutDetailData, index) => ({
        no: index + 1,
        document_cash_out_id: cashOutDetailData.documentCashOutId,
        document_name: cashOutDetailData.documentName,
        total_amount: cashOutDetailData.totalAmount,
        status: cashOutDetailData.status,
        created_tm: cashOutDetailData.createdTm,
        created_by: cashOutDetailData.createdBy,
        modified_tm: cashOutDetailData.modifiedTm,
        modified_by: cashOutDetailData.modifiedBy,
      }))
    );
  }
}

export class CashOutDocSummary {
  totalAmountApprove!: number;
  totalAmountNotApprove!: number;
  totalAmountRejected!: number;
  totalCountApprove!: number;
  totalCountNotApprove!: number;
  totalCountRejected!: number;
  constructor(
    totalAmountApprove: number,
    totalAmountNotApprove: number,
    totalAmountRejected: number,
    totalCountApprove: number,
    totalCountNotApprove: number,
    totalCountRejected: number
  ) {
    this.totalAmountApprove = totalAmountApprove;
    this.totalAmountNotApprove = totalAmountNotApprove;
    this.totalAmountRejected = totalAmountRejected;
    this.totalCountApprove = totalCountApprove;
    this.totalCountNotApprove = totalCountNotApprove;
    this.totalCountRejected = totalCountRejected;
  }
}

export class DocumentCashOutDetail {
  no!: number;
  document_cash_out_id!: number;
  document_name!: string;
  total_amount!: number;
  status!: number;
  created_tm!: string;
  created_by!: string;
  modified_tm!: string;
  modified_by!: string;
}

export class DocumentList {
  documentCashOutList!: DocumentCashOutList[];
  cashOutDocSummary!: CashOutDocSummary;
}

export class Pageable {
  sort!: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  pageNumber!: number;
  pageSize!: number;
  offset!: number;
  paged!: boolean;
  unpaged!: boolean;
}

export class Data {
  content!: DocumentList[];
  pageable!: Pageable;
  last!: boolean;
  totalPages!: number;
  totalElements!: number;
  numberOfElements!: number;
  sort!: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first!: boolean;
  size!: number;
  number!: number;
  empty!: boolean;
}

export class DocumentResponse {
  info!: string;
  data!: Data;
  status!: number;
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

export interface CashOutDetail {
  no: number;
  id: number;
  vendor: string;
  invoice: string;
  bank_account: string;
  bank_account_name: string;
  bank_name: string;
  amount: number;
  transfer_fee: number;
  total: number;
  unit: string;
}

export class CashOutDetailList {
  idTmpCashOut!: number;
  vendorName!: string;
  invoice!: string;
  projectName!: string;
  bankAccount!: string;
  bankAccountName!: string;
  bankName!: string;
  amount!: number;
  transferFee!: number;
  totalAmount!: number;

  static fromApiResponse(data: CashOutDetailList[]): CashOutDetail[] {
    return data.map((cashOutDetailData, index) => ({
      no: index + 1,
      id: cashOutDetailData.idTmpCashOut,
      vendor: cashOutDetailData.vendorName,
      invoice: cashOutDetailData.invoice,
      bank_account: cashOutDetailData.bankAccount,
      bank_account_name: cashOutDetailData.bankAccountName,
      bank_name: cashOutDetailData.bankName,
      amount: cashOutDetailData.amount,
      transfer_fee: cashOutDetailData.transferFee,
      total: cashOutDetailData.totalAmount,
      unit: cashOutDetailData.projectName,
    }));
  }
}

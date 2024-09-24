export class CashOutDetailList {
  idTmpCashOut!: number;
  vendorName!: string;
  invoice!: string;
  projectName!: string;
  documentName!: string;
  bankAccount!: string;
  bankAccountName!: string;
  bankName!: string;
  amount!: number;
  transferFee!: number;
  totalAmount!: number;
  createdDate!: string;
  createdBy!: string;
  approvalDate!: string;
  approvedBy!: string;

  static fromApiResponse(data: RegularMutationList[]): CashOutDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.cashOutDetailList.map((cashOutDetailData, index) => ({
        no: index + 1,
        id_tmp_cash_out: cashOutDetailData.idTmpCashOut,
        vendor_name: cashOutDetailData.vendorName,
        invoice: cashOutDetailData.invoice,
        project_name: cashOutDetailData.projectName,
        document_name: cashOutDetailData.documentName,
        bank_account: cashOutDetailData.bankAccount,
        bank_account_name: cashOutDetailData.bankAccountName,
        bank_name: cashOutDetailData.bankName,
        amount: cashOutDetailData.amount,
        transfer_fee: cashOutDetailData.transferFee,
        total_amount: cashOutDetailData.totalAmount,
        created_date: cashOutDetailData.createdDate,
        created_by: cashOutDetailData.createdBy,
        approval_date: cashOutDetailData.approvalDate,
        approved_by: cashOutDetailData.approvedBy,
      }))
    );
  }
}

export class CashOutDetail {
  no!: number;
  id_tmp_cash_out!: number;
  vendor_name!: string;
  invoice!: string;
  project_name!: string;
  document_name!: string;
  bank_account!: string;
  bank_account_name!: string;
  bank_name!: string;
  amount!: number;
  transfer_fee!: number;
  total_amount!: number;
  created_date!: string;
  created_by!: string;
  approval_date!: string;
  approved_by!: string;
}

export class RegularMutationList {
  cashOutDetailList!: CashOutDetailList[];
  subTotal!: number;
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
  content!: RegularMutationList[];
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

export class RegularMutationResponse {
  info!: string;
  data!: Data;
  status!: number;
}

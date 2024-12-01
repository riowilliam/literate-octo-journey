export class CashInDetailList {
  cashInId!: number;
  projectName!: string;
  invoiceNo!: string;
  partnerName!: string;
  contractName!: string;
  paymentAmount!: number;
  paymentDate!: string;
  paymentType!: string;
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;
  cashInStatus!: string;
  paymentBankCode!: string;
  fileDownloaded!: boolean;

  static fromApiResponse(data: CashInList[]): CashInDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.cashInDetailList.map((cashInDetailData, index) => ({
        no: index + 1,
        cash_in_id: cashInDetailData.cashInId,
        project_name: cashInDetailData.projectName,
        invoice_no: cashInDetailData.invoiceNo,
        partner_name: cashInDetailData.partnerName,
        contract_name: cashInDetailData.contractName,
        payment_amount: cashInDetailData.paymentAmount,
        payment_date: cashInDetailData.paymentDate,
        payment_type: cashInDetailData.paymentType,
        created_date: cashInDetailData.createdDate,
        created_by: cashInDetailData.createdBy,
        modified_date: cashInDetailData.modifiedDate,
        modified_by: cashInDetailData.modifiedBy,
        cash_in_status: cashInDetailData.cashInStatus,
        payment_bank_code: cashInDetailData.paymentBankCode,
        file_downloaded: cashInDetailData.fileDownloaded,
      }))
    );
  }
}

export class CashInSummary {
  totalFullyPayment!: number;
  totalPartialyPayment!: number;
  totalCompleted!: number;
  totalPending!: number;
  constructor(
    totalFullyPayment: number,
    totalPartialyPayment: number,
    totalCompleted: number,
    totalPending: number
  ) {
    this.totalFullyPayment = totalFullyPayment;
    this.totalPartialyPayment = totalPartialyPayment;
    this.totalCompleted = totalCompleted;
    this.totalPending = totalPending;
  }
}

export class CashInDetail {
  no!: number;
  cash_in_id!: number;
  project_name!: string;
  invoice_no!: string;
  partner_name!: string;
  contract_name!: string;
  payment_amount!: number;
  payment_date!: string;
  payment_type!: string;
  created_date!: string;
  created_by!: string;
  modified_date!: string;
  modified_by!: string;
  cash_in_status!: string;
  payment_bank_code!: string;
  file_downloaded!: boolean;
}

export class CashInList {
  cashInDetailList!: CashInDetailList[];
  cashInSummary!: CashInSummary;
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
  content!: CashInList[];
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

export class CashInResponse {
  info!: string;
  data!: Data;
  status!: number;
}

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
  paymentBank: string;

  constructor(data: any) {
    this.invoiceNo = data.invoiceNo;
    this.partnerName = data.partnerName;
    this.contractName = data.contractName;
    this.projectName = data.projectName;
    this.invoiceAmount = this.parseCurrency(data.amount);
    this.paymentAmount = this.parseCurrency(data.netAmount);
    this.paymentType = Number(data.paymentType);
    this.interestDeduction = this.parseCurrency(data.interestDeduction);
    this.otherDeduction = this.parseCurrency(data.otherDeduction);
    this.cashInStatus =
      Number(data.paymentType) === 2
        ? 'Incompleted'
        : this.determineCashInStatus(data.cashInStatus);
    this.paymentBank = data.paymentBank;
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

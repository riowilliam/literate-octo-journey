export class FacilityTransactionList {
  id!: number;
  companyName!: string;
  transactionDate!: string;
  amount!: number;
  facilityType!: string;
  transactionType!: string;
  approvalDate!: string;
  debitAdvice!: any;
  tenorDate!: string;
  projectName!: string;

  static fromApiResponse(data: FacilityList[]): FaicilityDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.facilityTransactionList.map(
        (facilityTransactionDetailData, index) => ({
          no: index + 1,
          id: facilityTransactionDetailData.id,
          company_name: facilityTransactionDetailData.companyName,
          transaction_date: facilityTransactionDetailData.transactionDate,
          amount: facilityTransactionDetailData.amount,
          facility_type: facilityTransactionDetailData.facilityType,
          transaction_type: facilityTransactionDetailData.transactionType,
          approval_date: facilityTransactionDetailData.approvalDate,
          debit_advice: facilityTransactionDetailData.debitAdvice,
          tenor_date: facilityTransactionDetailData.tenorDate,
          project_name: facilityTransactionDetailData.projectName,
          action: 'Edit',
        })
      )
    );
  }
}

export class FacilitySummary {
  Payment!: number;
  facilityBalanceList!: FacilityBalanceList[];
  constructor(Payment: number, facilityBalanceList: FacilityBalanceList[]) {
    this.Payment = Payment;
    this.facilityBalanceList = facilityBalanceList;
  }
}

export class FacilityBalanceList {
  facilityType!: string;
  amount!: number;

  constructor(facilityType: string, amount: number) {
    this.facilityType = facilityType;
    this.amount = amount;
  }
}

export class FaicilityDetail {
  no!: number;
  id!: number;
  company_name!: string;
  transaction_date!: string;
  amount!: number;
  facility_type!: string;
  transaction_type!: string;
  approval_date!: string;
  debit_advice!: any;
  tenor_date!: string;
  project_name!: string;
  action!: string;
}

export class FacilityList {
  facilityTransactionList!: FacilityTransactionList[];
  facilitySummary!: FacilitySummary;
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
  content!: FacilityList[];
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

export class FacilityResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FacilityTypeResponse {
  info!: string;
  data!: Array<any>;
  status!: number;
}

export class FormFacilityTransactionRequest {
  amount!: number;
  debitAdvice!: string;
  facilityType!: string;
  projectName!: string;
  transactionDate!: string;
  companyName!: string;
  coverStartDate!: string;
  coverEndDate!: string;
  downPayment!: number;
  quote!: number;
  implementation!: number;
  maintenance!: number;

  constructor(
    amount: number,
    debitAdvice: string,
    facilityType: string,
    projectName: string,
    transactionDate: string,
    companyName: string,
    coverStartDate: string,
    coverEndDate: string,
    downPayment: number,
    quote: number,
    implementation: number,
    maintenance: number
  ) {
    this.amount = amount;
    this.debitAdvice = debitAdvice;
    this.facilityType = facilityType;
    this.projectName = projectName;
    this.transactionDate = transactionDate;
    this.companyName = companyName;
    this.coverStartDate = coverStartDate;
    this.coverEndDate = coverEndDate;
    this.downPayment = downPayment;
    this.quote = quote;
    this.implementation = implementation;
    this.maintenance = maintenance;
  }
}

export class FormFacilityTransactionResponse {
  info!: string;
  data!: any;
  status!: number;
}

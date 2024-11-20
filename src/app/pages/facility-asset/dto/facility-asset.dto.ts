export class FacilityTransactionList {
  vendorName!: string;
  transactionDate!: string;
  amount!: number;
  facilityType!: string;
  transactionType!: string;
  approvalDate!: string;
  tenorDate!: string;

  static fromApiResponse(data: FacilityList[]): FaicilityDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.facilityTransactionList.map(
        (facilityTransactionDetailData, index) => ({
          no: index + 1,
          vendor_name: facilityTransactionDetailData.vendorName,
          transaction_date: facilityTransactionDetailData.transactionDate,
          amount: facilityTransactionDetailData.amount,
          facility_type: facilityTransactionDetailData.facilityType,
          transaction_type: facilityTransactionDetailData.transactionType,
          approval_date: facilityTransactionDetailData.approvalDate,
          tenor_date: facilityTransactionDetailData.tenorDate,
        })
      )
    );
  }
}

export class FacilitySummary {
  Payment!: number;
  Return!: number;
  constructor(Payment: number, Return: number) {
    this.Payment = Payment;
    this.Return = Return;
  }
}

export class FaicilityDetail {
  no!: number;
  vendor_name!: string;
  transaction_date!: string;
  amount!: number;
  facility_type!: string;
  transaction_type!: string;
  approval_date!: string;
  tenor_date!: string;
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

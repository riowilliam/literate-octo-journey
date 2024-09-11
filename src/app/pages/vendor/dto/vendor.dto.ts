export class VendorList {
  vendorId!: string;
  vendorName!: string;
  bankAccountName!: string;
  bankAccount!: string;
  bankName!: string;
  bankCode!: string;
  createdTm!: string;
  createdBy!: string;
  modifiedTm!: string;
  modifiedBy!: string;

  static fromApiResponse(data: VendorList[]): Vendor[] {
    return data.map((vendorData, index) => ({
      no: index + 1,
      vendor_id: vendorData?.vendorId,
      vendor_name: vendorData?.vendorName,
      bank_account_name: vendorData?.bankAccountName,
      bank_account: vendorData?.bankAccount,
      bank_name: vendorData?.bankName,
      bank_code: vendorData?.bankCode,
      created_tm: vendorData?.createdTm,
      created_by: vendorData?.createdBy,
      modified_tm: vendorData?.modifiedTm,
      modified_by: vendorData?.modifiedBy,
      action: 'Edit',
    }));
  }
}

export class Vendor {
  no!: number;
  vendor_id!: string;
  vendor_name!: string;
  bank_account_name!: string;
  bank_account!: string;
  bank_name!: string;
  bank_code!: string;
  created_tm!: string;
  created_by!: string;
  modified_tm!: string;
  modified_by!: string;
  action!: string;
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
  content!: VendorList[];
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

export class VendorResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormVendorRequest {
  vendorName!: string;
  bankName!: string;
  bankAccount!: string;
  bankAccountName!: string;
  bankCode!: string;
  vendorId?: number;

  constructor(
    vendorName: string,
    bankName: string,
    bankAccount: string,
    bankAccountName: string,
    bankCode: string,
    vendorId?: number
  ) {
    this.vendorName = vendorName;
    this.bankName = bankName;
    this.bankAccount = bankAccount;
    this.bankAccountName = bankAccountName;
    this.bankCode = bankCode;
    this.vendorId = vendorId;
  }
}

export class FormVendorResponse {
  info!: string;
  data!: any;
  status!: number;
}

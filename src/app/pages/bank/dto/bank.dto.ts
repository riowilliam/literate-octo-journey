export class BankList {
  bankCode!: string;
  bankName!: string;
  bankShortName!: string;
  createdBy!: string;
  createdTm!: string;
  modifiedBy!: string;
  modifiedTm!: string;
  msBankId!: number;

  static fromApiResponse(data: BankList[]): Bank[] {
    return data.map((bankData, index) => ({
      no: index + 1,
      bank_code: bankData?.bankCode,
      bank_name: bankData?.bankName,
      bank_short_name: bankData?.bankShortName,
      created_by: bankData?.createdBy,
      created_tm: bankData?.createdTm,
      modified_by: bankData?.modifiedBy,
      modified_tm: bankData?.modifiedTm,
      ms_bank_id: bankData?.msBankId,
      action: 'Edit',
    }));
  }
}

export class Bank {
  no!: number;
  bank_code!: string;
  bank_name!: string;
  bank_short_name!: string;
  created_by!: string;
  created_tm!: string;
  modified_by!: string;
  modified_tm!: string;
  ms_bank_id!: number;
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
  content!: BankList[];
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

export class BankResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormBankRequest {
  bankName!: string;
  bankShortName!: string;
  bankCode!: string;
  id?: number;

  constructor(
    bankName: string,
    bankShortName: string,
    bankCode: string,
    id?: number
  ) {
    this.bankName = bankName;
    this.bankShortName = bankShortName;
    this.bankCode = bankCode;
    this.id = id;
  }
}

export class FormBankResponse {
  info!: string;
  data!: any;
  status!: number;
}

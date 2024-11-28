export class ContractList {
  contractNo!: string;
  contractName!: string;
  partnerName!: string;
  contractDate!: string;
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;

  static fromApiResponse(data: ContractList[]): Contract[] {
    return data.map((contractData, index) => ({
      no: index + 1,
      contract_no: contractData?.contractNo,
      contract_name: contractData?.contractName,
      partner_name: contractData?.partnerName,
      contract_date: contractData?.contractDate,
      created_date: contractData?.createdDate,
      created_by: contractData?.createdBy,
      modified_date: contractData?.modifiedDate,
      modified_by: contractData?.modifiedBy,
      item_details: contractData?.contractName,
      revision: contractData?.contractName,
      action: 'Edit',
    }));
  }
}

export class Contract {
  no!: number;
  contract_no!: string;
  created_date!: string;
  created_by!: string;
  modified_date!: string;
  modified_by!: string;
  item_details!: string;
  revision!: string;
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
  content!: ContractList[];
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

export class ContractResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormContractRequest {
  contractNo!: string;
  contractName!: string;
  partnerName!: string;
  activeProject!: string;
  contractDate!: Date;
  addendumDate!: Date;
  revision!: number;
  itemDetailList!: ItemDetailList[];

  constructor(
    contractNo: string,
    contractName: string,
    partnerName: string,
    activeProject: string,
    contractDate: Date,
    addendumDate: Date,
    revision: string,
    itemDetailList: ItemDetailList[],
  ) {
    this.contractNo = contractNo;
    this.contractName = contractName;
    this.partnerName = partnerName;
    this.activeProject = activeProject?.toString();
    this.contractDate = contractDate;
    this.addendumDate = addendumDate;
    this.revision = +revision;
    this.itemDetailList = itemDetailList;
  }
}

export class ItemDetail {
  no!: number;
  item_name!: string;
  paid_quantity!: number;
  remaining_quantity!: number;
  total_quantity!: number;
}

export class ItemDetailList {
  itemName!: string;
  totalQuantity!: number;
  remainingQuantity?: number;
  paidQuantity?: number;

  constructor(
    itemName: string,
    totalQuantity: string,
    remainingQuantity?: number,
    paidQuantity?: number
  ) {
    const itemListString = sessionStorage.getItem('item_list');
    if (itemListString) {
      const itemList = JSON.parse(itemListString);
      const foundItem = itemList.find(
        (option: { value: number }) => option.value === +itemName
      );
      if (foundItem) {
        this.itemName = foundItem.label;
      } else {
        this.itemName = "item id can't find";
      }
    } else {
      this.itemName = "item id can't find";
    }
    this.totalQuantity = +totalQuantity;
    this.remainingQuantity = remainingQuantity;
    this.paidQuantity = paidQuantity;
  }

  static fromApiResponse(data: ItemDetailList[]): ItemDetail[] {
    return data.map((itemDetail, index) => ({
      no: index + 1,
      item_name: itemDetail?.itemName,
      paid_quantity: itemDetail?.paidQuantity || 0,
      remaining_quantity: itemDetail?.remainingQuantity || 0,
      total_quantity: +itemDetail?.totalQuantity,
    }));
  }
}

export class FormContractResponse {
  info!: string;
  data!: any;
  status!: number;
}

export class ContractDetail {
  contractNo!: string;
  contractName!: string;
  itemList!: ItemDetailList[];
}

export class ContractDetailResponse {
  info: string;
  data: ContractDetail[];
  status: number;

  constructor(info: string, data: ContractDetail[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

export class RevisionDetail {
  // no!: number;
  revision!: number;
  created_by!: string;
  addendum_date!: string;
}

export class Revision {
  revision!: number;
  createdBy!: string;
  addendumDate!: string;
  itemList!: ItemDetailList[];

  static fromApiResponse(data: Revision[]): RevisionDetail[] {
    return data.map((revisionDetail, index) => ({
      // no: index + 1,
      revision: revisionDetail?.revision,
      addendum_date: revisionDetail?.addendumDate,
      created_by: revisionDetail?.createdBy,
    }));
  }
}

export class RevisionListResponse {
  info: string;
  data: Revision[];
  status: number;

  constructor(info: string, data: Revision[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

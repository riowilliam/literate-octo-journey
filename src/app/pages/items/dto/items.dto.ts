export class ItemList {
  itemId!: number;
  itemName!: string;
  createdTm!: string;
  createdBy!: string;
  modifiedTm!: string;
  modifiedBy!: string;

  static fromApiResponse(data: ItemList[]): Item[] {
    return data.map((itemData, index) => ({
      no: index + 1,
      id: itemData?.itemId,
      item_name: itemData?.itemName,
      created_tm: itemData?.createdTm,
      created_by: itemData?.createdBy,
      modified_tm: itemData?.modifiedTm,
      modified_by: itemData?.modifiedBy,
      action: 'Edit',
    }));
  }
}

export class Item {
  no!: number;
  id!: number;
  item_name!: string;
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
  content!: ItemList[];
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

export class ItemResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormItemRequest {
  itemName!: string;
  id?: number;
  constructor(itemName: string, id?: number) {
    this.id = id;
    this.itemName = itemName;
  }
}

export class FormItemResponse {
  info!: string;
  data!: any;
  status!: number;
}

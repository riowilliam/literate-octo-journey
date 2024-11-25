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

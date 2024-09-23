export class Item {
  itemId: number;
  itemName: string;

  constructor(itemId: number, itemName: string) {
    this.itemId = itemId;
    this.itemName = itemName;
  }
}

export class ItemListOfValueResponse {
  info: string;
  data: Item[];
  status: number;

  constructor(info: string, data: Item[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

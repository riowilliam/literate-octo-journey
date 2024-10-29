export class ItemList {
  itemName!: string;
  itemId!: number;
}

export class ItemListResponse {
  info: string;
  data: ItemList[];
  status: number;

  constructor(info: string, data: ItemList[], status: number) {
    this.info = info;
    this.data = data;
    this.status = status;
  }
}

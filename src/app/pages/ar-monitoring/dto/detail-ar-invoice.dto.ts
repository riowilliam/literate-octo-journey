export class DetailArInvoiceList {
  partnerName!: string;
  invoiceNo!: string;
  projectName!: string;
  contractName!: string;
  amount!: string;
  paymentDate!: string;
  paymentType!: string;
  cashInStatus!: string;
  static fromApiResponse(data: DetailArInvoiceList[]): DetailArInvoice[] {
    return data.map((arInvoiceData, index) => ({
      no: index + 1,
      partner_name: arInvoiceData?.partnerName,
      invoice_no: arInvoiceData?.invoiceNo,
      project_name: arInvoiceData?.projectName,
      contract: arInvoiceData?.contractName,
      amount: formatWithMask(arInvoiceData?.amount),
      payment_date: arInvoiceData?.paymentDate,
      payment_type: arInvoiceData?.paymentType,
      cash_in_status: arInvoiceData?.cashInStatus,
    }));
  }
}

export function parseCurrency(value: any): number {
  if (typeof value === 'string') {
    return Number(value.replace(/\./g, '').replace(',', '.'));
  }
  return value;
}

export function formatWithMask(value: any): string {
  const parsedValue = parseCurrency(value);
  if (!isNaN(parsedValue)) {
    let formattedValue = parsedValue.toString().replace(/\D/g, '');
    return formattedValue
      ? formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '0';
  }
  return '0';
}

export class DetailArInvoice {
  no!: number;
  partner_name!: string;
  invoice_no!: string;
  project_name!: string;
  contract!: string;
  amount!: string;
  payment_date!: string;
  payment_type!: string;
  cash_in_status!: string;
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

export class DetailArInvoiceResponse {
  info!: string;
  data!: DetailArInvoiceList[];
  status!: number;
}

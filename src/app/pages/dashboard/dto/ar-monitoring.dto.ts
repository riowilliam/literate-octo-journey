export class ArInvoiceDetailList {
  invoiceNo!: string;
  partnerName!: string;
  contractNo!: string;
  projectName!: string;
  bappNo!: string;
  amount!: number;
  ppn!: number;
  pph!: number;
  totalAmount!: number;
  documentTracking!: string;
  invoiceStatus!: number;
  paymentStatus!: string | null;
  createdDate!: string;
  createdBy!: string;
  modifiedDate!: string;
  modifiedBy!: string;
  deduction!: number;

  static fromApiResponse(data: ArInvoiceList[]): ArInvoiceDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.arInvoiceDetailList.map((arInvoiceDetailData, index) => ({
        no: index + 1,
        invoice_no: arInvoiceDetailData.invoiceNo || '',
        partner_name: arInvoiceDetailData.partnerName || '',
        contract_no: arInvoiceDetailData.contractNo || '',
        project_name: arInvoiceDetailData.projectName || '',
        bapp_no: arInvoiceDetailData.bappNo || '',
        amount: arInvoiceDetailData.amount || 0,
        ppn_amount: arInvoiceDetailData.ppn || 0,
        pph_amount: arInvoiceDetailData.pph || 0,
        total_amount: arInvoiceDetailData.totalAmount || 0,
        invoice_status: arInvoiceDetailData.invoiceStatus || 0,
        payment_status: arInvoiceDetailData.paymentStatus || null,
        created_date: arInvoiceDetailData.createdDate || 'N/A',
        created_by: arInvoiceDetailData.createdBy || 'Unknown',
        modified_date: arInvoiceDetailData.modifiedDate || 'N/A',
        modified_by: arInvoiceDetailData.modifiedBy || 'Unknown',
        deduction: arInvoiceDetailData.deduction || 0,
      }))
    );
  }
}

export class ArInvoiceSummaryDto {
  totalAmountApprove!: number;
  totalAmountNotApprove!: number;
  totalAmountRejected!: number;
  totalPaymentAmountPaid!: number;
  totalPaymentAmountUnpaid!: number;

  constructor(
    totalAmountApprove: number,
    totalAmountNotApprove: number,
    totalAmountRejected: number,
    totalPaymentAmountPaid: number,
    totalPaymentAmountUnpaid: number
  ) {
    this.totalAmountApprove = totalAmountApprove;
    this.totalAmountNotApprove = totalAmountNotApprove;
    this.totalAmountRejected = totalAmountRejected;
    this.totalPaymentAmountPaid = totalPaymentAmountPaid;
    this.totalPaymentAmountUnpaid = totalPaymentAmountUnpaid;
  }
}

export class ArInvoiceDetail {
  no!: number;
  invoice_no!: string;
  partner_name!: string;
  contract_no!: string;
  project_name!: string;
  bapp_no!: string;
  amount!: number;
  ppn_amount!: number;
  pph_amount!: number;
  total_amount!: number;
  invoice_status!: number;
  payment_status!: string | null;
  created_date!: string;
  created_by!: string;
  modified_date!: string;
  modified_by!: string;
  deduction!: number;
}

export class ArInvoiceList {
  arInvoiceDetailList!: ArInvoiceDetailList[];
  arInvoiceSummaryDto!: ArInvoiceSummaryDto;
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
  content!: ArInvoiceList[];
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

export class ArInvoiceResponse {
  info!: string;
  data!: Data;
  status!: number;
}

export class FormARInvoiceRequest {
  invoiceNo: string;
  invoiceDate: Date;
  partnerName: string;
  contractNo: string;
  projectName: string;
  bappNo: string;
  bappDate: Date;
  taxInvoiceNumber: string;
  progress: number;
  downPayment: number;
  retention: number;
  amount: number;
  ppn: number;
  ppnWapu: number;
  pph: number;
  totalAmount: number;
  note: string;
  itemDetails: { itemName: string; paymentQuantity: number }[];

  constructor(data: any) {
    this.invoiceNo = data.formInvoiceNo;
    this.invoiceDate = data.formInvoiceDate;
    this.partnerName = data.formPartner;
    this.contractNo = data.formContract;
    this.projectName = data.formProject;
    this.bappNo = data.formBAPPNo;
    this.bappDate = data.formBAPPDate;
    this.taxInvoiceNumber = data.formTaxInvoiceNumber;
    this.progress = this.parseCurrency(data.formProgress);
    this.downPayment = this.parseCurrency(data.formDownPayment);
    this.retention = this.parseCurrency(data.formRetention);
    this.amount = this.parseCurrency(data.formAmount);
    this.ppn = this.parseCurrency(data.formPPN);
    this.ppnWapu = this.parseCurrency(data.formPPNWAPU);
    this.pph = this.calculatePPH(data.formPPH);
    this.totalAmount = this.parseCurrency(data.formNetAmount);
    this.note = data.formNote;

    this.itemDetails = data.formItemDetailList
      .filter((item: any) => Number(item.formPaidQuantity) > 0)
      .map((item: any) => ({
        itemName: item.formItemName,
        paymentQuantity: Number(item.formPaidQuantity),
      }));
  }

  private parseCurrency(value: string): number {
    return Number(value.replace(/\./g, '').replace(',', '.'));
  }

  private calculatePPH(pphArray: any[]): number {
    return pphArray.reduce(
      (total, pph) => total + this.parseCurrency(pph.formPPHAmount),
      0
    );
  }
}

export class FormARInvoiceResponse {
  info!: string;
  data!: any;
  status!: number;
}

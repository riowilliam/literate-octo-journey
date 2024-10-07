export class ArInvoiceDetailList {
  invoiceNo!: string;
  partnerName!: string;
  contractName!: string;
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

  static fromApiResponse(data: ArInvoiceList[]): ArInvoiceDetail[] {
    return data.flatMap((mutationList) =>
      mutationList.arInvoiceDetailList.map((arInvoiceDetailData, index) => ({
        no: index + 1,
        invoice_no: arInvoiceDetailData.invoiceNo || '',
        partner_name: arInvoiceDetailData.partnerName || '',
        contract_name: arInvoiceDetailData.contractName || '',
        project_name: arInvoiceDetailData.projectName || '',
        bapp_no: arInvoiceDetailData.bappNo || '',
        amount: arInvoiceDetailData.amount || 0,
        ppn_amount: arInvoiceDetailData.ppn || 0,
        pph_amount: arInvoiceDetailData.pph || 0,
        total_amount: arInvoiceDetailData.totalAmount || 0,
        document_tracking: arInvoiceDetailData.documentTracking || 'Unknown',
        invoice_status: arInvoiceDetailData.invoiceStatus || 0,
        payment_status: arInvoiceDetailData.paymentStatus || null,
        created_date: arInvoiceDetailData.createdDate || 'N/A',
        created_by: arInvoiceDetailData.createdBy || 'Unknown',
        modified_date: arInvoiceDetailData.modifiedDate || 'N/A',
        modified_by: arInvoiceDetailData.modifiedBy || 'Unknown',
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
  contract_name!: string;
  project_name!: string;
  bapp_no!: string;
  amount!: number;
  ppn_amount!: number;
  pph_amount!: number;
  total_amount!: number;
  document_tracking!: string;
  invoice_status!: number;
  payment_status!: string | null;
  created_date!: string;
  created_by!: string;
  modified_date!: string;
  modified_by!: string;
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

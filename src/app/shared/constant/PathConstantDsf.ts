import { PathConstantX } from "app/impl/shared/constant/PathConstantX";
import { PathConstant } from "./PathConstant";

export class PathConstantDsf {
    public static NAP1 = "NAP1Dsf";
    public static ADD_X = "AddXDsf";
    public static PAGING_X = "PagingXDsf";
    public static NAP1_PAGING = PathConstantDsf.NAP1 + "/" + PathConstant.PAGING;
    public static NAP1_ADD = PathConstantDsf.NAP1 + "/" + PathConstant.ADD;
    public static NAP1_ADD_X_DSF = PathConstant.NAP1 + '/' + PathConstantDsf.ADD_X;
    public static NAP1_PAGING_X_DSF = PathConstant.NAP1 + '/' + PathConstantDsf.PAGING_X;

    public static NAP2 = "NAP2Dsf";
    public static NAP2_PAGING = PathConstantDsf.NAP2 + "/" + PathConstant.PAGING;

    public static CRD_REVIEW = "CreditReviewDsf";
    public static CRD_REVIEW_PAGING = PathConstantDsf.CRD_REVIEW + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_CFNA = "CreditReviewCfnaDsf";
    public static CRD_REVIEW_CFNA_PAGING = PathConstantDsf.CRD_REVIEW_CFNA + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_CFNA_MAIN = PathConstantDsf.CRD_REVIEW_CFNA + "/" + PathConstant.MAIN;
    public static CRD_REVIEW_DETAIL = PathConstantDsf.CRD_REVIEW + "/" + PathConstant.DETAIL;

    public static CRD_APPRV_CR = "CreditApprovalDsf";
    public static CRD_APPRV_CR_PAGING = PathConstantDsf.CRD_APPRV_CR + "/" + PathConstant.PAGING;
    public static CRD_APPRV_CFNA = "CreditApprovalCfnaDsf";
    public static CRD_APPRV_CFNA_PAGING = PathConstantDsf.CRD_APPRV_CFNA + "/" + PathConstant.PAGING;
    public static CRD_APPRV_CFNA_DETAIL = PathConstantDsf.CRD_APPRV_CFNA + "/" + PathConstant.DETAIL;
    public static CRD_APPRV_PAGING = PathConstantDsf.CRD_APPRV_CR + "/" + PathConstant.PAGING;
    public static CRD_APPRV_CR_DETAIL = PathConstantDsf.CRD_APPRV_CR + "/" + PathConstant.DETAIL;

    public static NEW_LEAD_TO_BE_FOLLOW_UP = "NewLeadToBeFollowUpDsf";
    public static NEW_LEAD_TO_BE_FOLLOW_UP_PAGING = PathConstantDsf.NEW_LEAD_TO_BE_FOLLOW_UP + "/" + PathConstant.PAGING;
    public static LR_CUST = "Customer";
    public static CUST_EDIT_MAIN_DATA = "EditMainData";
    public static CUST_EDIT_MAIN_DATA_PERSONAL = PathConstantDsf.CUST_EDIT_MAIN_DATA + "/" + PathConstant.PERSONAL;
    public static CUST_EDIT_MAIN_DATA_COY = PathConstantDsf.CUST_EDIT_MAIN_DATA + "/" + PathConstant.COY;

    //#region
    public static LR_DSF = "Dsf";
    public static PAGING = "Paging";
    public static DETAIL = "Detail";
    public static APPROVAL = "Approval";
    public static INQUIRY = "Inquiry";
    //#endregion layout routes

    //#region 
    public static REPORT = "ReportDsf";
    public static REPORT_FACT_MONITORING = "ReportFactMonitoring";
    public static REPORT_FACT_MORNING_MONITORING = "ReportFactMonitoringMorning";
    public static REPORT_FACT_AFTERNOON_MONITORING = "ReportFactMonitoringAfternoon";
    public static REPORT_FACT_COLLATERAL = "ReportFactCollateral";
    public static REPORT_FACT_REMINDER1 = "ReportReminder1";
    public static REPORT_FACT_REMINDER5 = "ReportReminder5";
    public static REPORT_FACT_NEW_ALLOCATION_CEILING = "ReportNewAllocationCeiling";
    public static REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING = "ReportInvoiceKwitansiTandaTerimaPaging";
    public static REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL = "ReportInvoiceKwitansiTandaTerimaDetail";
    public static REPORT_FACT_MONTHLY_PAYMENT_SCHEDULE_SUMMARY = "ReportMonthlyPaymentScheduleSummary";
    public static REPORT_FACT_MONTHLY_DISB = "ReportMonthlyDisb";
    public static REPORT_FACT_LIST_OUTSTANDING = "ReportListOutstanding";
    public static REPORT_FACT_VIRTUAL_ACCOUNT_PAYMENT_ALLOCATION_UNIT = "ReportVirtualAccountPaymentAllocationUnit";
    public static REPORT_FACT_RAW_DATA_FACTORING = "ReportRawDataFactoring";
    public static PRINT_REPORT_FACT_MONITORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_MONITORING;
    public static PRINT_REPORT_FACT_MORNING_MONITORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_MORNING_MONITORING;
    public static PRINT_REPORT_FACT_AFTERNOON_MONITORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_AFTERNOON_MONITORING;
    public static PRINT_REPORT_FACT_COLLATERAL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_COLLATERAL;
    public static PRINT_REPORT_FACT_REMINDER1 = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_REMINDER1;
    public static PRINT_REPORT_FACT_REMINDER5 = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_REMINDER5;
    public static PRINT_REPORT_FACT_NEW_ALLOCATION_CEILING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_NEW_ALLOCATION_CEILING;
    public static PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING;
    public static PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL;
    public static PRINT_REPORT_FACT_MONTHLY_PAYMENT_SCHEDULE_SUMMARY = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_MONTHLY_PAYMENT_SCHEDULE_SUMMARY;
    public static PRINT_REPORT_FACT_MONTHLY_DISB = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_MONTHLY_DISB;
    public static PRINT_REPORT_FACT_LIST_OUTSTANDING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_LIST_OUTSTANDING;
    public static PRINT_REPORT_FACT_VIRTUAL_ACCOUNT_PAYMENT_ALLOCATION_UNIT = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_VIRTUAL_ACCOUNT_PAYMENT_ALLOCATION_UNIT;
    public static PRINT_REPORT_FACT_RAW_DATA_FACTORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_RAW_DATA_FACTORING;
    //#endregion report factoring

    //#region customer-plafond
    public static CUSTOMER_GROUP_PLAFOND = "CustomerGroupPlafondDsf";
    public static CUSTOMER_GROUP_PLAFOND_PAGING = PathConstantDsf.CUSTOMER_GROUP_PLAFOND + "/" + PathConstantDsf.PAGING;
    public static CUSTOMER_GROUP_PLAFOND_DETAIL = PathConstantDsf.CUSTOMER_GROUP_PLAFOND + "/" + PathConstantDsf.DETAIL;
    public static CUSTOMER_GROUP_PLAFOND_APPROVAL_PAGING = PathConstantDsf.CUSTOMER_GROUP_PLAFOND + "/" + PathConstantDsf.APPROVAL + "/" + PathConstantDsf.PAGING;
    public static CUSTOMER_GROUP_PLAFOND_APPROVAL_DETAIL = PathConstantDsf.CUSTOMER_GROUP_PLAFOND + "/" + PathConstantDsf.APPROVAL + "/" + PathConstantDsf.DETAIL;
    public static CUSTOMER_GROUP_PLAFOND_APPROVAL_INQUIRY = PathConstantDsf.CUSTOMER_GROUP_PLAFOND + "/" + PathConstantDsf.APPROVAL + "/" + PathConstantDsf.INQUIRY;
    //#endregion

    //#region Doc-Signer
    public static NAP_DOC_SIGNER = "DocumentSignerDsf";
    public static NAP_DOC_SIGNER_PAGING = PathConstantDsf.NAP_DOC_SIGNER + "/" + PathConstant.PAGING;
    public static NAP_DOC_SIGNER_DETAIL = PathConstantDsf.NAP_DOC_SIGNER + "/" + PathConstant.DETAIL;
    //#endregion

    
    //#region simple lead
    public static SIMPLE_LEAD = "SimpleLeadDsf";
    public static SIMPLE_LEAD_UPD = "SimpleLeadUpdateDsf";
    public static SIMPLE_LEAD_PAGING = PathConstantDsf.SIMPLE_LEAD + "/" + PathConstant.PAGING;
    public static SIMPLE_LEAD_DETAIL = PathConstantDsf.SIMPLE_LEAD + "/" + PathConstantDsf.DETAIL;
    public static SIMPLE_LEAD_MAIN_INFO = PathConstantDsf.SIMPLE_LEAD + "/MainInfo";
    public static SIMPLE_LEAD_UPD_PAGING = PathConstantDsf.SIMPLE_LEAD_UPD + "/" + PathConstant.PAGING;
    //#endregion
    public static REPORT_APP_STATUS = "ReportAppStatus";
    public static PRINT_REPORT_APP_STATUS = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_APP_STATUS;
    public static REPORT_INS_COMP_SUMMARY = "ReportInsCompanySummary";
    public static PRINT_REPORT_INS_COMP_SUMMARY = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_INS_COMP_SUMMARY;
    public static REPORT_INS_COMP_DETAIL = "ReportInsCompanyDetail";
    public static PRINT_REPORT_INS_COMP_DETAIL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_INS_COMP_DETAIL;

    //#region 
    public static REPORT_SURAT_KONFIRMASI_PERSETUJUAN = "ReportSuratKonfirmasiPersetujuan"
    public static REPORT_SURAT_KONFIRMASI_PERSETUJUAN_V2 = "ReportSuratKonfirmasiPersetujuanV2"
    public static PRINT_REPORT_SURAT_KONFIRMASI_PERJANJIAN = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_SURAT_KONFIRMASI_PERSETUJUAN;
    public static PRINT_REPORT_SURAT_KONFIRMASI_PERJANJIAN_V2 = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_SURAT_KONFIRMASI_PERSETUJUAN_V2;
    //#endregion

    //#region
    public static REPORT_LTKM = "ReportLTKM"
    public static PRINT_REPORT_LTKM = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_LTKM; 
    //#endregion
    public static REPORT_PLAFOND_FACTORING = "PlafondFactoringDsf";
    public static REPORT_PLAFOND_DF = "PlafondDfDsf";
    public static PRINT_REPORT_PLAFOND_FACTORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_PLAFOND_FACTORING;
    public static PRINT_REPORT_PLAFOND_DSF = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_PLAFOND_DF;
    public static REPORT_DISB_ORDER_DETAIL = "ReportDisbursementOrderDetail";
    public static REPORT_DISB_ORDER_PAGING = "ReportDisbursementOrderPaging";
    public static PRINT_REPORT_DISBURSEMENT_ORDER_PAGING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_DISB_ORDER_PAGING;
    public static PRINT_REPORT_DISBURSEMENT_ORDER_DETAIL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_DISB_ORDER_DETAIL;

    public static NAP_SIMPLE_LEAD = "NapFromSimpleLeadDsf";
    public static NAP_SIMPLE_LEAD_PAGING = PathConstantDsf.NAP_SIMPLE_LEAD + "/" + PathConstant.PAGING;
    public static NAP_SIMPLE_LEAD_DETAIL = PathConstantDsf.NAP_SIMPLE_LEAD + "/" + PathConstant.DETAIL;

    public static NAP1_X = 'NAP1XDsf';
    public static NAP2_X = 'NAP2XDsf';
    public static CRD_REVIEW_X = "CreditReviewXDsf";
    public static DETAIL_X = 'DetailXDsf';
    public static CRD_REVIEW_PAGING_X = PathConstantDsf.CRD_REVIEW_X + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_DETAIL_X = PathConstantDsf.CRD_REVIEW_X + "/" + PathConstantX.DETAIL_X;
    public static CRD_APPRV_DETAIL_X = PathConstant.CRD_APPRV_CR + "/" + PathConstantDsf.DETAIL_X;

    public static NEW_CUST = "NewCustomerXDsf";

    public static NAP_DOC_PRINT = "DocPrintDsf";
    public static NAP_DOC_PRINT_PAGING = PathConstantDsf.NAP_DOC_PRINT + "/" + PathConstant.PAGING;
    public static NAP_DOC_PRINT_VIEW_X = PathConstantDsf.NAP_DOC_PRINT + "/" + PathConstantX.VIEW;

    public static REPORT_APP_APPROVAL = "ReportAppApproval";
    public static PRINT_REPORT_APP_APPROVAL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_APP_APPROVAL;

    public static REPORT_AGR_PROCESS = "ReportAgrProcess";
    public static PRINT_REPORT_AGR_PROCESS = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_AGR_PROCESS;

    public static RETURN_HANDLING_NAP2 = PathConstant.RETURN_HANDLING + "/" + PathConstantDsf.NAP2;
    public static GO_LIVE_APV_X = 'GoLiveApvXDsf';
    public static PGL = "PreGoLiveDsf";
    public static GO_LIVE_APV_DETAIL_X = PathConstantDsf.GO_LIVE_APV_X + '/' + PathConstantX.DETAIL_X;
    public static GO_LIVE_APV_PAGING_X = PathConstantDsf.GO_LIVE_APV_X + '/' + PathConstantX.PAGING;
    public static PGL_APPRVL_DETAIL = PathConstantDsf.PGL + "/" + PathConstant.APPRV + "/" + PathConstant.DETAIL;
    public static PGL_APPRVL_PAGING = PathConstantDsf.PGL + "/" + PathConstant.APPRV + "/" + PathConstant.PAGING;
    public static AGRMNT_CANCEL = "AgreementCancellationDsf";
    public static AGRMNT_CANCEL_PAGING = PathConstantDsf.AGRMNT_CANCEL + "/" + PathConstant.PAGING;
    public static AGRMNT_CANCEL_DETAIL = PathConstantDsf.AGRMNT_CANCEL + "/" + PathConstantX.DETAIL_X;
    public static PGL_PAGING = PathConstantDsf.PGL + "/" + PathConstant.PAGING;
    public static PGL_DETAIL_X = PathConstantDsf.PGL + '/' + PathConstantX.DETAIL_X;
}
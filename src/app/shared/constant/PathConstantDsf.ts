import { PathConstant } from "./PathConstant";

export class PathConstantDsf {
    public static NAP1 = "NAP1Dsf";
    public static NAP1_PAGING = PathConstantDsf.NAP1 + "/" + PathConstant.PAGING;
    public static NAP1_ADD = PathConstantDsf.NAP1 + "/" + PathConstant.ADD;

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
    public static PRINT_REPORT_FACT_MONITORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_MONITORING;
    public static PRINT_REPORT_FACT_MORNING_MONITORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_MORNING_MONITORING;
    public static PRINT_REPORT_FACT_AFTERNOON_MONITORING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_AFTERNOON_MONITORING;
    public static PRINT_REPORT_FACT_COLLATERAL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_COLLATERAL;
    public static PRINT_REPORT_FACT_REMINDER1 = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_REMINDER1;
    public static PRINT_REPORT_FACT_REMINDER5 = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_REMINDER5;
    //#endregion report factoring
    public static PRINT_REPORT_FACT_NEW_ALLOCATION_CEILING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_NEW_ALLOCATION_CEILING;
    public static PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING;
    public static PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL = PathConstantDsf.REPORT + "/" + PathConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL;
    //#endregion report factoring

}
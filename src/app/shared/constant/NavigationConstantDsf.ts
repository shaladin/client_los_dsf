import { NavigationConstant } from "./NavigationConstant";
import { PathConstant } from "./PathConstant";
import { PathConstantDsf } from "./PathConstantDsf";

export class NavigationConstantDsf {
    public static NAP_MAIN_DATA_NAP1_PAGING = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP1_PAGING; //"/Nap/MainData/NAP1Dsf/Paging"
    public static NAP_MAIN_DATA_NAP1_ADD = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP1_ADD; //"/Nap/MainData/NAP1/Add"

    public static NAP_MAIN_DATA_NAP2_PAGING = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP2_PAGING; //"/Nap/MainData/NAP2/Paging"

    public static NAP_CF4W_NAP2 = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/ConsumerFinance/NAP2"
    public static NAP_CFNA_NAP2 = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/CFNA/NAP2"
    public static NAP_FL4W_NAP2 = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/FinanceLeasing/NAP2"
    public static NAP_CFRFN4W_NAP2 = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/CFRefinancing/NAP2"
    public static NAP_FCTR_NAP2 = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/Factoring/NAP2"
    public static NAP_DLFN_NAP2 = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstantDsf.NAP2; //"/Nap/DLFN/NAP2"

    public static CRD_REVIEW_PAGING = PathConstantDsf.CRD_REVIEW + "/" + PathConstant.PAGING;
    public static NAP_CRD_PRCS_CRD_REVIEW_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_REVIEW_PAGING; //"Nap/CreditProcess/CreditReview/Paging"
    public static NAP_CRD_PRCS_CRD_REVIEW_CFNA_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_REVIEW_CFNA_PAGING; //'/Nap/CreditProcess/CreditReviewCfna/Paging'

    public static NAP_CRD_PRCS_CRD_APPRV_CR_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CR_PAGING; //"/Nap/CreditProcess/CreditApproval/Paging"
    public static NAP_CRD_PRCS_CRD_APPRV_CFNA_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CFNA_PAGING; //'/Nap/CreditProcess/CreditApprovalCfna/Paging'
    public static NAP_CRD_PRCS_CRD_APPRV_CR_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CR_DETAIL; //"/Nap/CreditProcess/CreditApprovalCr/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_CFNA_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CFNA_DETAIL; //"/Nap/CreditProcess/CreditApprovalCfna/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_PAGING; //"/Nap/CreditProcess/CreditApproval/Paging"

    public static NEW_LEAD_TO_BE_FOLLOW_UP_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstantDsf.NEW_LEAD_TO_BE_FOLLOW_UP + "/" + PathConstant.PAGING; //"Lead/LeadUpdate/Paging"
    public static CUST_EDIT_MAIN_DATA_PERSONAL = "/" + PathConstantDsf.LR_CUST + "/" + PathConstantDsf.CUST_EDIT_MAIN_DATA_PERSONAL; //'/Customer/EditMainData/Personal'
    public static CUST_EDIT_MAIN_DATA_COY = "/" + PathConstantDsf.LR_CUST + "/" + PathConstantDsf.CUST_EDIT_MAIN_DATA_COY; //'/Customer/EditMainData/Company'

    //#region REPORT FACT
    public static REPORT_FACT_MONITORING = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_MONITORING;
    public static REPORT_FACT_MORNING_MONITORING = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_MORNING_MONITORING;
    public static REPORT_FACT_AFTERNOON_MONITORING = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_AFTERNOON_MONITORING;
    public static REPORT_FACT_COLLATERAL = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_COLLATERAL;
    public static REPORT_FACT_REMINDER1 = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_REMINDER1;
    public static REPORT_FACT_REMINDER5 = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_REMINDER5;
    public static REPORT_FACT_NEW_ALLOCATION_CEILING = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_NEW_ALLOCATION_CEILING;
    public static REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING;
    public static REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL;
    public static REPORT_APP_STATUS = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_APP_STATUS;
    public static REPORT_INS_COMPANY_SUMMARY = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_INS_COMP_SUMMARY;
    public static REPORT_INS_COMPANY_DETAIL = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_INS_COMP_DETAIL;
   //#endregion

     //#region CUSTOMER GROUP PLAFOND
     public static CUSTOMER_GROUP_PLAFOND_PAGING = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING;
     public static CUSTOMER_GROUP_PLAFOND_APPROVAL_PAGING = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.CUSTOMER_GROUP_PLAFOND_APPROVAL_PAGING;
     public static CUSTOMER_GROUP_PLAFOND_APPROVAL_INQUIRY = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.CUSTOMER_GROUP_PLAFOND_APPROVAL_INQUIRY;
     //#endregion

     //#region DOC SIGNER
     public static NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.NAP_DOC_SIGNER_PAGING; //'/Nap/AdminProcess/DocumentSigner/Paging'
     public static NAP_ADM_PRCS_NAP_DOC_SIGNER_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.NAP_DOC_SIGNER_DETAIL; //'/Nap/AdminProcess/DocumentSigner/Detail'
     //#endregion
    //#region 
    public static REPORT_SURAT_KONFIRMASI_PERSETUJUAN = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_SURAT_KONFIRMASI_PERJANJIAN;
    //#endregion

    //#region 
    public static REPORT_LTKM = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_LTKM;
    //#endregion
}
 

import { PathConstantX } from "app/impl/shared/constant/PathConstantX";
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
    public static REPORT_PLAFOND_FACTORING = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_PLAFOND_FACTORING;
    public static REPORT_PLAFOND_DF = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_PLAFOND_DSF;
    public static REPORT_FACT_MONTHLY_PAYMENT_SCHEDULE_SUMMARY = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_MONTHLY_PAYMENT_SCHEDULE_SUMMARY;
    public static REPORT_FACT_MONTHLY_DISB = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_MONTHLY_DISB;
    public static REPORT_FACT_LIST_OUTSTANDING = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_LIST_OUTSTANDING;
    public static REPORT_FACT_VIRTUAL_ACCOUNT_PAYMENT_ALLOCATION_UNIT = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_VIRTUAL_ACCOUNT_PAYMENT_ALLOCATION_UNIT;
    public static REPORT_FACT_RAW_DATA_FACTORING = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_FACT_RAW_DATA_FACTORING;
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

     public static REPORT_DISBURSEMENR_ORDER_PAGING = "/"+ PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_DISBURSEMENT_ORDER_PAGING;

     public static NAP_SHARING_FROM_SIMPLE_LEAD_PAGING = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstantDsf.NAP_SIMPLE_LEAD_PAGING; //"/Nap/Sharing/NapFromSimpleLead/Paging"
     public static NAP_SHARING_FROM_SIMPLE_LEAD_DETAIL = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstantDsf.NAP_SIMPLE_LEAD_DETAIL; //"/Nap/Sharing/NapFromSimpleLead/Detail"

     public static NAP_MAIN_DATA_NAP1_PAGING_X = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP1_PAGING_X_DSF; //"/Nap/MainData/NAP2/Paging"
     //public static NAP_MAIN_DATA_NAP2_PAGING_X = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP2_PAGING_X_DSF; //"/Nap/MainData/NAP2/Paging"
     
     public static NAP_MAIN_DATA_NAP1_ADD_X = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP1_ADD_X_DSF; //"/Nap/MainData/NAP1/Add"

     public static NAP_CF4W_NAP1 = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstantDsf.NAP1_X; //"Nap/ConsumerFinance/NAP1X"
     public static NAP_FL4W_NAP1 = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstantDsf.NAP1_X; //"Nap/FinanceLeasing/NAP1X"
     public static NAP_CFNA_NAP1 = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstantDsf.NAP1_X; //"Nap/CFNA/NAP1X"
     public static NAP_DLFN_NAP1 = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstantDsf.NAP1_X; //"/Nap/DLFN/NAP1X"

     public static NAP_CF4W_NAP2_X = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstantDsf.NAP2_X; //"Nap/ConsumerFinance/NAP1X"
     public static NAP_FL4W_NAP2_X = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstantDsf.NAP2_X; //"Nap/FinanceLeasing/NAP1X"
     public static NAP_CFNA_NAP2_X = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstantDsf.NAP2_X; //"Nap/CFNA/NAP1X"
     public static NAP_DLFN_NAP2_X = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstantDsf.NAP2_X; //"/Nap/DLFN/NAP1X"

     public static NAP_CRD_PRCS_CRD_REVIEW_PAGING_X = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_REVIEW_PAGING_X; //"Nap/CreditProcess/CreditReview/Paging"
     public static NAP_CRD_PRCS_CRD_REVIEW_CR_DETAIL_X = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_REVIEW_DETAIL_X; //"Nap/CreditProcess/CreditReviewCr/DetailX"

     public static NAP_CRD_PRCS_CRD_APPRV_DETAIL_X = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_DETAIL_X; //"/Nap/CreditProcess/CreditApproval/Paging"

     public static CUST_NEW_FORM_DSF = "/" + PathConstantDsf.LR_CUST + "/" + PathConstantDsf.NEW_CUST; //'/Customer/NewCustomerX'

     public static REPORT_APP_APPROVAL = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_APP_APPROVAL;

     public static REPORT_AGR_PROCESS = "/" + PathConstantDsf.LR_DSF + "/" + PathConstantDsf.PRINT_REPORT_AGR_PROCESS;

     public static GO_LIVE_APV_DETAIL_DSF = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.GO_LIVE_APV_DETAIL_X; //'/AdminProcess/GoLiveX/DetailX'
     public static GO_LIVE_APV_PAGING_DSF = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.GO_LIVE_APV_PAGING_X; //'/AdminProcess/GoLiveX/PagingX'
     public static NAP_ADM_PRCS_PGL_APPRVL_DETAIL_DSF = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.PGL_APPRVL_DETAIL; //"/Nap/AdminProcess/PreGoLive/Approval/Detail"
     public static NAP_ADM_PRCS_PGL_APPRVL_PAGING_DSF = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.PGL_APPRVL_PAGING; //"/Nap/AdminProcess/PreGoLive/Approval/Paging"
     public static NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.AGRMNT_CANCEL_PAGING; //'/Nap/AdminProcess/AgreementCancellation/Paging'
     public static NAP_ADM_PRCS_PGL_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.PGL_DETAIL_X; //'/Nap/AdminProcess/PreGoLive/DetailX'
     public static NAP_ADM_PRCS_PGL_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantDsf.PGL_PAGING; //'/Nap/AdminProcess/PreGoLive/Paging'

     public static CESSIE_PGL_PAGING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantDsf.CESSIE_PGL_PAGING; //'/Impl/Cessie/Process/PreGoLiveDsf/Paging'
     public static CESSIE_PGL_DETAIL = "/" + PathConstantX.LR_IMPL + "/" + PathConstantDsf.CESSIE_PGL_DETAIL; //'/Impl/Cessie/Process/PreGoLiveDsf/Detail'
     public static CESSIE_PGL_APPRVL_PAGING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantDsf.CESSIE_PGL_APPRVL_PAGING; //'/Impl/Cessie/Process/PreGoLiveDsf/Approval/Paging'
     public static CESSIE_PGL_APPRVL_DETAIL = "/" + PathConstantX.LR_IMPL + "/" + PathConstantDsf.CESSIE_PGL_APPRVL_DETAIL; //'/Impl/Cessie/Process/PreGoLiveDsf/Approval/Detail'
  
     public static POTENTIAL_RO_PAGING = "/" + PathConstant.LEAD + "/" + PathConstantDsf.POTENTIAL_RO_PAGING; //'/Lead/PotentialRoDsf/Paging
     public static LEAD_POTENTIAL_RO_TEL_OFFER_PAGING = "/" + PathConstant.LEAD + "/" + PathConstantDsf.POTENTIAL_RO_TEL_OFFER_PAGING; //'/Lead/PotentialRoDsf/RoTelemkOffer/Paging
     public static LEAD_POTENTIAL_RO_TEL_OFFER_VERIF = "/" + PathConstant.LEAD + "/" + PathConstantDsf.POTENTIAL_RO_TEL_OFFER_VERIF; //'/Lead/PotentialRoDsf/RoTelemkOffer/Verif
     public static LEAD_POTENTIAL_RO_VIEW = "/" + PathConstant.LR_LEAD + "/" + PathConstantDsf.POTENTIAL_RO_VIEW; //'/Lead/PotentialRoDsf/View'
  
}
 

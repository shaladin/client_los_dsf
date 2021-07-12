import { NavigationConstant } from "./NavigationConstant";
import { PathConstant } from "./PathConstant";
import { PathConstantDsf } from "./PathConstantDsf";

export class NavigationConstantDsf {
    public static NAP_MAIN_DATA_NAP1_PAGING = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP1_PAGING; //"/Nap/MainData/NAP1/Paging"
    public static NAP_MAIN_DATA_NAP1_ADD = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP1_ADD; //"/Nap/MainData/NAP1/Add"

    public static NAP_MAIN_DATA_NAP2_PAGING = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantDsf.NAP2_PAGING; //"/Nap/MainData/NAP2/Paging"

    public static NAP_CF4W_NAP2 = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/ConsumerFinance/NAP2"
    public static NAP_CFNA_NAP2 = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/CFNA/NAP2"
    public static NAP_FL4W_NAP2 = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/FinanceLeasing/NAP2"
    public static NAP_CFRFN4W_NAP2 = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/CFRefinancing/NAP2"
    public static NAP_FCTR_NAP2 = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstantDsf.NAP2; //"Nap/Factoring/NAP2"

    public static CRD_REVIEW_PAGING = PathConstantDsf.CRD_REVIEW + "/" + PathConstant.PAGING;
    public static NAP_CRD_PRCS_CRD_REVIEW_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_REVIEW_PAGING; //"Nap/CreditProcess/CreditReview/Paging"
    public static NAP_CRD_PRCS_CRD_REVIEW_CFNA_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_REVIEW_CFNA_PAGING; //'/Nap/CreditProcess/CreditReviewCfna/Paging'

    public static NAP_CRD_PRCS_CRD_APPRV_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_PAGING; //"/Nap/CreditProcess/CreditApproval/Paging"
    public static NAP_CRD_PRCS_CRD_APPRV_CFNA_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CFNA_PAGING; //'/Nap/CreditProcess/CreditApprovalCfna/Paging'
    public static NAP_CRD_PRCS_CRD_APPRV_CR_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CR_DETAIL; //"/Nap/CreditProcess/CreditApprovalCr/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_CFNA_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantDsf.CRD_APPRV_CFNA_DETAIL; //"/Nap/CreditProcess/CreditApprovalCfna/Detail"
}
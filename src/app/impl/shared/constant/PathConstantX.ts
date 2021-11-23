import {PathConstant} from 'app/shared/constant/PathConstant';

export class PathConstantX {

  //#region Common-Path
  public static X = "X";
  public static PROCESS = "Process";
  public static PAGING = 'PagingX';
  public static CESSIE = 'Cessie';
  public static ADD = 'AddX';
  public static DETAIL_X = 'DetailX';
  public static MONITORING = 'Monitoring';
  public static MOU_CUSTOMER_X = 'CustomerX';
  public static NAP2_X = 'NAP2X';
  public static PERSONAL = 'PersonalX';
  public static COY = 'CompanyX';
  public static NAP1 = "NAP1X";
  public static PERSONAL_X = "PersonalX";
  public static COY_X = "CompanyX";
  public static INSURANCE_ORDER_X = "InsuranceOrder"
  public static REVIEW_FACTORING_X = "ReviewFactoringX";
  public static APPROVAL_FACTORING_X ="ApprovalFactoringX";
  public static NAP1_X = 'NAP1X';
  public static VIEW = 'ViewX';
  public static REQ_X = "RequestX";
  //#endregion

  public static NAP2 = "NAP2X";

  //#region layout-routes
  public static LR_IMPL = 'Impl';
  //#endregion

  //#region View-Enhancing-Module
  public static VIEW_MOU_CUST_X = 'Mou/CustView/X';
  public static VIEW_CHANGE_MOU_X = "ChangeMouView/X";
  public static VIEW_AGRMNT_X = "AgrmntView/X";
  //#endregion

  //#region Nap-Crd-Prcs
  public static SUBJECT = 'SubjectX';
  public static SURVEY_VERIF_X = "SurveyVerif";
  public static VERIF = 'VerifX';

  public static COMM_RSV_FUND_PAGING = PathConstant.COMM_RSV_FUND + '/' + PathConstantX.PAGING;
  public static COMM_RSV_FUND_DETAIL = PathConstant.COMM_RSV_FUND + '/' + PathConstantX.DETAIL_X;

  public static SURVEY_VERIF_PAGING = PathConstantX.SURVEY_VERIF_X + "/" + PathConstantX.PAGING;
  public static SURVEY_VERIF_SUBJECT = PathConstantX.SURVEY_VERIF_X + "/" + PathConstantX.SUBJECT;
  public static SURVEY_VERIF_SUBJECT_VERIF = PathConstantX.SURVEY_VERIF_X + "/" + PathConstantX.SUBJECT + "/" + PathConstantX.VERIF;
  public static SURVEY_VERIF_SUBJECT_VIEW = PathConstantX.SURVEY_VERIF_X + "/" + PathConstantX.SUBJECT + "/" + PathConstantX.VIEW;

  public static CRD_REVIEW_CR_PAGING_X = PathConstant.CRD_REVIEW_CR + '/' + PathConstantX.PAGING;
  public static CRD_REVIEW_CR_DETAIL_X = PathConstant.CRD_REVIEW_CR + '/' + PathConstantX.DETAIL_X;
  public static CRD_APPRV_CR_DETAIL = PathConstant.CRD_APPRV_CR + "/" + PathConstantX.DETAIL_X;
  //#endregion

  //#region Nap-Main-Data
  public static NAP1_PAGING = PathConstant.NAP1 + '/' + PathConstantX.PAGING;
  public static NAP1_ADD = PathConstant.NAP1 + '/' + PathConstantX.ADD;

  public static PGL_DETAIL_X = PathConstant.PGL + '/' + PathConstantX.DETAIL_X;
  public static DO_MULTI_ASSET_DETAIL_X = PathConstant.DO_MULTI_ASSET + '/' + PathConstantX.DETAIL_X;
  public static CUST_CONFIRM_DETAIL_X = PathConstant.CUST_CONFIRM + '/' + PathConstantX.DETAIL_X;

  //#endregion

  //#region Nap-Admin-Prcs
  public static INVOICE_VERIF_INV_DSF_X = PathConstant.INVOICE_VERIF + "/InvoiceDetailDFX";
  public static INSURANCE_ORDER_PAGING_X = PathConstantX.INSURANCE_ORDER_X + '/' + PathConstantX.PAGING;
  public static INSURANCE_ORDER_DETAIL_X = PathConstantX.INSURANCE_ORDER_X + '/' + PathConstantX.DETAIL_X;
  public static COPY_CANCEL_APP = "CopyCancelledApplicationX";
  public static NAP_DOC_PRINT_VIEW_X = PathConstant.NAP_DOC_PRINT + "/" + PathConstantX.VIEW;
  public static NAP_DOC_SIGNER_PAGING_X = PathConstant.NAP_DOC_SIGNER + "/" + PathConstantX.PAGING;
  public static NAP_DOC_SIGNER_DETAIL_X = PathConstant.NAP_DOC_SIGNER + "/" + PathConstantX.DETAIL_X;
  //#endregion

  //#region Nap-Cust-Compl
  public static CUST_COMPL_PRSNL_X = PathConstant.DETAIL + "/" + PathConstantX.PERSONAL_X;
  public static CUST_COMPL_COY_X = PathConstant.DETAIL + "/" + PathConstantX.COY_X;

  //#region Cessie
  public static CESSIE_MONITORING = PathConstantX.CESSIE + "/" + PathConstantX.MONITORING;
  public static FACTORING_REVIEW = "FactoringReview";
  public static FACTORING_REVIEW_PAGING = PathConstantX.CESSIE + "/" + PathConstantX.PROCESS + "/" + PathConstantX.FACTORING_REVIEW + "/" + PathConstant.PAGING;
  public static ASSIGN_PROD = "AssignProd";
  public static FACTORING_REVIEW_ASSIGN_PROD = PathConstantX.CESSIE + "/" + PathConstantX.PROCESS + "/" + PathConstantX.FACTORING_REVIEW + "/" + PathConstantX.ASSIGN_PROD;
  public static FACTORING_REVIEW_DETAIL = PathConstantX.CESSIE + "/" + PathConstantX.PROCESS + "/" + PathConstantX.FACTORING_REVIEW + "/" + PathConstant.DETAIL;
  public static CESSIE_PGL_PAGING = PathConstantX.CESSIE + "/" + PathConstant.PGL + "/" + PathConstant.PAGING;
  public static CESSIE_PGL_DETAIL = PathConstantX.CESSIE + "/" + PathConstant.PGL + "/" + PathConstant.DETAIL;
  public static CESSIE_PGL_APPRVL_PAGING = PathConstantX.CESSIE + "/" + PathConstant.PGL + "/" + PathConstant.APPRV + "/" + PathConstant.PAGING;
  public static CESSIE_PGL_APPRVL_DETAIL = PathConstantX.CESSIE + "/" + PathConstant.PGL + "/" + PathConstant.APPRV + "/" + PathConstant.DETAIL;
  public static CESSIE_CANCEL = "CessieCancellation";
  public static CESSIE_CANCEL_PAGING = PathConstantX.CESSIE + "/" + PathConstantX.CESSIE_CANCEL + "/" + PathConstant.PAGING;
  public static CESSIE_CANCEL_DETAIL = PathConstantX.CESSIE + "/" + PathConstantX.CESSIE_CANCEL + "/" + PathConstant.DETAIL;
  public static CESSIE_INQUIRY = PathConstantX.CESSIE + "/" + PathConstant.INQUIRY;
  //#endregion

  //#region MOU
  public static MOU_REQ_DETAIL_X = PathConstant.MOU_REQ + '/' + PathConstantX.DETAIL_X;
  public static MOU_CUST_REQ_ADD_COLL_X = PathConstant.MOU_CUST + '/RequestAddCollX';
  public static MOU_CUST_APPRV_FCTR_X = PathConstant.MOU_CUST + '/ApprovalFactoringX';
  public static MOU_CUST_APPRV_GENERAL_X = PathConstant.MOU_CUST + '/ApprovalGeneralX';
  public static MOU_CUST_RVW_FCTR_X = PathConstant.MOU_CUST + '/ReviewFactoringX';
  public static MOU_CUST_RVW_DFLN_X = PathConstant.MOU_CUST + '/ReviewDLFNX';
  public static MOU_CUST_RVW_GENERAL_X = PathConstant.MOU_CUST + '/ReviewGeneralX';
  public static MOU_EXECUTION_DETAIL_X = PathConstant.MOU_EXECUTION + '/' + PathConstantX.DETAIL_X;
  public static MOU_EXECUTION_PAGING_X = PathConstant.MOU_EXECUTION + "/" + PathConstantX.PAGING;
  public static MOU_CUST_LEGAL_RVW_DETAIL_X = PathConstant.MOU_CUST_LEGAL_RVW + "/" + PathConstantX.DETAIL_X;
  //#endregion

  //#region Change mou
  public static CHANGE_MOU_REQ_DETAIL_X = PathConstant.CHANGE_MOU_REQ + '/' + PathConstantX.DETAIL_X;
  public static CHANGE_MOU_REQ_ADD_COLL_X = PathConstant.CHANGE_MOU + '/RequestAddCollX';
  public static CHANGE_MOU_APV_DETAIL_FCTR_X = PathConstant.CHANGE_MOU + '/ApvDetailFctrX';
  public static CHANGE_MOU_APV_DETAIL_FIN_X = PathConstant.CHANGE_MOU + '/ApvDetailFinancingX';
  public static CHANGE_MOU_APV_DETAIL_GEN_X = PathConstant.CHANGE_MOU + '/ApvDetailGenX';
  public static CHANGE_MOU_RVW_DETAIL_FCTR_X = PathConstant.CHANGE_MOU + '/ReviewDetailFctrX';
  public static CHANGE_MOU_RVW_DETAIL_FIN_X = PathConstant.CHANGE_MOU + '/ReviewFinancingX';
  public static CHANGE_MOU_RVW_DETAIL_GEN_X = PathConstant.CHANGE_MOU + '/ReviewDetailGenX';
  public static CHANGE_MOU_EXEC_DETAIL_X = PathConstant.CHANGE_MOU + '/ExecDetailX';
  public static CHANGE_MOU_REQ_DETAIL_CUST_X = PathConstant.CHANGE_MOU_REQ + '/' + PathConstant.DETAIL + '/' + PathConstantX.MOU_CUSTOMER_X;
  public static CHANGE_MOU_REQ_DETAIL_CUST_TYPE_X = PathConstant.CHANGE_MOU_REQ + '/' + PathConstant.DETAIL + '/' + PathConstantX.MOU_CUSTOMER_X + '/:MOUType';
  public static CHANGE_MOU_INQUIRY_X = PathConstant.CHANGE_MOU_INQUIRY + "X";
  public static CHANGE_MOU_RVW_PAGING_X = PathConstant.CHANGE_MOU + '/ReviewPagingX';
  public static CHANGE_MOU_DETAIL_DLFN_X = PathConstant.CHANGE_MOU_DETAIL + "/DealerfinancingX";
  public static CHANGE_MOU_DETAIL_FCTR_X = PathConstant.CHANGE_MOU_DETAIL + "/FactoringX";
  //#endregion

  //region New Approval
  public static END_DATE_GO_LIVE_APV_X = 'EndDtGoLiveApvX';
  public static END_DATE_GO_LIVE_APV_PAGING_X = PathConstantX.END_DATE_GO_LIVE_APV_X + '/' + PathConstantX.PAGING;
  public static END_DATE_GO_LIVE_APV_DETAIL_X = PathConstantX.END_DATE_GO_LIVE_APV_X + '/' + PathConstantX.DETAIL_X;

  public static GO_LIVE_APV_X = 'GoLiveApvX';
  public static GO_LIVE_APV_PAGING_X = PathConstantX.GO_LIVE_APV_X + '/' + PathConstantX.PAGING;
  public static GO_LIVE_APV_DETAIL_X = PathConstantX.GO_LIVE_APV_X + '/' + PathConstantX.DETAIL_X;
  //endregion

  //#region Nap-Cust-Compl
  public static CUST_COMPL_PRSNL = PathConstant.DETAIL + "/" + PathConstantX.PERSONAL;
  public static CUST_COMPL_COY = PathConstant.DETAIL + "/" + PathConstantX.COY;
  //endregion

  //#region Nap-Additional-Prcs
  public static RETURN_HANDLING_PAGING = PathConstant.RETURN_HANDLING + "/" + PathConstantX.PAGING;
  public static RETURN_HANDLING_DETAIL = PathConstant.RETURN_HANDLING + "/" + PathConstantX.DETAIL_X;
  public static RETURN_HANDLING_SURVEY_VERIF_PAGING_X = PathConstant.RETURN_HANDLING + "/" + PathConstantX.SURVEY_VERIF_PAGING;
  public static EDIT_APP_AFT_APV_DETAIL_X = PathConstant.EDIT_APP_AFT_APV + "/" + PathConstantX.DETAIL_X;
  //#endregion

  public static PO_EXT_X = "POX";
  public static PO_PAGING_X = PathConstant.PO + "/" + PathConstantX.PAGING;
  public static PO_PO_EXT_X = PathConstant.PO + "/" + PathConstantX.PO_EXT_X;
  public static PO_PO_EXT_DETAIL_X = PathConstantX.PO_PO_EXT_X + "/" + PathConstantX.DETAIL_X;
  public static NEW_PO_DETAIL = PathConstant.NEW_PO + "/" + PathConstantX.DETAIL_X;
  public static INVOICE_VERIF_DETAIL_X = PathConstant.INVOICE_VERIF + '/' + PathConstantX.DETAIL_X;
  public static TRIAL_CALC_X = "Trial-Calculation-X";

  //#region Nap-Admin-Prcs
  public static AGRMNT_ACT_DETAIL = PathConstant.AGRMNT_ACT + "/" + PathConstantX.DETAIL_X;
  public static INVOICE_VERIF_DETAIL_LIST_INV_X = PathConstant.INVOICE_VERIF + "/" + PathConstant.DETAIL + "/listOfInvoiceX";
  //endregion

  //#region View-Enhancing-Module
  public static VIEW_APP = "AppViewX";
  public static VIEW_CESSIE = "CessieView";
  //#endregion

  //#region Inquiry-Module
  public static APP_INQUIRY = "AppInquiryX";
  //#endregion

  //region copy app cross bl
  public static COPY_CANCEL_APP_CROSS_BL_DETAIL_X = PathConstant.COPY_CANCEL_APP_CROSS_BL + "/" + PathConstantX.DETAIL_X;
  //endregion

    //#region Nap-Sharing-Page
    public static NAP_SIMPLE_LEAD_DETAIL_X = PathConstant.NAP_SIMPLE_LEAD + "/" + PathConstantX.DETAIL_X;
    //#endregion


  //region LEAD
  public static SIMPLE_LEAD_DETAIL = PathConstant.SIMPLE_LEAD + "/" + PathConstantX.DETAIL_X;
  //endregion
}




import {PathConstant} from 'app/shared/constant/PathConstant';

export class PathConstantX {

  //#region Common-Path
  public static PROCESS = "Process";
  public static PAGING = 'PagingX';
  public static CESSIE = 'Cessie';
  public static ADD = 'AddX';
  public static DETAIL_X = 'DetailX';
  public static MONITORING = 'Monitoring';
  public static MOU_CUSTOMER_X = 'CustomerX';
  public static NAP2_X = 'NAP2X';
  //#endregion

  //#region layout-routes
  public static LR_IMPL = 'Impl';
  //#endregion

  //#region View-Enhancing-Module
  public static VIEW_MOU_CUST_X = 'Mou/CustView/X';
  public static VIEW_CHANGE_MOU_X = "ChangeMouView/X";
  //#endregion

  //#region Nap-Crd-Prcs
  public static COMM_RSV_FUND_PAGING = PathConstant.COMM_RSV_FUND + '/' + PathConstantX.PAGING;
  public static COMM_RSV_FUND_DETAIL = PathConstant.COMM_RSV_FUND + '/' + PathConstantX.DETAIL_X;

  public static CRD_REVIEW_CR_PAGING = PathConstant.CRD_REVIEW_CR + '/' + PathConstantX.PAGING;
  public static CRD_REVIEW_CR_DETAIL = PathConstant.CRD_REVIEW_CR + '/' + PathConstantX.DETAIL_X;
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
  //#endregion

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
  public static CHANGE_MOU_RVW_PAGING_X = PathConstant.CHANGE_MOU + "/ReviewPagingX";
  //#endregion

  //region New Approval
  public static END_DATE_GO_LIVE_APV_X = 'EndDtGoLiveApvX';
  public static END_DATE_GO_LIVE_APV_PAGING_X = PathConstantX.END_DATE_GO_LIVE_APV_X + '/' + PathConstantX.PAGING;
  public static END_DATE_GO_LIVE_APV_DETAIL_X = PathConstantX.END_DATE_GO_LIVE_APV_X + '/' + PathConstantX.DETAIL_X;

  public static GO_LIVE_APV_X = 'GoLiveApvX';
  public static GO_LIVE_APV_PAGING_X = PathConstantX.GO_LIVE_APV_X + '/' + PathConstantX.PAGING;
  public static GO_LIVE_APV_DETAIL_X = PathConstantX.GO_LIVE_APV_X + '/' + PathConstantX.DETAIL_X;
  //endregion

  public static INVOICE_VERIF_DETAIL_X = PathConstant.INVOICE_VERIF + '/' + PathConstantX.DETAIL_X;
}




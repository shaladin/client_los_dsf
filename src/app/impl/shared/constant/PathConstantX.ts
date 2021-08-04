import {PathConstant} from 'app/shared/constant/PathConstant';

export class PathConstantX {

  //#region layout-routes
  public static LR_IMPL = 'Impl';
  //#endregion

  //#region Common-Path
  public static CESSIE = 'Cessie';
  public static PAGING = 'PagingX';
  public static ADD = 'AddX';
  public static DETAIL_X = 'DetailX';
  public static MONITORING = 'Monitoring';
  public static MOU_CUSTOMER_X = 'CustomerX';
  public static NAP2_X = 'NAP2X';
  //#endregion

  //#region Nap-Main-Data
  public static NAP1_PAGING = PathConstant.NAP1 + '/' + PathConstantX.PAGING;
  public static NAP1_ADD = PathConstant.NAP1 + '/' + PathConstantX.ADD;

  public static PGL_DETAIL_X = PathConstant.PGL + '/' + PathConstantX.DETAIL_X;
  public static DO_MULTI_ASSET_DETAIL_X = PathConstant.DO_MULTI_ASSET + '/' + PathConstantX.DETAIL_X;
  public static CUST_CONFIRM_DETAIL_X = PathConstant.CUST_CONFIRM + '/' + PathConstantX.DETAIL_X;
  //#endregion

  //#region Cessie
  public static CESSIE_MONITORING = PathConstantX.CESSIE + '/' + PathConstantX.MONITORING;
  //#endregion

  //#region MOU
  public static MOU_REQ_DETAIL_X = PathConstant.MOU_REQ + '/' + PathConstantX.DETAIL_X;
  public static MOU_CUST_REQ_ADD_COLL_X = PathConstant.MOU_CUST + '/RequestAddCollX';
  public static MOU_CUST_RVW_FCTR_X = PathConstant.MOU_CUST + '/ReviewFactoringX';
  public static MOU_CUST_APPRV_FCTR_X = PathConstant.MOU_CUST + "/ApprovalFactoringX";
  public static MOU_EXECUTION_DETAIL_X = PathConstant.MOU_EXECUTION + "/" + PathConstantX.DETAIL_X;
  //#endregion


  //#region Change mou
  public static CHANGE_MOU_REQ_ADD_COLL_X = PathConstant.CHANGE_MOU + '/RequestAddCollX';
  public static CHANGE_MOU_REQ_DETAIL_X = PathConstant.CHANGE_MOU_REQ + "/" + PathConstantX.DETAIL_X;
  public static CHANGE_MOU_RVW_DETAIL_FCTR_X = PathConstant.CHANGE_MOU + "/ReviewDetailFctrX";
  public static CHANGE_MOU_APV_DETAIL_FCTR_X = PathConstant.CHANGE_MOU + "/ApvDetailFctrX";
  public static CHANGE_MOU_REQ_DETAIL_CUST_X = PathConstant.CHANGE_MOU_REQ + '/' + PathConstant.DETAIL + '/' + PathConstantX.MOU_CUSTOMER_X;
  public static CHANGE_MOU_REQ_DETAIL_CUST_TYPE_X = PathConstant.CHANGE_MOU_REQ + '/' + PathConstant.DETAIL + '/' + PathConstantX.MOU_CUSTOMER_X + '/:MOUType';
  //#endregion

  public static INVOICE_VERIF_DETAIL_X = PathConstant.INVOICE_VERIF + '/' + PathConstantX.DETAIL_X;
}




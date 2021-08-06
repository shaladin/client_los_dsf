import { PathConstant } from "app/shared/constant/PathConstant";

export class PathConstantX {

  //#region layout-routes
  public static LR_IMPL = "Impl";
  //#endregion

  //#region Common-Path
  public static CESSIE = "Cessie";
  public static PROCESS = "Process";
  public static PAGING = "PagingX";
  public static ADD = "AddX";
  public static DETAIL_X = PathConstant.DETAIL + "X";
  public static MONITORING = "Monitoring";
  public static MOU_CUSTOMER_X = "CustomerX";
  //#endregion

  //#region Nap-Main-Data
  public static NAP1_PAGING = PathConstant.NAP1 + "/" + PathConstantX.PAGING;
  public static NAP1_ADD = PathConstant.NAP1 + "/" + PathConstantX.ADD;

  public static PGL_DETAIL_X = PathConstant.PGL + "/" + PathConstantX.DETAIL_X;
  public static DO_MULTI_ASSET_DETAIL_X = PathConstant.DO_MULTI_ASSET + "/" + PathConstantX.DETAIL_X;
  public static CUST_CONFIRM_DETAIL_X = PathConstant.CUST_CONFIRM + "/" + PathConstantX.DETAIL_X;
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

  //#region Change mou
  public static CHANGE_MOU_REQ_ADD_COLL_X = PathConstant.CHANGE_MOU + "/RequestAddCollX";
  public static CHANGE_MOU_REQ_DETAIL_CUST_X = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL + "/" + PathConstantX.MOU_CUSTOMER_X;
  public static CHANGE_MOU_REQ_DETAIL_CUST_TYPE_X = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL + "/" + PathConstantX.MOU_CUSTOMER_X + "/:MOUType";
  //#endregion
}




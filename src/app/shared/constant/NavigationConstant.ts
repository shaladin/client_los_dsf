import { PathConstantX } from "app/impl/shared/constant/PathConstantX";
import { PathConstant } from "./PathConstant";

export class NavigationConstant {

  public static PAGES_LOGIN = "/" + PathConstant.CONTENT_ROUTES_PAGES + "/" + PathConstant.CONTENT_PAGE_LOGIN; //'Pages/Login'
  public static PAGES_CONTENT = PathConstant.CONTENT_ROUTES_PAGES + "/" + PathConstant.CONTENT_PAGE; //'Pages/Content'
  public static DASHEMPTY = "/" + PathConstant.LR_DASHBOARD + "/" + PathConstant.DASHEMPTY; //'/Dashboard/Dash-Empty'
  public static DASHBOARD = "/" + PathConstant.LR_DASHBOARD + "/" + PathConstant.DASHBOARD; //'/Dashboard/Dash-Board'
  public static DASHBOARD_SUPERSET = "/" + PathConstant.LR_DASHBOARD + "/" + PathConstant.DASHBOARD_SUPERSET; //'/Dashboard/DashBoardSuperset'
  public static PAGES_REQ_PASSWORD = "/" + PathConstant.LR_PAGES + "/" + PathConstant.CONTENT_PAGE_REQ_PASSWORD; //'/Pages/RequestPassword'
  public static BACK_TO_PAGING = '..' + "/" + PathConstant.PAGING; //'../Paging'
  public static BACK_TO_PAGING_LOWERCASE = '..' + "/" + PathConstant.PAGING_LOWERCASE; //'../paging'
  public static BACK_TO_PAGING2 = '../' + '../' + PathConstant.PAGING; //'../../Paging'
  public static BACK_TO_DETAIL = '..' + "/" + PathConstant.DETAIL; //'../Detail'
  public static BACK_TO_DETAIL_X = '..' + "/" + PathConstantX.DETAIL_X; //'../DetailX'
  public static BACK_TO_DETAIL_LOWERCASE = '..' + "/" + PathConstant.DETAIL_LOWERCASE; //'../detail'
  public static BACK_TO_DETAIL_COY = '..' + "/" + PathConstant.DETAIL + "/" + PathConstantX.COY_X; //'../Detail/CompanyX'
  public static BACK_TO_DETAIL_PERSONAL = '..' + "/" + PathConstant.DETAIL + "/" + PathConstantX.PERSONAL_X; //'../Detail/PersonalX'
  public static BACK_TO_MAIN = '..' + "/" + PathConstant.MAIN; //'../Main'
  public static BACK_TO_SUBJECT = '..' + "/" + PathConstant.SUBJECT; //'../Subject'
  public static BACK_TO_VIEW = '../' + '../' + PathConstant.VIEW; //'../../View'
  public static CONTENT_PAGE_SELF_VERIF = PathConstant.CONTENT_ROUTES_PAGES + "/" + PathConstant.CONTENT_PAGE_SELF_VERIF; //"/Pages/SelfVerification"
  public static FORMS_REPORT = "/" + PathConstant.LR_FORMS + "/" + PathConstant.REPORT; //'/Forms/Report'
  public static INTEGRATION_LOS_ERR_DATA_MONITORING = "/" + PathConstant.LR_INTEGRATION + "/" + PathConstant.LOS_ERR_DATA_MONITORING; //'/Integration/LosErrorDataMonitoring'
  public static PAGES_CHANGE_PASSWORD = "/" + PathConstant.LR_PAGES + "/" + PathConstant.CONTENT_PAGE_CHANGE_PASSWORD; //'/Pages/ChangePassword'
  public static PAGES_MODULE_SELECTION = "/" + PathConstant.LR_PAGES + "/" + PathConstant.CONTENT_PAGE_SELECT_MODULE; //'/Pages/SelectModule'

  //#region Inquiry
  public static APP_INQUIRY = "/" + PathConstant.LR_INQUIRY + "/" + PathConstantX.APP_INQUIRY; //'/Inquiry/AppInquiryX'
  public static PURCHASE_TRACKING_INQUIRY = "/" + PathConstant.LR_INQUIRY + "/" + PathConstant.PURCHASE_TRACKING_INQUIRY; //'/Inquiry/PurchaseTrackingInquiry'
  //#endregion

  //#region NAP
  public static NAP_VIEW_ASSET = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_VIEW_ASSET; //"/Nap/ViewAsset"

  //#region MainData
  public static NAP_MAIN_DATA_NAP1_PAGING = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantX.NAP1_PAGING; //"/Nap/MainData/NAP1/PagingX"
  public static NAP_MAIN_DATA_NAP1_ADD = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstantX.NAP1_ADD; //"/Nap/MainData/NAP1/AddX"
  public static NAP_MAIN_DATA_NAP2_PAGING = "/" + PathConstant.LR_NAP + "/" + PathConstant.NAP_MAIN_DATA + "/" + PathConstant.NAP2_PAGING; //"/Nap/MainData/NAP2/Paging"
  //#endregion

  //#region CustCompletion
  public static NAP_CUST_COMPL_PAGING = PathConstant.LR_NAP + "/" + PathConstant.NAP_CUST_COMPL + "/" + PathConstant.PAGING; //"Nap/CustCompletion/Paging"
  public static NAP_CUST_COMPL_DETAIL = PathConstant.LR_NAP + "/" + PathConstant.NAP_CUST_COMPL + "/" + PathConstantX.DETAIL_X; //"Nap/CustCompletion/DetailX"
  public static NAP_CUST_COMPL_OPL_DETAIL = PathConstant.LR_NAP + "/" + PathConstant.NAP_CUST_COMPL + "/" + PathConstant.OPL_DETAIL_LOWERCASE; //"Nap/CustCompletion/opl/detail"
  //#endregion

  //#region AddProcess
  public static NAP_ADD_PRCS_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_ADD_PRCS; //'Nap/AddProcess'
  public static NAP_ADD_PRCS_APP_DUP_CHECK_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_PAGING; //"/Nap/AddProcess/AppDupCheck/Paging"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_COY = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_APP_EXIST_DATA_COY; //"/Nap/AddProcess/AppDupCheck/ApplicantExistingData/Company"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL; //"/Nap/AddProcess/AppDupCheck/ApplicantExistingData/Personal"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_PERSONAL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_PERSONAL; //"/Nap/AddProcess/AppDupCheck/Personal"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_COY = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_COY; //"/Nap/AddProcess/AppDupCheck/Company"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_MAIN_DATA_PAGING; //"/Nap/AddProcess/AppDupCheckMainData/Paging"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST; //"/Nap/AddProcess/AppDupCheckMainData/SubjList"
  public static NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH; //"/Nap/AddProcess/AppDupCheckMainData/SubjMatch"
  public static NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.CRD_APPRVL_RES_EXT_PAGING; //"/Nap/AddProcess/CreditApprovalResultExt/Paging"
  public static NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.CRD_APPRVL_RES_EXT_DETAIL; //"/Nap/AddProcess/CreditApprovalResultExt/Detail"
  public static NAP_ADD_PRCS_COPY_CANCEL_APP = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.COPY_CANCEL_APP; //'/Nap/AddProcess/CopyCancelledApplicationX'
  public static NAP_ADD_PRCS_COPY_CANCEL_APP_CROSS_BL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.COPY_CANCEL_APP_CROSS_BL; //"/Nap/AddProcess/CopyCancelledApplicationCrossBl"
  public static NAP_ADD_PRCS_COPY_CANCEL_APP_CROSS_BL_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.COPY_CANCEL_APP_CROSS_BL_DETAIL_X; //"/Nap/AddProcess/CopyCancelledApplicationCrossBl/DetailX"
  public static NAP_ADD_PRCS_OUTSTANDING_TC_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.OUTSTANDING_TC_PAGING; //"/Nap/AddProcess/OutstandingTC/Paging"
  public static NAP_ADD_PRCS_OUTSTANDING_TC_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.OUTSTANDING_TC_DETAIL; //"/Nap/AddProcess/OutstandingTC/Detail"
  public static NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_ADD_TC_PAGING; //'/Nap/AddProcess/ReturnHandlingAddTc/Paging'
  public static NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_ADD_TC_DETAIL; //'/Nap/AddProcess/ReturnHandlingAddTc/Detail'
  public static NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_COLL_PAGING; //'/Nap/AddProcess/ReturnHandlingCollateral/Paging'
  public static NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_COLL_EDIT; //'/Nap/AddProcess/ReturnHandlingCollateral/Edit'
  public static NAP_ADD_PRCS_RETURN_HANDLING_COLL_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_COLL_DETAIL; //'/Nap/AddProcess/ReturnHandlingCollateral/Detail'
  public static NAP_ADD_PRCS_RETURN_HANDLING_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.RETURN_HANDLING_PAGING; //'/Nap/AddProcess/ReturnHandling/PagingX'
  public static NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_EDIT_APP_PAGING; //'Nap/AddProcess/ReturnHandling/EditAppPaging'
  public static NAP_ADD_PRCS_RETURN_HANDLING_EDIT_CUST_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_EDIT_CUST_PAGING; //'Nap/AddProcess/ReturnHandling/editcustpaging'
  public static NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_COMM_RSV_FUND_PAGING; //"/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging"
  public static NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_PHN_VRF_PAGING; //"/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging"
  public static NAP_ADD_PRCS_RETURN_HANDLING_SRVY = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_SRVY; //"/Nap/AddProcess/ReturnHandling/Survey"
  public static NAP_ADD_PRCS_ADD_TC_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.ADD_TC_PAGING; //"/Nap/AddProcess/addtc/paging"
  public static NAP_ADD_PRCS_ADD_TC_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.ADD_TC_DETAIL; //"/Nap/AddProcess/addtc/detail"
  public static NAP_ADD_PRCS_APP_CAN_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_CAN_PAGING; //"/Nap/AddProcess/AppCancel/Paging"
  public static NAP_ADD_PRCS_APP_CAN_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_CAN_DETAIL;
  public static NAP_ADD_PRCS_APP_ASSET_CAN_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_ASSET_CAN_PAGING; //"/Nap/AddProcess/AppAssetCancel/Paging"
  public static NAP_ADD_PRCS_APP_ASSET_CAN_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.APP_ASSET_CAN_DETAIL; //"/Nap/AddProcess/AppAssetCancel/Detail"
  public static NAP_ADD_PRCS_DOC_PICKUP_REQUEST_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.DOC_PICKUP_REQUEST_PAGING; //"/Nap/AddProcess/DocumentPickupRequest/Paging"
  public static NAP_ADD_PRCS_DOC_PICKUP_REQUEST_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.DOC_PICKUP_REQUEST_DETAIL;//"/Nap/AddProcess/DocumentPickupRequest/Detail"
  public static NAP_ADD_PRCS_CRD_APPR_RES_EXT_APPRVL_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.CRD_APPR_RES_EXT_APPRVL_PAGING;//"/Nap/AddProcess/CreditApvResultExtApproval/Paging"
  public static NAP_ADD_PRCS_CRD_APPR_RES_EXT_APPRVL_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.CRD_APPR_RES_EXT_APPRVL_DETAIL;//"/Nap/AddProcess/CreditApvResultExtApproval/Detail"
  public static NAP_ADD_PRCS_EDIT_APP_AFT_APV_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_APP_AFT_APV_PAGING;//"/Nap/AddProcess/EditAppAftApv/Paging"
  public static NAP_ADD_PRCS_EDIT_APP_AFT_APV_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.EDIT_APP_AFT_APV_DETAIL_X;//"/Nap/AddProcess/EditAppAftApv/Detail"
  public static NAP_ADD_PRCS_EDIT_APP_AFT_APV_VIEW = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_APP_AFT_APV_VIEW;//"/Nap/AddProcess/EditAppAftApv/View"
  public static NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_APP_AFT_APV_APPRV_PAGING;//"/Nap/AddProcess/EditAppAftApv/Approval/Paging"
  public static NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_APP_AFT_APV_APPRV_DETAIL;//"/Nap/AddProcess/EditAppAftApv/Approval/Detail"
  public static NAP_ADD_PRCS_EDIT_APP_AFT_APV_INQUIRY = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_APP_AFT_APV_INQUIRY;//"/Nap/AddProcess/EditAppAftApv/Inquiry"
  public static NAP_ADD_PRCS_RETURN_HANDLING_NAP2 = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_NAP2;//"/Nap/AddProcess/ReturnHandling/NAP2"
  public static NAP_ADD_PRCS_RETURN_HANDLING_NAP4 = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_NAP4;//"/Nap/AddProcess/ReturnHandling/NAP4"
  public static NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_NAP2_PAGING; //"NAP/AddProcess/ReturnHandling/NAP2"
  public static NAP_ADD_PRCS_RETURN_HANDLING_NAP4_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.RETURN_HANDLING_NAP4_PAGING; //"/Nap/AddProcess/ReturnHandling/NAP4"
  public static NAP_ADD_PRCS_RETURN_HANDLING_SURVEY_VERIF_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.RETURN_HANDLING_SURVEY_VERIF_PAGING_X; //"/Nap/AddProcess/ReturnHandling/SurveyVerif/PagingX"
  public static NAP_ADD_PRCS_CUST_SYNC = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.CUST_SYNC_PAGING; //"/Nap/AddProcess/CustSync/PagingX"
  public static NAP_ADD_PRCS_EDIT_NAP_CUST_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_NAP_CUST_PAGING; //"/Nap/AddProcess/EditNapCust/Paging"
  public static NAP_ADD_PRCS_EDIT_NAP_CUST_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstant.EDIT_NAP_CUST_DETAIL; //"/Nap/AddProcess/EditNapCust/Detail"

  public static NAP_ADD_PRCS_EDIT_COMM_AFT_APV_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.EDIT_COMM_AFT_APV_PAGING;//"/Nap/AddProcess/EditCommAftApv/Paging"
  public static NAP_ADD_PRCS_EDIT_COMM_AFT_APV_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.EDIT_COMM_AFT_APV_DETAIL_X;//"/Nap/AddProcess/EditCommAftApv/DetailX"
  public static NAP_ADD_PRCS_EDIT_COMM_AFT_APV_APPRV_PAGING = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.EDIT_COMM_AFT_APV_APPRV_PAGING;//"/Nap/AddProcess/EditCommAftApv/Approval/Paging"
  public static NAP_ADD_PRCS_EDIT_COMM_AFT_APV_APPRV_DETAIL = "/" + NavigationConstant.NAP_ADD_PRCS_HEADER + "/" + PathConstantX.EDIT_COMM_AFT_APV_APPRV_DETAIL;//"/Nap/AddProcess/EditCommAftApv/Approval/Detail"
  //#endregion

  //#region AdminProcess
  public static NAP_ADM_PRCS_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_ADM_PRCS; //'Nap/AdminProcess'
  public static NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.AGRMNT_CANCEL_PAGING; //'/Nap/AdminProcess/AgreementCancellation/Paging'
  public static NAP_ADM_PRCS_AGRMNT_CANCEL_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.AGRMNT_CANCEL_DETAIL; //'/Nap/AdminProcess/AgreementCancellation/Detail'
  public static NAP_ADM_PRCS_AGRMNT_ACT_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.AGRMNT_ACT_PAGING; //'/Nap/AdminProcess/AgrmntActivation/Paging'
  public static NAP_ADM_PRCS_AGRMNT_ACT_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.AGRMNT_ACT_DETAIL; //'/Nap/AdminProcess/AgrmntActivation/DetailX'
  public static NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_VIEW = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.CUST_CONFIRM_SUBJ_VIEW; //'/Nap/AdminProcess/CustConfirmation/Subj/View'
  public static NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.CUST_CONFIRM_SUBJ_DETAIL; //'/Nap/AdminProcess/CustConfirmation/Subj/Detail'
  public static NAP_ADM_PRCS_CUST_CONFIRM_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.CUST_CONFIRM_PAGING_X; //'/Nap/AdminProcess/CustConfirmation/Paging'
  public static NAP_ADM_PRCS_CUST_CONFIRM_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.CUST_CONFIRM_DETAIL_X; //'/Nap/AdminProcess/CustConfirmation/Detail'
  public static NAP_ADM_PRCS_DO_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DO_PAGING; //'/Nap/AdminProcess/DeliveryOrder/Paging'
  public static NAP_ADM_PRCS_DO_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DO_DETAIL; //'/Nap/AdminProcess/DeliveryOrder/Detail'
  public static NAP_ADM_PRCS_DO_MULTI_ASSET_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.DO_MULTI_ASSET_PAGING_X; //"/Nap/AdminProcess/DeliveryOrderMultiAsset/Paging"
  public static NAP_ADM_PRCS_DO_MULTI_ASSET_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.DO_MULTI_ASSET_DETAIL_X; //"/Nap/AdminProcess/DeliveryOrderMultiAsset/Detail"
  public static NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.NAP_DOC_SIGNER_PAGING; //'/Nap/AdminProcess/DocumentSigner/Paging'
  public static NAP_ADM_PRCS_NAP_DOC_SIGNER_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.NAP_DOC_SIGNER_DETAIL; //'/Nap/AdminProcess/DocumentSigner/Detail'
  public static NAP_ADM_PRCS_NAP_CFNA_DOC_SIGNER_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.NAP_CFNA_DOC_SIGNER_PAGING; //'/Nap/AdminProcess/NewDocumentSigner/Paging'  => '/Nap/AdminProcess/CfnaDocumentSigner/Paging'
  public static NAP_ADM_PRCS_NAP_CFNA_DOC_SIGNER_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.NAP_CFNA_DOC_SIGNER_DETAIL; //'/Nap/AdminProcess/NewDocumentSigner/Detail'  => '/Nap/AdminProcess/CfnaDocumentSigner/Detail'
  public static NAP_ADM_PRCS_NAP_FCTR_DOC_SIGNER_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.NAP_DOC_SIGNER_PAGING_X; //'/Nap/AdminProcess/DocumentSigner/PagingX'
  public static NAP_ADM_PRCS_NAP_FCTR_DOC_SIGNER_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.NAP_DOC_SIGNER_DETAIL_X; //'/Nap/AdminProcess/DocumentSigner/DetailX'
  public static NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.NAP_DOC_PRINT_PAGING; //'/Nap/AdminProcess/DocPrint/Paging/'
  public static NAP_ADM_PRCS_NAP_DOC_PRINT_VIEW = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.NAP_DOC_PRINT_VIEW_X; //'/Nap/AdminProcess/DocPrint/ViewX/'
  public static NAP_ADM_PRCS_INVOICE_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.INVOICE_DETAIL; //"/Nap/AdminProcess/Invoice/Detail"
  public static NAP_ADM_PRCS_INVOICE_VERIF_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.INVOICE_VERIF_PAGING; //"/Nap/AdminProcess/InvoiceVerif/Paging"
  public static NAP_ADM_PRCS_INVOICE_VERIF_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.INVOICE_VERIF_DETAIL_X; //"/Nap/AdminProcess/InvoiceVerif/DetailX"
  public static NAP_ADM_PRCS_INVOICE_VERIF_INV_DSF = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.INVOICE_VERIF_INV_DSF_X; //"/Nap/AdminProcess/InvoiceVerif/InvoiceDetailDFX"
  public static NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.OFFERING_VALIDITY_APPRV_PAGING; //"/Nap/AdminProcess/OfferingValidityApproval/Paging"
  public static NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.OFFERING_VALIDITY_APPRV_DETAIL; //"/Nap/AdminProcess/OfferingValidityApproval/Detail"
  public static NAP_ADM_PRCS_OFFERING_VALIDITY_REQ_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.OFFERING_VALIDITY_REQ_PAGING; //"/Nap/AdminProcess/OfferingValidityApproval/Paging"
  public static NAP_ADM_PRCS_OFFERING_VALIDITY_REQ_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.OFFERING_VALIDITY_REQ_DETAIL; //"/Nap/AdminProcess/OfferingValidityApproval/Detail"
  public static NAP_ADM_PRCS_PGL_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.PGL_PAGING; //'/Nap/AdminProcess/PreGoLive/Paging'
  public static NAP_ADM_PRCS_PGL_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.PGL_DETAIL_X; //'/Nap/AdminProcess/PreGoLive/DetailX'
  public static NAP_ADM_PRCS_PGL_OPL_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.PGL_OPL_PAGING; //'/Nap/AdminProcess/pregoliveopl/paging'
  public static NAP_ADM_PRCS_PGL_OPL_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.PGL_OPL_DETAIL; //'/Nap/AdminProcess/pregoliveopl/detail'
  public static NAP_ADM_PRCS_PGL_REQ_APPRVL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.PGL_REQ_APPRVL; //"/Nap/AdminProcess/PreGoLive/RequestApproval"
  public static NAP_ADM_PRCS_PGL_APPRVL_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.PGL_APPRVL_PAGING; //"/Nap/AdminProcess/PreGoLive/Approval/Paging"
  public static NAP_ADM_PRCS_PGL_APPRVL_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.PGL_APPRVL_DETAIL; //"/Nap/AdminProcess/PreGoLive/Approval/Detail"
  public static NAP_ADM_PRCS_PO_PO_EXT = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.PO_PO_EXT_X; //'/Nap/AdminProcess/PurchaseOrder/PO'
  public static NAP_ADM_PRCS_PO_PO_EXT_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.PO_PO_EXT_DETAIL_X; //"/Nap/AdminProcess/PurchaseOrder/PO/Detail"
  public static NAP_ADM_PRCS_PO_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.PO_PAGING_X; //"/Nap/AdminProcess/PurchaseOrder/Paging"
  public static NAP_ADM_PRCS_NEW_PO_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.NEW_PO_PAGING; //'/Nap/AdminProcess/NewPurchaseOrder/Paging'
  public static NAP_ADM_PRCS_NEW_PO_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.NEW_PO_DETAIL; //'/Nap/AdminProcess/NewPurchaseOrder/DetailX'
  public static NAP_ADM_PRCS_DOC_CHECK_LIST_REQ_APPRV = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DOC_CHECK_LIST_REQ_APPRV; //'/Nap/AdminProcess/DocChecklist/RequestApproval'
  public static NAP_ADM_PRCS_DOC_CHECK_LIST_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DOC_CHECK_LIST_PAGING; //'/Nap/AdminProcess/DocChecklist/Paging'
  public static NAP_ADM_PRCS_DOC_CHECK_LIST_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DOC_CHECK_LIST_DETAIL; //'/Nap/AdminProcess/DocChecklist/Detail'
  public static NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DOC_CHECK_LIST_APPRV_PAGING; //'/Nap/AdminProcess/DocChecklist/Approval/Paging'
  public static NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.DOC_CHECK_LIST_APPRV_DETAIL; //'/Nap/AdminProcess/DocChecklist/Approval/Detail'
  public static NAP_ADM_PRCS_ASSET_ALLOC_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.ASSET_ALLOC_PAGING; //'/Nap/AdminProcess/AssetAllocation/Paging'
  public static NAP_ADM_PRCS_ASSET_ALLOC_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstant.ASSET_ALLOC_DETAIL; //'/Nap/AdminProcess/AssetAllocation/Detail'
  public static NAP_ADM_PRCS_INSURANCE_ORDER_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.INSURANCE_ORDER_PAGING_X; //'/Nap/AdminProcess/InsuranceOrder/PagingX'
  public static NAP_ADM_PRCS_INSURANCE_ORDER_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.INSURANCE_ORDER_DETAIL_X; //'/Nap/AdminProcess/InsuranceOrder/DetailX'
  //#endregion

  //#region CreditProcess
  public static NAP_CRD_PRCS_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_CRD_PRCS; //'Nap/CreditProcess'
  public static NAP_CRD_PRCS_COMM_RSV_FUND_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.COMM_RSV_FUND_PAGING; //"/Nap/CreditProcess/CommissionReservedFund/PagingX"
  public static NAP_CRD_PRCS_COMM_RSV_FUND_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.COMM_RSV_FUND_DETAIL; //"/Nap/CreditProcess/CommissionReservedFund/DetailX"
  public static NAP_CRD_PRCS_CRD_APPRV_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_APPRV_PAGING; //"/Nap/CreditProcess/CreditApproval/Paging"
  public static NAP_CRD_PRCS_CRD_APPRV_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_APPRV_DETAIL; //"/Nap/CreditProcess/CreditApproval/Detail"
  public static NAP_CRD_PRCS_CRD_APPRV_CFNA_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_APPRV_CFNA_DETAIL; //"/Nap/CreditProcess/CreditApprovalCfna/Detail"
  public static NAP_CRD_PRCS_CRD_APPRV_CR_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_APPRV_CR_PAGING; //"/Nap/CreditProcess/CreditApprovalCr/Paging"
  public static NAP_CRD_PRCS_CRD_APPRV_CR_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.CRD_APPRV_CR_DETAIL; //"/Nap/CreditProcess/CreditApprovalCr/DetailX"
  public static NAP_CRD_PRCS_CRD_APPRV_CFNA_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_APPRV_CFNA_PAGING; //'/Nap/CreditProcess/CreditApprovalCfna/Paging'
  public static NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_INVESTIGATION_PAGING; //"/Nap/CreditProcess/CreditInvestigation/Paging"
  public static NAP_CRD_PRCS_NEW_CRD_INVESTIGATION_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.NEW_CRD_INVESTIGATION_PAGING; //'/Nap/CreditProcess/NewCreditInvestigation/Paging'
  public static NAP_CRD_PRCS_CRD_REVIEW_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_REVIEW_PAGING; //"Nap/CreditProcess/CreditReview/Paging"
  public static NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.CRD_REVIEW_CR_PAGING_X; //"Nap/CreditProcess/CreditReviewCr/PagingX"
  public static NAP_CRD_PRCS_CRD_REVIEW_CR_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.CRD_REVIEW_CR_DETAIL_X; //"Nap/CreditProcess/CreditReviewCr/DetailX"
  public static NAP_CRD_PRCS_CRD_REVIEW_CFNA_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_REVIEW_CFNA_PAGING; //'/Nap/CreditProcess/CreditReviewCfna/Paging'
  public static NAP_CRD_PRCS_CRD_REVIEW_PROTOTYPE_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_REVIEW_PROTOTYPE_PAGING; //'/Nap/CreditProcess/CreditReviewPrototype/Paging'
  public static NAP_CRD_PRCS_CRD_REVIEW_PROTOTYPE_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.CRD_REVIEW_PROTOTYPE_DETAIL; //'/Nap/CreditProcess/CreditReviewPrototype/Detail'
  public static NAP_CRD_PRCS_FRAUD_VERIF_MULTI_ASSET_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.FRAUD_VERIF_MULTI_ASSET_PAGING; //"/Nap/CreditProcess/FraudVerifMultiAsset/Paging"
  public static NAP_CRD_PRCS_FRAUD_DETECTION_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.FRAUD_DETECTION_PAGING; //'/Nap/CreditProcess/FraudDetection/Paging'
  public static NAP_CRD_PRCS_FRAUD_DETECTION_DETAIL = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.FRAUD_DETECTION_DETAIL; //"/Nap/CreditProcess/FraudDetection/Detail"
  public static NAP_CRD_PRCS_PHN_VRF_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.PHN_VRF_PAGING; //"/Nap/CreditProcess/PhoneVerification/Paging"
  public static NAP_CRD_PRCS_PHN_VRF_SUBJECT = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.PHN_VRF_SUBJECT; //"/Nap/CreditProcess/PhoneVerification/Subject"
  public static NAP_CRD_PRCS_PHN_VRF_SUBJECT_VERIF = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.PHN_VRF_SUBJECT_VERIF; //"/Nap/CreditProcess/PhoneVerification/Subject/Verif"
  public static NAP_CRD_PRCS_PHN_VRF_SUBJECT_VIEW = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstant.PHN_VRF_SUBJECT_VIEW; //"/Nap/CreditProcess/PhoneVerification/Subject/View"
  public static NAP_CRD_PRCS_SURVEY_VERIF_PAGING = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.SURVEY_VERIF_PAGING; //"/Nap/CreditProcess/SurveyVerif/PagingX"
  public static NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.SURVEY_VERIF_SUBJECT; //"/Nap/CreditProcess/SurveyVerif/SubjectX"
  public static NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.SURVEY_VERIF_SUBJECT_VERIF; //"/Nap/CreditProcess/SurveyVerif/SubjectX/VerifX"
  public static NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VIEW = "/" + NavigationConstant.NAP_CRD_PRCS_HEADER + "/" + PathConstantX.SURVEY_VERIF_SUBJECT_VIEW; //"/Nap/CreditProcess/SurveyVerif/SubjectX/ViewX"
  //#endregion

  //#region CF2W
  public static CF2W_ADD_FREE = '../' + PathConstant.CF2W_ADD_FREE; //'../AddFree'
  public static CF2W_ADD_FIXED = '../' + PathConstant.CF2W_ADD_FIXED; //'../AddFixed'
  public static NAP_CF2W_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_CF2W; //'Nap/CF2W'
  public static NAP_CF2W_PAGING = "/" + NavigationConstant.NAP_CF2W_HEADER + "/" + PathConstant.PAGING; //'/Nap/CF2W/Paging'
  public static NAP_CF2W_ADD_DETAIL = "/" + NavigationConstant.NAP_CF2W_HEADER + "/" + PathConstant.ADD_DETAIL; //"Nap/CF2W/Add/Detail"
  //#endregion

  //#region DLFN
  public static NAP_DLFN_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_DLFN; //'Nap/DLFN'
  public static NAP_DLFN_PAGING = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstant.PAGING; //"/Nap/DLFN/Paging"
  public static NAP_DLFN_ADD = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstant.ADD; //"/Nap/DLFN/Add"
  public static NAP_DLFN_ADD_DETAIL = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstant.ADD_DETAIL; //"/Nap/DLFN/Add/Detail"
  public static NAP_DLFN_NAP1 = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstantX.NAP1_X; //"/Nap/DLFN/NAP1X"
  public static NAP_DLFN_NAP2 = "/" + NavigationConstant.NAP_DLFN_HEADER + "/" + PathConstantX.NAP2_X; //"/Nap/DLFN/NAP2X"
  //#endregion

  //#region CF4W
  public static NAP_CF4W_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_CF4W; //'Nap/ConsumerFinance'
  public static NAP_CF4W_PAGING = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstant.PAGING; //"/Nap/ConsumerFinance/Paging"
  public static NAP_CF4W_ADD = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstant.ADD; //"Nap/ConsumerFinance/Add"
  public static NAP_CF4W_ADD_DETAIL = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstant.ADD_DETAIL; //"/Nap/ConsumerFinance/Add/Detail"
  public static NAP_CF4W_NAP1 = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstantX.NAP1_X; //"Nap/ConsumerFinance/NAP1X"
  public static NAP_CF4W_NAP2 = "/" + NavigationConstant.NAP_CF4W_HEADER + "/" + PathConstantX.NAP2_X; //"Nap/ConsumerFinance/NAP2"
  //#endregion

  //#region FL4W
  public static NAP_FL4W_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_FL4W; //'Nap/FinanceLeasing'
  public static NAP_FL4W_PAGING = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstant.PAGING; //"/Nap/FinanceLeasing/Paging"
  public static NAP_FL4W_VIEW_DO_DETAIL = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstant.FL4W_VIEW_DO_DETAIL; //'/Nap/FinanceLeasing/ViewDo/Detail'
  public static NAP_FL4W_ADD = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstant.ADD; //"Nap/FinanceLeasing/Add"
  public static NAP_FL4W_ADD_DETAIL = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstant.ADD_DETAIL; //"Nap/FinanceLeasing/Add/Detail"
  public static NAP_FL4W_NAP1 = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstantX.NAP1_X; //"Nap/FinanceLeasing/NAP1X"
  public static NAP_FL4W_NAP2 = "/" + NavigationConstant.NAP_FL4W_HEADER + "/" + PathConstantX.NAP2; //"Nap/FinanceLeasing/NAP2X"
  //#endregion

  //#region CFRFN4W
  public static NAP_CFRFN4W_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_CFRFN4W; //'Nap/CFRefinancing'
  public static NAP_CFRFN4W_PAGING = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstant.PAGING; //"/Nap/CFRefinancing/Paging"
  public static NAP_CFRFN4W_ADD = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstant.ADD; //"Nap/CFRefinancing/Add"
  public static NAP_CFRFN4W_ADD_DETAIL = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstant.ADD_DETAIL; //"Nap/CFRefinancing/Add/Detail"
  public static NAP_CFRFN4W_NAP1 = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstantX.NAP1_X; //"Nap/CFRefinancing/NAP1X"
  public static NAP_CFRFN4W_NAP2 = "/" + NavigationConstant.NAP_CFRFN4W_HEADER + "/" + PathConstant.NAP2; //"Nap/CFRefinancing/NAP2"
  //#endregion

  //#region CFNA
  public static NAP_CFNA_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_CFNA; //'Nap/CFNA'
  public static NAP_CFNA_PAGING = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstant.PAGING; //"/Nap/CFNA/Paging"
  public static NAP_CFNA_ADD = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstant.ADD; //"Nap/CFNA/Add"
  public static NAP_CFNA_ADD_DETAIL = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstant.ADD_DETAIL; //"Nap/CFNA/Add/Detail"
  public static NAP_CFNA_NAP1 = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstantX.NAP1_X; //"Nap/CFNA/NAP1X"
  public static NAP_CFNA_NAP2 = "/" + NavigationConstant.NAP_CFNA_HEADER + "/" + PathConstantX.NAP2_X; //"Nap/CFNA/NAP2X"
  //#endregion

  //#region FCTR
  public static NAP_FCTR_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_FCTR; //'Nap/Factoring'
  public static NAP_FCTR_PAGING = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstant.PAGING; //"/Nap/Factoring/Paging"
  public static NAP_FCTR_ADD = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstant.ADD; //"Nap/Factoring/Add"
  public static NAP_FCTR_ADD_DETAIL = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstant.ADD_DETAIL; //"Nap/Factoring/Add/Detail"
  public static NAP_FCTR_NAP1 = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstantX.NAP1_X; //"Nap/Factoring/NAP1X"
  public static NAP_FCTR_NAP2 = "/" + NavigationConstant.NAP_FCTR_HEADER + "/" + PathConstantX.NAP2_X; //"Nap/Factoring/NAP2X"
  //#endregion

  //#region ROS
  public static NAP_ROS_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_OPL; //'Nap/ROS'
  public static NAP_ROS_PAGING = "/" + NavigationConstant.NAP_ROS_HEADER + "/" + PathConstant.PAGING; //"/Nap/ROS/Paging"
  public static NAP_ROS_ADD = "/" + NavigationConstant.NAP_ROS_HEADER + "/" + PathConstant.ADD; //"Nap/ROS/Add"
  public static NAP_ROS_ADD_DETAIL = "/" + NavigationConstant.NAP_ROS_HEADER + "/" + PathConstant.ADD_DETAIL; //"Nap/ROS/Add/Detail"
  public static NAP_ROS_NAP1 = "/" + NavigationConstant.NAP_ROS_HEADER + "/" + PathConstant.NAP1; //"Nap/ROS/NAP1"
  public static NAP_ROS_NAP2 = "/" + NavigationConstant.NAP_ROS_HEADER + "/" + PathConstant.NAP2; //"Nap/ROS/NAP2"
  //#endregion

  //#region Sharing
  public static NAP_SHARING_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_SHARING; //'Nap/Sharing'
  public static NAP_SHARING_FROM_MOU_PAGING = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP_FROM_MOU_PAGING; //"/Nap/Sharing/NapFromMou/Paging"
  public static NAP_SHARING_FROM_MOU_DETAIL = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP_FROM_MOU_DETAIL; //"/Nap/Sharing/NapFromMou/Detail"
  public static NAP_SHARING_FROM_LEAD_PAGING = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP_FROM_LEAD_PAGING; //"/Nap/Sharing/NapFromLead/Paging"
  public static NAP_SHARING_FROM_LEAD_DETAIL = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP_FROM_LEAD_DETAIL; //"/Nap/Sharing/NapFromLead/Detail"
  public static NAP_SHARING_FROM_SIMPLE_LEAD_PAGING = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP_SIMPLE_LEAD_PAGING; //"/Nap/Sharing/NapFromSimpleLead/Paging"
  public static NAP_SHARING_FROM_SIMPLE_LEAD_DETAIL = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstantX.NAP_SIMPLE_LEAD_DETAIL_X; //"/Nap/Sharing/NapFromSimpleLead/DetailX"
  public static NAP1_SHARING_FROM_LEAD_PAGING = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP1_FROM_LEAD_PAGING; //"/Nap/Sharing/Nap1FromLead/Paging"
  public static NAP1_SHARING_FROM_LEAD_DETAIL = "/" + NavigationConstant.NAP_SHARING_HEADER + "/" + PathConstant.NAP1_FROM_LEAD_DETAIL; //"/Nap/Sharing/Nap1FromLead/Detail"
  //#endregion

  //#region NAP-VIEW
  public static VIEW_APP = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_APP + "/" + PathConstantX.X; //'/View/AppView/X'
  public static BACK_VIEW_APP = NavigationConstant.VIEW_APP; //'/View/AppView/X'
  public static VIEW_APP_ASSET = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_APP_ASSET; //'/View/AppAsset'
  public static VIEW_AGRMNT = "/" + PathConstant.VIEW + "/" + PathConstantX.VIEW_AGRMNT_X; //"/View/AgrmntView/X"
  public static VIEW_CUST_EXPSR = "/" + PathConstant.VIEW + "/" + PathConstantX.VIEW_CUST_EXPSR_X; //"/View/CustExposureView/X"
  public static VIEW_LEAD = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_LEAD; //"/View/Lead"
  public static VIEW_MOU_CUST = "/" + PathConstant.VIEW + "/" + PathConstantX.VIEW_MOU_CUST_X; //"/View/Mou/CustView/X"
  public static VIEW_CHANGE_MOU = "/" + PathConstant.VIEW + "/" + PathConstantX.VIEW_CHANGE_MOU_X; //"/View/ChangeMouView/X"
  public static VIEW_PHN_VERIF = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_PHN_VERIF; //"/View/PhoneVerifView"
  public static VIEW_SRVY = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_SRVY; //'/View/SurveyView'
  //#endregion

  //#region FOU-VIEW
  public static VIEW_FOU_CUST_PERSONAL_DETAIL = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_FOU_CUST_PERSONAL_DETAIL; //'/View/Customer/PersonalDetail'
  public static VIEW_FOU_CUST_COY_DETAIL = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_FOU_CUST_COY_DETAIL; //'/View/Customer/CoyDetail'
  public static VIEW_FOU_CUST_TRUST_SOC = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_FOU_CUST_TRUST_SOC; //'/View/Customer/CustTrustSoc'
  public static VIEW_FOU_SRVY_ORDER = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_FOU_SRVY_ORDER; //'/View/Survey/SurveyOrder'
  public static VIEW_FOU_SRVY_TASK = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_FOU_SRVY_TASK; //'/View/Survey/SurveyTask'
  public static VIEW_FOU_VENDOR_BRANCH = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_FOU_VENDOR_BRANCH; //'/View/Vendor/VendorBranch'
  //#endregion

  //#region MOU
  public static MOU_CUST_CANCEL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_CANCEL; //'/Mou/Cust/Cancel'
  public static MOU_CUST_CANCEL_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_CANCEL_DETAIL; //'/Mou/Cust/Cancel/Detail'
  public static MOU_CUST_INQUIRY = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_INQUIRY_X; //'/Mou/Cust/InquiryX'
  public static MOU_CUST_DOC_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_DOC_PAGING; //'/Mou/CustomerDoc/Paging'
  public static MOU_CUST_DOC_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_DOC_DETAIL; //'/Mou/CustomerDoc/Detail'
  public static MOU_DOC_SIGNER_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DOC_SIGNER_PAGING; //'/Mou/DocSigner/Paging'
  public static MOU_DOC_SIGNER_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DOC_SIGNER_DETAIL; //'/Mou/DocSigner/Detail'
  public static MOU_CUST_LEGAL_RVW_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_LEGAL_RVW_PAGING; //'/Mou/CustomerLegalReview/Paging'
  public static MOU_CUST_LEGAL_RVW_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_LEGAL_RVW_DETAIL_X; //'/Mou/CustomerLegalReview/DetailX'
  public static MOU_CUST_RVW_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_RVW_PAGING; //'/Mou/Cust/ReviewPaging'
  public static MOU_CUST_RVW_FCTR = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_RVW_FCTR_X; //'/Mou/Cust/ReviewFactoringX'
  public static MOU_CUST_RVW_GENERAL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_RVW_GENERAL_X; //'/Mou/Cust/ReviewGeneralX'
  public static MOU_CUST_APPRV_FCTR = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_APPRV_FCTR_X; //'/Mou/Cust/ApprovalFactoringX'
  public static MOU_CUST_RVW_DFLN = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_RVW_DFLN_X; //'/Mou/Cust/ReviewDLFNX'
  public static MOU_CUST_APPRV_GENERAL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_CUST_APPRV_GENERAL_X; //'/Mou/Cust/ApprovalGeneralX'
  public static MOU_REQ_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_REQ_PAGING_X; //"/Mou/Request/PagingX"
  public static MOU_REQ_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_REQ_DETAIL_X; //'/Mou/Request/DetailX'
  public static MOU_CUST_APPRV = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_APPRV; //"/Mou/Cust/Approval"
  public static MOU_EDIT_CUST_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_EDIT_CUST_PAGING; //"/Mou/EditMouCustomer/Paging"
  public static MOU_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.DETAIL_X; //"/Mou/DetailX"
  public static MOU_DUP_CHECK_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DUP_CHECK_PAGING; //"/Mou/DuplicateCheck/Paging"
  public static MOU_DUP_CHECK_SIMILAR_PERSONAL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DUP_CHECK_SIMILAR_PERSONAL; //"/Mou/DuplicateCheck/SimilarPersonal"
  public static MOU_DUP_CHECK_EXIST_PERSONAL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DUP_CHECK_EXIST_PERSONAL; //"/Mou/DuplicateCheck/ExistingPersonal"
  public static MOU_DUP_CHECK_SIMILAR_COY = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DUP_CHECK_SIMILAR_COY; //"/Mou/DuplicateCheck/SimilarCompany"
  public static MOU_DUP_CHECK_EXIST_COY = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_DUP_CHECK_EXIST_COY; //"/Mou/DuplicateCheck/ExistingCompany"
  public static MOU_EXECUTION_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_EXECUTION_PAGING_X; //"/Mou/Execution/PagingX"
  public static MOU_EXECUTION_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.MOU_EXECUTION_DETAIL_X; //"/Mou/Execution/DetailX"
  public static MOU_CUST_OUTSTANDING_TC_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_OUTSTANDING_TC_PAGING; //"/Mou/Cust/OutstandingTC/Paging"
  public static MOU_CUST_OUTSTANDING_TC_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_CUST_OUTSTANDING_TC_DETAIL; //"/Mou/Cust/OutstandingTC/Detail"
  //#endregion

  //#region MOU FREEZE
  public static MOU_FREEZE_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_FREEZE_PAGING; //"/Mou/FreezeUnfreeze/Paging"
  public static MOU_FREEZE_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_FREEZE_DETAIL; //"/Mou/FreezeUnfreeze/Detail"
  public static MOU_FREEZE_INQUIRY = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_FREEZE_INQUIRY; //"/Mou/FreezeUnfreeze/Inquiry"
  public static MOU_FREEZE_VIEW = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_FREEZE_VIEW; //"/Mou/FreezeUnfreeze/View"
  public static MOU_FREEZE_APV_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_FREEZE_APV_PAGING; //"/Mou/FreezeUnfreezeApv/Paging"
  public static MOU_FREEZE_APV_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.MOU_FREEZE_APV_DETAIL; //"/Mou/FreezeUnfreezeApv/Detail"
  //#endregion

  //#region CHANGE MOU
  public static CHANGE_MOU_REQ_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_REQ_PAGING_X; //"/Mou/ChangeMouRequest/PagingX"
  public static CHANGE_MOU_REQ_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_REQ_DETAIL_X; //"/Mou/ChangeMouRequest/DetailX"
  public static CHANGE_MOU_REQ_DETAIL_CUSTOMER = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_REQ_DETAIL_CUST_X; //"/Mou/ChangeMouRequest/Detail/CustomerX"
  public static CHANGE_MOU_RVW_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_RVW_PAGING_X; //"/Mou/ChangeMou/ReviewPagingX"
  public static CHANGE_MOU_RVW_DETAIL_FCTR = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_RVW_DETAIL_FCTR_X; //"/Mou/ChangeMou/ReviewDetailFctrX"
  public static CHANGE_MOU_RVW_DETAIL_FIN = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_RVW_DETAIL_FIN_X; //"/Mou/ChangeMou/ReviewFinancingX"
  public static CHANGE_MOU_RVW_DETAIL_GEN = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_RVW_DETAIL_GEN_X; //"/Mou/ChangeMou/ReviewDetailGenX"
  public static CHANGE_MOU_APV_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.CHANGE_MOU_APV_PAGING; //"/Mou/ChangeMou/ApvPaging"
  public static CHANGE_MOU_APV_DETAIL_GEN = "/" + PathConstant.LR_MOU + "/" + PathConstant.CHANGE_MOU_APV_DETAIL_GEN; //"/Mou/ChangeMou/ApvDetailGen"
  public static CHANGE_MOU_APV_DETAIL_FCTR = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_APV_DETAIL_FCTR_X; //"/Mou/ChangeMou/ApvDetailFctrX"
  public static CHANGE_MOU_APV_DETAIL_FIN = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_APV_DETAIL_FIN_X; //"/Mou/ChangeMou/ApvDetailFinancingX"
  public static CHANGE_MOU_EXEC_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.CHANGE_MOU_EXEC_PAGING; //"/Mou/ChangeMou/ExecPaging"
  public static CHANGE_MOU_EXEC_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_EXEC_DETAIL_X; //"/Mou/ChangeMou/ExecDetailX"
  public static CHANGE_MOU_CANCEL = "/" + PathConstant.LR_MOU + "/" + PathConstant.CHANGE_MOU_CANCEL; //"/Mou/ChangeMou/Cancel"
  public static CHANGE_MOU_RTN_PAGING = "/" + PathConstant.LR_MOU + "/" + PathConstant.CHANGE_MOU_RTN_PAGING; //"/Mou/ChangeMou/ReturnPaging"
  public static CHANGE_MOU_RTN_DETAIL = "/" + PathConstant.LR_MOU + "/" + PathConstant.CHANGE_MOU_RTN_DETAIL; //"/Mou/ChangeMou/ReturnDetail"
  public static CHANGE_MOU_REQ_ADD_COLL = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_REQ_ADD_COLL_X; //"/Mou/ChangeMou/RequestAddColl"
  public static CHANGE_MOU_INQUIRY = "/" + PathConstant.LR_MOU + "/" + PathConstantX.CHANGE_MOU_INQUIRY_X; //"/Mou/ChangeMou/InquiryX"
  //#endregion

  //#region LEAD
  public static LEAD_CANCEL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.CANCEL; //'/Lead/Cancel'
  public static LEAD_INQUIRY = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_INQUIRY; //'/Lead/LeadInquiry'
  public static LEAD_INPUT_MAIN_INFO = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_INPUT_MAIN_INFO; //'/Lead/LeadInput/MainInfo'
  public static LEAD_RVW_MONITORING_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_RVW_MONITORING_PAGING; //'/Lead/ReviewMonitoring/Paging'
  public static LEAD_RVW_MONITORING_DETAIL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_RVW_MONITORING_DETAIL; //'/Lead/ReviewMonitoring/Detail'
  public static LEAD_TELE_VERIF_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_TELE_VERIF_PAGING; //'/Lead/TeleVerif/Paging'
  public static LEAD_TELE_VERIF_DETAIL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_TELE_VERIF_DETAIL; //'/Lead/TeleVerif/Detail'
  public static LEAD_FRAUD_VERIF_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_FRAUD_VERIF_PAGING; //"/Lead/FraudVerif/Paging"
  public static LEAD_FRAUD_VERIF_PAGE = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_FRAUD_VERIF_PAGE; //"/Lead/FraudVerif/Page"
  public static LEAD_CONFIRM_CANCEL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_CONFIRM_CANCEL; //"/Lead/ConfirmCancel"
  public static LEAD_UPDATE_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_UPDATE_PAGING; //"Lead/LeadUpdate/Paging"
  public static LEAD_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_PAGING; //"/Lead/Lead/Paging"
  public static LEAD_INPUT_PAGE = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_INPUT_PAGE; //"/Lead/LeadInput/Page"
  public static LEAD_VERIF = "/" + PathConstant.LR_LEAD + "/" + PathConstant.VERIF; //'/Lead/Verif'
  public static LEAD_UPLOAD = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_MONITORING; //'/Lead/Monitoring'
  public static LEAD_REVIEW_MONITORING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.LEAD_RVW_MONITORING_PAGING; //'/Lead/ReviewMonitoring/Paging'
  public static SIMPLE_LEAD_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_PAGING; //'/Lead/SimpleLead/Paging'
  public static SIMPLE_LEAD_DETAIL = "/" + PathConstant.LR_LEAD + "/" + PathConstantX.SIMPLE_LEAD_DETAIL; //'/Lead/SimpleLead/DetailX'
  public static SIMPLE_LEAD_MAIN_INFO = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_MAIN_INFO; //'/Lead/SimpleLead/MainInfo'
  public static SIMPLE_LEAD_FRAUD_VERIF_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_FRAUD_VERIF_PAGING; //'/Lead/SimpleLeadFraudVerif/Paging'
  public static SIMPLE_LEAD_FRAUD_VERIF_DETAIL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_FRAUD_VERIF_DETAIL; //'/Lead/SimpleLeadFraudVerif/Detail'
  public static SIMPLE_LEAD_RVW_MONITORING_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_RVW_MONITORING_PAGING; //'/Lead/SimpleLead/ReviewMonitoring/Paging'
  public static SIMPLE_LEAD_UPD_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_UPD_PAGING; //'/Lead/SimpleLead/Cancel'
  public static SIMPLE_LEAD_CANCEL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.SIMPLE_LEAD_CANCEL_PAGING; //'/Lead/Cancel'
  public static LEAD_POTENTIAL_RO_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_PAGING; //'/Lead/PotentialRo/Paging'
  public static LEAD_POTENTIAL_RO_EXEC = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_EXEC; //'/Lead/PotentialRo/Execution'
  public static LEAD_POTENTIAL_RO_INQUIRY = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_INQUIRY; //'/Lead/PotentialRo/Inquiry'
  public static LEAD_POTENTIAL_RO_VIEW = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_VIEW; //'/Lead/PotentialRo/View'
  public static LEAD_POTENTIAL_RO_TEL_OFFER_PAGING = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_TEL_OFFER_PAGING; //'/Lead/PotentialRo/RoTelemkOffer/Paging'
  public static LEAD_POTENTIAL_RO_TEL_OFFER_DETAIL = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_TEL_OFFER_DETAIL; //'/Lead/PotentialRo/RoTelemkOffer/Detail'
  public static LEAD_POTENTIAL_RO_TEL_OFFER_VERIF = "/" + PathConstant.LR_LEAD + "/" + PathConstant.POTENTIAL_RO_TEL_OFFER_VERIF; //'/Lead/PotentialRo/RoTelemkOffer/Verif'


  //#endregion

  //#region LTKM
  public static LTKM_REQ = "/" + PathConstant.LR_LTKM + "/" + PathConstantX.REQ_X; //'/Ltkm/RequestX'
  public static LTKM_INQUIRY = "/" + PathConstant.LR_LTKM + "/" + PathConstant.INQUIRY; //'/Ltkm/Inquiry'
  public static LTKM_VIEW = "/" + PathConstant.LR_LTKM + "/" + PathConstant.VIEW; //'/Ltkm/View'
  public static LTKM_VERIFY_PAGING = "/" + PathConstant.LR_LTKM + "/" + PathConstant.VERIFY_PAGING; //'/Ltkm/Verify/Paging'
  public static LTKM_VERIFY_DETAIL = "/" + PathConstant.LR_LTKM + "/" + PathConstant.VERIFY_DETAIL; //'/Ltkm/Verify/Detail'
  public static LTKM_VERIFY_APV_PAGING = "/" + PathConstant.LR_LTKM + "/" + PathConstant.VERIFY_APV_PAGING; //'/Ltkm/VerifyApproval/Paging'
  public static LTKM_VERIFY_APV_DETAIL = "/" + PathConstant.LR_LTKM + "/" + PathConstant.VERIFY_APV_DETAIL; //'/Ltkm/VerifyApproval/Detail'
  public static LTKM_RTN_HANDLING_PAGING = "/" + PathConstant.LR_LTKM + "/" + PathConstant.RTN_HANDLING_PAGING; //'/Ltkm/ReturnHandling/Paging'
  public static LTKM_RTN_HANDLING_DETAIL = "/" + PathConstant.LR_LTKM + "/" + PathConstant.RTN_HANDLING_DETAIL; //'/Ltkm/ReturnHandling/Detail'
  //#endregion

  //#region Task Reassignment
  public static TASK_REASSIGN_PAGING = "/" + PathConstant.LR_TASK_REASSIGN + "/" + PathConstant.PAGING; //'/TaskReassignment/Paging'
  public static TASK_REASSIGN_DETAIL = "/" + PathConstant.LR_TASK_REASSIGN + "/" + PathConstant.DETAIL; //'/TaskReassignment/Detail'
  public static TASK_REASSIGN_VIEW = "/" + PathConstant.LR_TASK_REASSIGN + "/" + PathConstant.VIEW; //'/TaskReassignment/View'
  public static TASK_REASSIGN_INQUIRY = "/" + PathConstant.LR_TASK_REASSIGN + "/" + PathConstant.INQUIRY; //'/TaskReassignment/Inquiry'
  public static TASK_REASSIGN_APV_PAGING = "/" + PathConstant.LR_TASK_REASSIGN + "/" + PathConstant.TASK_REASSIGN_APV_PAGING; //'/TaskReassignment/TaskReassignmentApproval/Paging'
  public static TASK_REASSIGN_APV_DETAIL = "/" + PathConstant.LR_TASK_REASSIGN + "/" + PathConstant.TASK_REASSIGN_APV_DETAIL; //'/TaskReassignment/TaskReassignmentApproval/Detail'
  //#endregion

  //Application Process
  public static NAP_APP_PRCS_HEADER = PathConstant.LR_NAP + "/" + PathConstant.NAP_APP_PRCS; //'Nap/ApplicationProcess'
  public static NAP_APP_PRCS_CRD_APPRV_PAGING = "/" + NavigationConstant.NAP_APP_PRCS_HEADER + "/" + PathConstant.APP_APPRV_PAGING; //"/Nap/ApplicationProcess/ApplicationApproval/Paging"
  public static NAP_APP_PRCS_CRD_APPRV_DETAIL = "/" + NavigationConstant.NAP_APP_PRCS_HEADER + "/" + PathConstant.APP_APPRV_DETAIL; //"/Nap/ApplicationProcess/ApplicationApproval/Detail"
  public static NAP_APP_PRCS_CRD_RVW_PAGING = "/" + NavigationConstant.NAP_APP_PRCS_HEADER + "/" + PathConstant.APP_RVW_PAGING; //"/Nap/ApplicationProcess/ApplicationReview/Paging"
  public static NAP_APP_PRCS_CRD_RVW_DETAIL = "/" + NavigationConstant.NAP_APP_PRCS_HEADER + "/" + PathConstant.APP_RVW_DETAIL; //"/Nap/ApplicationProcess/ApplicationReview/Detail"
  //end

  //#region REQUISITION DECISION
  public static REQUISITION_DECISION_PAGING = "/" + PathConstant.REQUISITION_DECISION + "/" + PathConstant.PAGING_LOWERCASE; //'/requisitiondecision/paging'
  public static REQUISITION_DECISION_DETAIL = "/" + PathConstant.REQUISITION_DECISION + "/" + PathConstant.DETAIL_LOWERCASE; //'/requisitiondecision/detail'
  //#endregion

  //#region UNAUTHORIZED
  public static UNAUTHORIZE_PAGE = "/" + PathConstant.UNAUTHORIZED; //"/Unauthorized"
  //#endregion

  //PRODUCT
  public static VIEW_PRODUCT_HO = "/" + PathConstant.CR_VIEW + "/" + PathConstant.VIEW_PRODUCT_HO; //'/View/ProductHO'
  public static VIEW_OFFERING = "/" + PathConstant.CR_VIEW + "/" + PathConstant.VIEW_OFFERING; //'/View/Offering'
  public static PRODUCT_OFFERING_DEACTIVATE = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_DEACTIVATE; //'/Product/OfferingDeactivate'
  public static PRODUCT_OFFERING_DEACTIVATE_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_DEACTIVATE_EDIT; //'/Product/OfferingDeactivate
  public static PRODUCT_OFFERING_REVIEW = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_REVIEW; //'/Product/OfferingReview'
  public static PRODUCT_OFFERING_REVIEW_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_REVIEW_DETAIL; //'/Product/OfferingReview/Detail'
  public static PRODUCT_OFFERING_APPRV = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_APPRV; //'/Product/OfferingApproval'
  public static PRODUCT_OFFERING_APPRV_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_APPRV_DETAIL; //'/Product/OfferingApproval/Detail'
  public static PRODUCT_OFFERING_DEACTIVATE_APPRV = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_DEACTIVATE_APPRV; //'/Product/OfferingDeactivateApproval'
  public static PRODUCT_OFFERING_DEACTIVATE_APPRV_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.OFFERING_DEACTIVATE_APPRV_DETAIL; //'/Product/OfferingDeactivateApproval/Detail'
  public static PRODUCT_HO_DEACTIVATE = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_DEACTIVATE; //'/Product/HODeactivate'
  public static PRODUCT_HO_DEACTIVATE_APPRV = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_DEACTIVATE_APPRV; //'/Product/HODeactivateApproval'
  public static PRODUCT_HO_DEACTIVATE_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_DEACTIVATE_EDIT; //'/Product/HODeactivate/Detail'
  public static PRODUCT_HO_DEACTIVATE_APPRV_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_DEACTIVATE_APPRV_DETAIL; //'/Product/HODeactivateApproval/Detail'
  public static PRODUCT_HO_ADD = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_ADD; //'/Product/HOAdd'
  public static PRODUCT_HO_ADD_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_ADD_DETAIL; //'/Product/HOAddDetail'
  public static PRODUCT_HO_RTN_PAGING = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_RTN_PAGING; //'/Product/HOReturnPaging'
  public static PRODUCT_HO_PAGING = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_PAGING; //'/Product/HOPaging'
  public static PRODUCT_HO_APPRV = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_APPRV; //'/Product/HOApproval'
  public static PRODUCT_HO_APPRV_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_APPRV_DETAIL; //'/Product/HOApproval/Detail'
  public static PRODUCT_HO_REVIEW = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_REVIEW; //'/Product/HOReview'
  public static PRODUCT_HO_REVIEW_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.HO_REVIEW_DETAIL; //'/Product/HOReview/Detail'
  public static PROD_OFFERING_PAGING = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.PROD_OFFERING_PAGING; //'/Product/ProdOffering/Paging'
  public static PROD_OFFERING_ADD = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.PROD_OFFERING_ADD; //'/Product/ProdOffering/add'
  public static PROD_OFFERING_ADD_DETAIL = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.PROD_OFFERING_ADD_DETAIL; //'/Product/ProdOffering/AddDetail'
  public static PROD_OFFERING_RTN_PAGING = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.PROD_OFFERING_RTN_PAGING; //'/Product/ProdOffering/ReturnPaging'
  public static PROD_HO_UNAUTHORIZED = "/" + PathConstant.LR_PRODUCT + "/" + PathConstant.UNAUTHORIZED; //'/Product/Unauthorized'

  //#region TRIAL
  public static TRIAL_CALC = "/" + PathConstant.LR_TRIAL_CALC + "/" + PathConstantX.TRIAL_CALC_X; //'/TrialCalculation/Trial-Calculation'

  //#region Pefindo View
  public static PEFINDO_VIEW = "/" + PathConstant.VIEW + "/" + PathConstant.VIEW_PEFINDO + "/" + PathConstant.PEFINDO_VIEW;
  //#endregion

  //Setting
  public static SETTING_APP_SOURCE_PAGING = "/" + PathConstant.SETTING + "/" + PathConstant.APP_SRC_PAGING; //'/Setting/AppSource/Paging'
  //EndSettings

  //Cessie
  public static CESSIE_MONITORING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_MONITORING; //'/Impl/Cessie/Monitoring'
  public static CESSIE_FACTORING_REVIEW_PAGING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.FACTORING_REVIEW_PAGING; //'/Impl/Cessie/Monitoring'
  public static CESSIE_FACTORING_REVIEW_ASSIGN_PROD = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.FACTORING_REVIEW_ASSIGN_PROD; //'/Impl/Cessie/Process/FactoringReview/AssignProd'
  public static CESSIE_FACTORING_REVIEW_DETAIL = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.FACTORING_REVIEW_DETAIL; //'/Impl/Cessie/Process/FactoringReview/Detail'
  public static CESSIE_PGL_PAGING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_PGL_PAGING; //'/Impl/Cessie/Process/PreGoLive/Paging'
  public static CESSIE_PGL_DETAIL = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_PGL_DETAIL; //'/Impl/Cessie/Process/PreGoLive/Detail'
  public static CESSIE_PGL_APPRVL_PAGING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_PGL_APPRVL_PAGING; //'/Impl/Cessie/Process/PreGoLive/Approval/Paging'
  public static CESSIE_PGL_APPRVL_DETAIL = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_PGL_APPRVL_DETAIL; //'/Impl/Cessie/Process/PreGoLive/Approval/Detail'
  public static CESSIE_CANCEL_PAGING = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_CANCEL_PAGING; //'/Impl/Cessie/CessieCancellation/Paging'
  public static CESSIE_CANCEL_DETAIL = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_CANCEL_DETAIL; //'/Impl/Cessie/CessieCancellation/Detail'
  public static CESSIE_INQUIRY = "/" + PathConstantX.LR_IMPL + "/" + PathConstantX.CESSIE_INQUIRY; //'/Impl/Cessie/Inquiry'
  public static VIEW_CESSIE = "/" + PathConstant.VIEW + "/" + PathConstantX.VIEW_CESSIE; //"/View/Cessie"

  //#region Report
  public static REPORT_PLAFOND_MOU_SUMMARY = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_PLAFOND_MOU_SUMMARY; //'/Report/RptPlafondMouSummary'
  public static REPORT_PLAFOND_MOU_DETAIL = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_PLAFOND_MOU_DETAIL; //'/Report/RptPlafondMouDetail'
  public static REPORT_COLLATERAL_MOU = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_COLLATERAL_MOU; //'/Report/RptCollateralMou'
  public static REPORT_DAILY_INCOMING_APP = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_DAILY_INCOMING_APP; //'/Report/RptDailyIncomingApp'
  public static REPORT_CANCEL_LEAD = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_CANCEL_LEAD; //'/Report/RptCancelLead'
  public static REPORT_DAILY_INCOMING_LEAD = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_DAILY_INCOMING_LEAD; //'/Report/RptDailyIncomingLead'
  public static REPORT_DAILY_PRE_GO_LIVE_BY_PRODUCT = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_DAILY_PRE_GO_LIVE_BY_PRODUCT; //'/Report/RptDailyPreGoLiveByProduct'
  public static REPORT_DAILY_PRE_GO_LIVE_BY_CMO = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_DAILY_PRE_GO_LIVE_BY_CMO; //'/Report/RptDailyPreGoLiveByCMO'
  public static REPORT_MONTHLY_INPROCESS_APP = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_INPROCESS_APP; //'/Report/RptMonthlyInProcessApp'
  public static REPORT_DAILY_PENDING_APP_AFT_APV = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_DAILY_PENDING_APP_AFT_APV; //'/Report/RptDailyPendingAppAftApv'
  public static REPORT_MONTHLY_PENDING_LEAD = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_PENDING_LEAD; //'/Report/RptMonthlyPendingLead'
  public static REPORT_MONTHLY_PRE_GO_LIVE_BY_CMO = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_PRE_GO_LIVE_BY_CMO; //'/Report/RptMonthlyPreGoLiveByCMO'
  public static REPORT_MONTHLY_PRE_GO_LIVE_BY_PRODUCT = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_PRE_GO_LIVE_BY_PRODUCT; //'/Report/RptMonthlyPreGoLiveByProduct'
  public static REPORT_MONTHLY_PENDING_PRE_GO_LIVE_AFT_APV = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_PENDING_PRE_GO_LIVE_AFT_APV; //'/Report/RptMonthlyPendingLead'
  public static REPORT_MONTHLY_PRE_GO_LIVE_BY_SUPPLIER = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_PRE_GO_LIVE_BY_SUPPLIER; //'/Report/RptMonthlyPreGoLiveBySupplier'
  public static REPORT_MONTHLY_TOP_SUPPLIER = "/" + PathConstant.REPORT + "/" + PathConstant.REPORT_MONTHLY_TOP_SUPPLIER; //'/Report/RptMonthlyTopSupplier'
  //#endregion

  //EndCessie

  //Approval X
  public static END_DT_GO_LIVE_APV_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.END_DATE_GO_LIVE_APV_PAGING_X; //'/AdminProcess/EndDtGoLiveApvX/PagingX'
  public static END_DT_GO_LIVE_APV_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.END_DATE_GO_LIVE_APV_DETAIL_X; //'/AdminProcess/EndDtGoLiveApvX/DetailX'
  public static GO_LIVE_APV_PAGING = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.GO_LIVE_APV_PAGING_X; //'/AdminProcess/GoLiveX/PagingX'
  public static GO_LIVE_APV_DETAIL = "/" + NavigationConstant.NAP_ADM_PRCS_HEADER + "/" + PathConstantX.GO_LIVE_APV_DETAIL_X; //'/AdminProcess/GoLiveX/DetailX'
  //EndCessie
}

import { PathConstant } from "./PathConstant";

export class NavigationConstant {

    public static PAGES_LOGIN = PathConstant.CombinePath([PathConstant.CONTENT_ROUTES_PAGES, PathConstant.CONTENT_PAGE_LOGIN]); //'pages/login'
    public static PAGES_CONTENT = PathConstant.CombinePath([PathConstant.CONTENT_ROUTES_PAGES, PathConstant.CONTENT_PAGE]); //'pages/content'
    public static DASHBOARD = "/" + PathConstant.CombinePath([PathConstant.LR_DASHBOARD, PathConstant.DASHBOARD]); //'/dashboard/dash-board'
    public static BACK_TO_REQ_PASSWORD = PathConstant.CombinePath(['..', PathConstant.CONTENT_PAGE_REQ_PASSWORD]); //'../RequestPassword'
    public static BACK_TO_PAGING = PathConstant.CombinePath(['..', PathConstant.PAGING]); //'../Paging'
    public static BACK_TO_PAGING2 = PathConstant.CombinePath(['..', '..', PathConstant.PAGING]); //'../../Paging'
    public static BACK_TO_DETAIL = PathConstant.CombinePath(['..', PathConstant.DETAIL]); //'../Detail'
    public static BACK_TO_DETAIL_COY = PathConstant.CombinePath(['..', PathConstant.DETAIL, PathConstant.COY]); //'../Detail/Company'
    public static BACK_TO_DETAIL_PERSONAL = PathConstant.CombinePath(['..', PathConstant.DETAIL, PathConstant.PERSONAL]); //'../Detail/Personal'
    public static BACK_TO_MAIN = PathConstant.CombinePath(['..', PathConstant.MAIN]); //'../Main'
    public static BACK_TO_SUBJECT = PathConstant.CombinePath(['..', PathConstant.SUBJECT]); //'../Subject'
    public static BACK_TO_VIEW = PathConstant.CombinePath(['..', '..', PathConstant.VIEW]); //'../../View'
    public static CONTENT_PAGE_SELF_VERIF = PathConstant.CombinePath([PathConstant.PAGES, PathConstant.CONTENT_PAGE_SELF_VERIF]); //"/pages/SelfVerification"
    public static FORMS_REPORT = "/" + PathConstant.CombinePath([PathConstant.LR_FORMS, PathConstant.REPORT]); //'/forms/Report'
    public static INTEGRATION_LOS_ERR_DATA_MONITORING = "/" + PathConstant.CombinePath([PathConstant.LR_INTEGRATION, PathConstant.LOS_ERR_DATA_MONITORING]); //'/Integration/LosErrorDataMonitoring'
    
    //#region Inquiry
    public static APP_INQUIRY = "/" + PathConstant.CombinePath([PathConstant.LR_INQUIRY, PathConstant.APP_INQUIRY]); //'/Inquiry/AppInquiry'
    public static PURCHASE_TRACKING_INQUIRY = "/" + PathConstant.CombinePath([PathConstant.LR_INQUIRY, PathConstant.PURCHASE_TRACKING_INQUIRY]); //'/Inquiry/PurchaseTrackingInquiry'
    //#endregion

    //#region NAP
    public static NAP_VIEW_ASSET = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_VIEW_ASSET]); //"/Nap/ViewAsset"
    
    //#region MainData
    public static NAP_MAIN_DATA_NAP1_PAGING = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_MAIN_DATA, PathConstant.NAP1_PAGING]); //"/Nap/MainData/NAP1/Paging"
    public static NAP_MAIN_DATA_NAP1_ADD = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_MAIN_DATA, PathConstant.NAP1_ADD]); //"/Nap/MainData/NAP1/Add"
    public static NAP_MAIN_DATA_NAP2_PAGING = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_MAIN_DATA, PathConstant.NAP2_PAGING]); //"/Nap/MainData/NAP2/Paging"
    //#endregion

    //#region CustCompletion
    public static NAP_CUST_COMPL_PAGING = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CUST_COMPL, PathConstant.PAGING]); //"Nap/CustCompletion/Paging"
    public static NAP_CUST_COMPL_DETAIL = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CUST_COMPL, PathConstant.DETAIL]); //"Nap/CustCompletion/Detail"
    //#endregion

    //#region AddProcess
    public static NAP_ADD_PRCS_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_ADD_PRCS]); //'Nap/AddProcess'
    public static NAP_ADD_PRCS_APP_DUP_CHECK_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_PAGING]); //"/Nap/AddProcess/AppDupCheck/Paging"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_COY = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_APP_EXIST_DATA_COY]); //"/Nap/AddProcess/AppDupCheck/ApplicantExistingData/Company"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL]); //"/Nap/AddProcess/AppDupCheck/ApplicantExistingData/Personal"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_PERSONAL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_PERSONAL]); //"/Nap/AddProcess/AppDupCheck/Personal"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_COY = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_COY]); //"/Nap/AddProcess/AppDupCheck/Company"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_MAIN_DATA_PAGING]); //"/Nap/AddProcess/AppDupCheckMainData/Paging"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST]); //"/Nap/AddProcess/AppDupCheckMainData/SubjList"
    public static NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH]); //"/Nap/AddProcess/AppDupCheckMainData/SubjMatch"
    public static NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.CRD_APPRVL_RES_EXT_PAGING]); //"/Nap/AddProcess/CreditApprovalResultExt/Paging"
    public static NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.CRD_APPRVL_RES_EXT_DETAIL]); //"/Nap/AddProcess/CreditApprovalResultExt/Detail"
    public static NAP_ADD_PRCS_COPY_CANCEL_APP = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.COPY_CANCEL_APP]); //'/Nap/AddProcess/CopyCancelledApplication'
    public static NAP_ADD_PRCS_OUTSTANDING_TC_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.OUTSTANDING_TC_PAGING]); //"/Nap/AddProcess/OutstandingTC/Paging"
    public static NAP_ADD_PRCS_OUTSTANDING_TC_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.OUTSTANDING_TC_DETAIL]); //"/Nap/AddProcess/OutstandingTC/Detail"
    public static NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_ADD_TC_PAGING]); //'/Nap/AddProcess/ReturnHandlingAddTc/Paging'
    public static NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_ADD_TC_DETAIL]); //'/Nap/AddProcess/ReturnHandlingAddTc/Detail'
    public static NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_COLL_PAGING]); //'/Nap/AddProcess/ReturnHandlingCollateral/Paging'
    public static NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_COLL_EDIT]); //'/Nap/AddProcess/ReturnHandlingCollateral/Edit'
    public static NAP_ADD_PRCS_RETURN_HANDLING_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_PAGING]); //'/Nap/AddProcess/ReturnHandling/Paging'
    public static NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_EDIT_APP_PAGING]); //'Nap/AddProcess/ReturnHandling/EditAppPaging'
    public static NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_COMM_RSV_FUND_PAGING]); //"/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging"
    public static NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_PHN_VRF_PAGING]); //"/Nap/AddProcess/ReturnHandlingPhoneVerif/Paging"
    public static NAP_ADD_PRCS_RETURN_HANDLING_SRVY = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADD_PRCS_HEADER, PathConstant.RETURN_HANDLING_SRVY]); //"/Nap/AddProcess/ReturnHandling/Survey"
    //#endregion
   
    //#region AdminProcess
    public static NAP_ADM_PRCS_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_ADM_PRCS]); //'Nap/AdminProcess'
    public static NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.AGRMNT_CANCEL_PAGING]); //'/Nap/AdminProcess/AgreementCancellation/Paging'
    public static NAP_ADM_PRCS_AGRMNT_CANCEL_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.AGRMNT_CANCEL_DETAIL]); //'/Nap/AdminProcess/AgreementCancellation/Detail'
    public static NAP_ADM_PRCS_AGRMNT_ACT_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.AGRMNT_ACT_PAGING]); //'/Nap/AdminProcess/AgrmntActivation/Paging'
    public static NAP_ADM_PRCS_AGRMNT_ACT_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.AGRMNT_ACT_DETAIL]); //'/Nap/AdminProcess/AgrmntActivation/Detail'
    public static NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_VIEW = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.CUST_CONFIRM_SUBJ_VIEW]); //'/Nap/AdminProcess/CustConfirmation/Subj/View'
    public static NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.CUST_CONFIRM_SUBJ_DETAIL]); //'/Nap/AdminProcess/CustConfirmation/Subj/Detail'
    public static NAP_ADM_PRCS_CUST_CONFIRM_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.CUST_CONFIRM_PAGING]); //'/Nap/AdminProcess/CustConfirmation/Paging'
    public static NAP_ADM_PRCS_CUST_CONFIRM_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.CUST_CONFIRM_DETAIL]); //'/Nap/AdminProcess/CustConfirmation/Detail'
    public static NAP_ADM_PRCS_DO_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DO_PAGING]); //'/Nap/AdminProcess/DeliveryOrder/Paging'
    public static NAP_ADM_PRCS_DO_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DO_DETAIL]); //'/Nap/AdminProcess/DeliveryOrder/Detail'
    public static NAP_ADM_PRCS_DO_MULTI_ASSET_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DO_MULTI_ASSET_PAGING]); //"/Nap/AdminProcess/DeliveryOrderMultiAsset/Paging"
    public static NAP_ADM_PRCS_DO_MULTI_ASSET_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DO_MULTI_ASSET_DETAIL]); //"/Nap/AdminProcess/DeliveryOrderMultiAsset/Detail"
    public static NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NAP_DOC_SIGNER_PAGING]); //'/Nap/AdminProcess/DocumentSigner/Paging'
    public static NAP_ADM_PRCS_NAP_DOC_SIGNER_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NAP_DOC_SIGNER_DETAIL]); //'/Nap/AdminProcess/DocumentSigner/Detail'
    public static NAP_ADM_PRCS_NAP_CFNA_DOC_SIGNER_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NAP_CFNA_DOC_SIGNER_PAGING]); //'/Nap/AdminProcess/NewDocumentSigner/Paging'  => '/Nap/AdminProcess/CfnaDocumentSigner/Paging'
    public static NAP_ADM_PRCS_NAP_CFNA_DOC_SIGNER_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NAP_CFNA_DOC_SIGNER_DETAIL]); //'/Nap/AdminProcess/NewDocumentSigner/Detail'  => '/Nap/AdminProcess/CfnaDocumentSigner/Detail'
    public static NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NAP_DOC_PRINT_PAGING]); //'/Nap/AdminProcess/DocPrint/Paging/'
    public static NAP_ADM_PRCS_NAP_DOC_PRINT_VIEW = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NAP_DOC_PRINT_VIEW]); //'/Nap/AdminProcess/DocPrint/View/'
    public static NAP_ADM_PRCS_INVOICE_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.INVOICE_DETAIL]); //"/Nap/AdminProcess/Invoice/Detail"
    public static NAP_ADM_PRCS_INVOICE_VERIF_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.INVOICE_VERIF_PAGING]); //"/Nap/AdminProcess/InvoiceVerif/Paging"
    public static NAP_ADM_PRCS_INVOICE_VERIF_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.INVOICE_VERIF_DETAIL]); //"/Nap/AdminProcess/InvoiceVerif/Detail"
    public static NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.OFFERING_VALIDITY_APPRV_PAGING]); //"/Nap/AdminProcess/OfferingValidityApproval/Paging"
    public static NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.OFFERING_VALIDITY_APPRV_DETAIL]); //"/Nap/AdminProcess/OfferingValidityApproval/Detail"
    public static NAP_ADM_PRCS_PGL_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PGL_PAGING]); //'/Nap/AdminProcess/PreGoLive/Paging'
    public static NAP_ADM_PRCS_PGL_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PGL_DETAIL]); //'/Nap/AdminProcess/PreGoLive/Detail'
    public static NAP_ADM_PRCS_PGL_REQ_APPRVL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PGL_REQ_APPRVL]); //"/Nap/AdminProcess/PreGoLive/RequestApproval"
    public static NAP_ADM_PRCS_PGL_APPRVL_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PGL_APPRVL_PAGING]); //"/Nap/AdminProcess/PreGoLive/Approval/Paging"
    public static NAP_ADM_PRCS_PGL_APPRVL_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PGL_APPRVL_DETAIL]); //"/Nap/AdminProcess/PreGoLive/Approval/Detail"
    public static NAP_ADM_PRCS_PO_PO_EXT = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PO_PO_EXT]); //'/Nap/AdminProcess/PurchaseOrder/PO'
    public static NAP_ADM_PRCS_PO_PO_EXT_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PO_PO_EXT_DETAIL]); //"/Nap/AdminProcess/PurchaseOrder/PO/Detail"
    public static NAP_ADM_PRCS_PO_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.PO_PAGING]); //"/Nap/AdminProcess/PurchaseOrder/Paging"
    public static NAP_ADM_PRCS_NEW_PO_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NEW_PO_PAGING]); //'/Nap/AdminProcess/NewPurchaseOrder/Paging'
    public static NAP_ADM_PRCS_NEW_PO_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.NEW_PO_DETAIL]); //'/Nap/AdminProcess/NewPurchaseOrder/Detail'
    public static NAP_ADM_PRCS_DOC_CHECK_LIST_REQ_APPRV = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DOC_CHECK_LIST_REQ_APPRV]); //'/Nap/AdminProcess/DocChecklist/RequestApproval'
    public static NAP_ADM_PRCS_DOC_CHECK_LIST_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DOC_CHECK_LIST_PAGING]); //'/Nap/AdminProcess/DocChecklist/Paging'
    public static NAP_ADM_PRCS_DOC_CHECK_LIST_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DOC_CHECK_LIST_DETAIL]); //'/Nap/AdminProcess/DocChecklist/Detail'
    public static NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DOC_CHECK_LIST_APPRV_PAGING]); //'/Nap/AdminProcess/DocChecklist/Approval/Paging'
    public static NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ADM_PRCS_HEADER, PathConstant.DOC_CHECK_LIST_APPRV_DETAIL]); //'/Nap/AdminProcess/DocChecklist/Approval/Detail'
    //#endregion

    //#region CreditProcess
    public static NAP_CRD_PRCS_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CRD_PRCS]); //'Nap/CreditProcess'
    public static NAP_CRD_PRCS_COMM_RSV_FUND_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.COMM_RSV_FUND_PAGING]); //"/Nap/CreditProcess/CommissionReservedFund/Paging"
    public static NAP_CRD_PRCS_COMM_RSV_FUND_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.COMM_RSV_FUND_DETAIL]); //"/Nap/CreditProcess/CommissionReservedFund/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_APPRV_PAGING]); //"/Nap/CreditProcess/CreditApproval/Paging"
    public static NAP_CRD_PRCS_CRD_APPRV_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_APPRV_DETAIL]); //"/Nap/CreditProcess/CreditApproval/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_CFNA_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_APPRV_CFNA_DETAIL]); //"/Nap/CreditProcess/CreditApprovalCfna/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_CR_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_APPRV_CR_PAGING]); //"/Nap/CreditProcess/CreditApprovalCr/Paging"
    public static NAP_CRD_PRCS_CRD_APPRV_CR_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_APPRV_CR_DETAIL]); //"/Nap/CreditProcess/CreditApprovalCr/Detail"
    public static NAP_CRD_PRCS_CRD_APPRV_CFNA_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_APPRV_CFNA_PAGING]); //'/Nap/CreditProcess/CreditApprovalCfna/Paging'
    public static NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_INVESTIGATION_PAGING]); //"/Nap/CreditProcess/CreditInvestigation/Paging"
    public static NAP_CRD_PRCS_NEW_CRD_INVESTIGATION_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.NEW_CRD_INVESTIGATION_PAGING]); //'/Nap/CreditProcess/NewCreditInvestigation/Paging'
    public static NAP_CRD_PRCS_CRD_REVIEW_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_REVIEW_PAGING]); //"Nap/CreditProcess/CreditReview/Paging"
    public static NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_REVIEW_CR_PAGING]); //"Nap/CreditProcess/CreditReviewCr/Paging"
    public static NAP_CRD_PRCS_CRD_REVIEW_CFNA_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_REVIEW_CFNA_PAGING]); //'/Nap/CreditProcess/CreditReviewCfna/Paging'
    public static NAP_CRD_PRCS_CRD_REVIEW_PROTOTYPE_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_REVIEW_PROTOTYPE_PAGING]); //'/Nap/CreditProcess/CreditReviewPrototype/Paging'
    public static NAP_CRD_PRCS_CRD_REVIEW_PROTOTYPE_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.CRD_REVIEW_PROTOTYPE_DETAIL]); //'/Nap/CreditProcess/CreditReviewPrototype/Detail'
    public static NAP_CRD_PRCS_FRAUD_VERIF_MULTI_ASSET_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.FRAUD_VERIF_MULTI_ASSET_PAGING]); //"/Nap/CreditProcess/FraudVerifMultiAsset/Paging"
    public static NAP_CRD_PRCS_FRAUD_DETECTION_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.FRAUD_DETECTION_PAGING]); //'/Nap/CreditProcess/FraudDetection/Paging'
    public static NAP_CRD_PRCS_FRAUD_DETECTION_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.FRAUD_DETECTION_DETAIL]); //"/Nap/CreditProcess/FraudDetection/Detail"
    public static NAP_CRD_PRCS_PHN_VRF_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.PHN_VRF_PAGING]); //"/Nap/CreditProcess/PhoneVerification/Paging"
    public static NAP_CRD_PRCS_PHN_VRF_SUBJECT = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.PHN_VRF_SUBJECT]); //"/Nap/CreditProcess/PhoneVerification/Subject"
    public static NAP_CRD_PRCS_PHN_VRF_SUBJECT_VERIF = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CRD_PRCS_HEADER, PathConstant.PHN_VRF_SUBJECT_VERIF]); //"/Nap/CreditProcess/PhoneVerification/Subject/Verif"
    //#endregion
    
    //#region CF2W
    public static CF2W_ADD_FREE = PathConstant.CombinePath(['..', PathConstant.CF2W_ADD_FREE]); //'../AddFree'
    public static CF2W_ADD_FIXED = PathConstant.CombinePath(['..', PathConstant.CF2W_ADD_FIXED]); //'../AddFixed'
    public static NAP_CF2W_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CF2W]); //'Nap/CF2W'
    public static NAP_CF2W_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF2W_HEADER, PathConstant.PAGING]); //'/Nap/CF2W/Paging'
    public static NAP_CF2W_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF2W_HEADER, PathConstant.ADD_DETAIL]); //"Nap/CF2W/Add/Detail"
    //#endregion
    
    //#region CF4W
    public static NAP_CF4W_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CF4W]); //'Nap/ConsumerFinance'
    public static NAP_CF4W_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF4W_HEADER, PathConstant.PAGING]); //"/Nap/ConsumerFinance/Paging"
    public static NAP_CF4W_ADD = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF4W_HEADER, PathConstant.ADD]); //"Nap/ConsumerFinance/Add"
    public static NAP_CF4W_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF4W_HEADER, PathConstant.ADD_DETAIL]); //"/Nap/ConsumerFinance/Add/Detail"
    public static NAP_CF4W_NAP1 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF4W_HEADER, PathConstant.NAP1]); //"Nap/ConsumerFinance/NAP1"
    public static NAP_CF4W_NAP2 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CF4W_HEADER, PathConstant.NAP2]); //"Nap/ConsumerFinance/NAP2"
    //#endregion
    
    //#region FL4W
    public static NAP_FL4W_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_FL4W]); //'Nap/FinanceLeasing'
    public static NAP_FL4W_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FL4W_HEADER, PathConstant.PAGING]); //"/Nap/FinanceLeasing/Paging"
    public static NAP_FL4W_VIEW_DO_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FL4W_HEADER, PathConstant.FL4W_VIEW_DO_DETAIL]); //'/Nap/FinanceLeasing/ViewDo/Detail'
    public static NAP_FL4W_ADD = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FL4W_HEADER, PathConstant.ADD]); //"Nap/FinanceLeasing/Add"
    public static NAP_FL4W_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FL4W_HEADER, PathConstant.ADD_DETAIL]); //"Nap/FinanceLeasing/Add/Detail"
    public static NAP_FL4W_NAP1 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FL4W_HEADER, PathConstant.NAP1]); //"Nap/FinanceLeasing/NAP1"
    public static NAP_FL4W_NAP2 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FL4W_HEADER, PathConstant.NAP2]); //"Nap/FinanceLeasing/NAP2"
    //#endregion
    
    //#region CFRFN4W
    public static NAP_CFRFN4W_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CFRFN4W]); //'Nap/CFRefinancing'
    public static NAP_CFRFN4W_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFRFN4W_HEADER, PathConstant.PAGING]); //"/Nap/CFRefinancing/Paging"
    public static NAP_CFRFN4W_ADD = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFRFN4W_HEADER, PathConstant.ADD]); //"Nap/CFRefinancing/Add"
    public static NAP_CFRFN4W_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFRFN4W_HEADER, PathConstant.ADD_DETAIL]); //"Nap/CFRefinancing/Add/Detail"
    public static NAP_CFRFN4W_NAP1 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFRFN4W_HEADER, PathConstant.NAP1]); //"Nap/CFRefinancing/NAP1"
    public static NAP_CFRFN4W_NAP2 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFRFN4W_HEADER, PathConstant.NAP2]); //"Nap/CFRefinancing/NAP2"
    //#endregion
    
    //#region CFNA
    public static NAP_CFNA_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_CFNA]); //'Nap/CFNA'
    public static NAP_CFNA_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFNA_HEADER, PathConstant.PAGING]); //"/Nap/CFNA/Paging"
    public static NAP_CFNA_ADD = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFNA_HEADER, PathConstant.ADD]); //"Nap/CFNA/Add"
    public static NAP_CFNA_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFNA_HEADER, PathConstant.ADD_DETAIL]); //"Nap/CFNA/Add/Detail"
    public static NAP_CFNA_NAP1 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFNA_HEADER, PathConstant.NAP1]); //"Nap/CFNA/NAP1"
    public static NAP_CFNA_NAP2 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_CFNA_HEADER, PathConstant.NAP2]); //"Nap/CFNA/NAP2"
    //#endregion
    
    //#region FCTR
    public static NAP_FCTR_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_FCTR]); //'Nap/Factoring'
    public static NAP_FCTR_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FCTR_HEADER, PathConstant.PAGING]); //"/Nap/Factoring/Paging"
    public static NAP_FCTR_ADD = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FCTR_HEADER, PathConstant.ADD]); //"Nap/Factoring/Add"
    public static NAP_FCTR_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FCTR_HEADER, PathConstant.ADD_DETAIL]); //"Nap/Factoring/Add/Detail"
    public static NAP_FCTR_NAP1 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FCTR_HEADER, PathConstant.NAP1]); //"Nap/Factoring/NAP1"
    public static NAP_FCTR_NAP2 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_FCTR_HEADER, PathConstant.NAP2]); //"Nap/Factoring/NAP2"
    //#endregion

    //#region ROS
    public static NAP_ROS_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_OPL]); //'Nap/ROS'
    public static NAP_ROS_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ROS_HEADER, PathConstant.PAGING]); //"/Nap/ROS/Paging"
    public static NAP_ROS_ADD = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ROS_HEADER, PathConstant.ADD]); //"Nap/ROS/Add"
    public static NAP_ROS_ADD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ROS_HEADER, PathConstant.ADD_DETAIL]); //"Nap/ROS/Add/Detail"
    public static NAP_ROS_NAP1 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ROS_HEADER, PathConstant.NAP1]); //"Nap/ROS/NAP1"
    public static NAP_ROS_NAP2 = "/" + PathConstant.CombinePath([NavigationConstant.NAP_ROS_HEADER, PathConstant.NAP2]); //"Nap/ROS/NAP2"
    //#endregion

    //#region Sharing
    public static NAP_SHARING_HEADER = PathConstant.CombinePath([PathConstant.LR_NAP, PathConstant.NAP_SHARING]); //'Nap/Sharing'
    public static NAP_SHARING_FROM_MOU_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_SHARING_HEADER, PathConstant.NAP_FROM_MOU_PAGING]); //"/Nap/Sharing/NapFromMou/Paging"
    public static NAP_SHARING_FROM_MOU_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_SHARING_HEADER, PathConstant.NAP_FROM_MOU_DETAIL]); //"/Nap/Sharing/NapFromMou/Detail"
    public static NAP_SHARING_FROM_LEAD_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_SHARING_HEADER, PathConstant.NAP_FROM_LEAD_PAGING]); //"/Nap/Sharing/NapFromLead/Paging"
    public static NAP_SHARING_FROM_LEAD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_SHARING_HEADER, PathConstant.NAP_FROM_LEAD_DETAIL]); //"/Nap/Sharing/NapFromLead/Detail"
    public static NAP1_SHARING_FROM_LEAD_PAGING = "/" + PathConstant.CombinePath([NavigationConstant.NAP_SHARING_HEADER, PathConstant.NAP1_FROM_LEAD_PAGING]); //"/Nap/Sharing/Nap1FromLead/Paging"
    public static NAP1_SHARING_FROM_LEAD_DETAIL = "/" + PathConstant.CombinePath([NavigationConstant.NAP_SHARING_HEADER, PathConstant.NAP1_FROM_LEAD_DETAIL]); //"/Nap/Sharing/Nap1FromLead/Detail"
    //#endregion

    //#endregion
    
    //#region NAP-VIEW
    public static VIEW_APP = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_APP]); //'/View/AppView'
    public static BACK_VIEW_APP = PathConstant.CombinePath(['..', '..', NavigationConstant.VIEW_APP]); //'../../View/AppView'
    public static VIEW_AGRMNT = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_AGRMNT]); //"/View/AgrmntView"
    public static VIEW_CUST_EXPSR = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_CUST_EXPSR]); //"/View/CustExposureView"
    public static VIEW_LEAD = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_LEAD]); //"/View/Lead"
    public static VIEW_MOU_CUST = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_MOU_CUST]); //"/View/Mou/CustView"
    public static VIEW_PHN_VERIF = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_PHN_VERIF]); //"/View/PhoneVerifView"
    public static VIEW_SRVY = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_SRVY]); //'/View/SurveyView'
    //#endregion

    //#region FOU-VIEW
    public static VIEW_FOU_CUST_PERSONAL_DETAIL = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_FOU_CUST_PERSONAL_DETAIL]); //'/View/Customer/PersonalDetail'
    public static VIEW_FOU_OFFERING = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_FOU_OFFERING]); //'/View/Offering'
    public static VIEW_FOU_SRVY_ORDER = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_FOU_SRVY_ORDER]); //'/View/Survey/SurveyOrder'
    public static VIEW_FOU_SRVY_TASK = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_FOU_SRVY_TASK]); //'/View/Survey/SurveyTask'
    public static VIEW_FOU_VENDOR_BRANCH = "/" + PathConstant.CombinePath([PathConstant.VIEW, PathConstant.VIEW_FOU_VENDOR_BRANCH]); //'/View/Vendor/VendorBranch'
    //#endregion

    //#region MOU
    public static MOU_UNAUTHORIZED_PAGE = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_UNAUTHORIZED_PAGE]); //"/Mou/UnauthorizedPage"
    public static MOU_CUST_CANCEL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_CANCEL]); //'/Mou/Cust/Cancel'
    public static MOU_CUST_INQUIRY = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_INQUIRY]); //'/Mou/Cust/Inquiry'
    public static MOU_CUST_DOC_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_DOC_PAGING]); //'/Mou/CustomerDoc/Paging'
    public static MOU_CUST_DOC_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_DOC_DETAIL]); //'/Mou/CustomerDoc/Detail'
    public static MOU_DOC_SIGNER_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DOC_SIGNER_PAGING]); //'/Mou/DocSigner/Paging'
    public static MOU_DOC_SIGNER_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DOC_SIGNER_DETAIL]); //'/Mou/DocSigner/Detail'
    public static MOU_CUST_LEGAL_RVW_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_LEGAL_RVW_PAGING]); //'/Mou/CustomerLegalReview/Paging'
    public static MOU_CUST_LEGAL_RVW_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_LEGAL_RVW_DETAIL]); //'/Mou/CustomerLegalReview/Detail'
    public static MOU_CUST_RVW_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_RVW_PAGING]); //'/Mou/Cust/ReviewPaging'
    public static MOU_CUST_RVW_FCTR = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_RVW_FCTR]); //'/Mou/Cust/ReviewFactoring'
    public static MOU_CUST_RVW_GENERAL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_RVW_GENERAL]); //'/Mou/Cust/ReviewGeneral'
    public static MOU_CUST_APPRV_FCTR = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_APPRV_FCTR]); //'/Mou/Cust/ApprovalFactoring'
    public static MOU_CUST_APPRV_GENERAL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_APPRV_GENERAL]); //'/Mou/Cust/ApprovalGeneral'
    public static MOU_REQ_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_REQ_PAGING]); //"/Mou/Request/Paging"
    public static MOU_REQ_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_REQ_DETAIL]); //'/Mou/Request/Detail'
    public static MOU_CUST_APPRV = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_APPRV]); //"/Mou/Cust/Approval"
    public static MOU_EDIT_CUST_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_EDIT_CUST_PAGING]); //"/Mou/EditMouCustomer/Paging"
    public static MOU_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.DETAIL]); //"/Mou/Detail"
    public static MOU_DUP_CHECK_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DUP_CHECK_PAGING]); //"/Mou/DuplicateCheck/Paging"
    public static MOU_DUP_CHECK_SIMILAR_PERSONAL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DUP_CHECK_SIMILAR_PERSONAL]); //"/Mou/DuplicateCheck/SimilarPersonal"
    public static MOU_DUP_CHECK_EXIST_PERSONAL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DUP_CHECK_EXIST_PERSONAL]); //"/Mou/DuplicateCheck/ExistingPersonal"
    public static MOU_DUP_CHECK_SIMILAR_COY = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DUP_CHECK_SIMILAR_COY]); //"/Mou/DuplicateCheck/SimilarCompany"
    public static MOU_DUP_CHECK_EXIST_COY = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_DUP_CHECK_EXIST_COY]); //"/Mou/DuplicateCheck/ExistingCompany"
    public static MOU_EXECUTION_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_EXECUTION_PAGING]); //"/Mou/Execution/Paging"
    public static MOU_EXECUTION_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_EXECUTION_DETAIL]); //"/Mou/Execution/Detail"
    public static MOU_CUST_OUTSTANDING_TC_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_OUTSTANDING_TC_PAGING]); //"/Mou/Cust/OutstandingTC/Paging"
    public static MOU_CUST_OUTSTANDING_TC_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_MOU, PathConstant.MOU_CUST_OUTSTANDING_TC_DETAIL]); //"/Mou/Cust/OutstandingTC/Detail"
    //#endregion

    //#region LEAD
    public static LEAD_CANCEL = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.CANCEL]); //'/Lead/Cancel'
    public static LEAD_INQUIRY = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_INQUIRY]); //'/Lead/LeadInquiry'
    public static LEAD_INPUT_MAIN_INFO = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_INPUT_MAIN_INFO]); //'/Lead/LeadInput/MainInfo'
    public static LEAD_RVW_MONITORING_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_RVW_MONITORING_PAGING]); //'/Lead/ReviewMonitoring/Paging'
    public static LEAD_RVW_MONITORING_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_RVW_MONITORING_DETAIL]); //'/Lead/ReviewMonitoring/Detail'
    public static LEAD_TELE_VERIF_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_TELE_VERIF_PAGING]); //'/Lead/TeleVerif/Paging'
    public static LEAD_TELE_VERIF_DETAIL = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_TELE_VERIF_DETAIL]); //'/Lead/TeleVerif/Detail'
    public static LEAD_FRAUD_VERIF_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_FRAUD_VERIF_PAGING]); //"/Lead/FraudVerif/Paging"
    public static LEAD_FRAUD_VERIF_PAGE = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_FRAUD_VERIF_PAGE]); //"/Lead/FraudVerif/Page"
    public static LEAD_CONFIRM_CANCEL = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_CONFIRM_CANCEL]); //"/Lead/ConfirmCancel"
    public static LEAD_UPDATE_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_UPDATE_PAGING]); //"Lead/LeadUpdate/Paging"
    public static LEAD_PAGING = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_PAGING]); //"/Lead/Lead/Paging"
    public static LEAD_INPUT_PAGE = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.LEAD_INPUT_PAGE]); //"/Lead/LeadInput/Page"
    public static LEAD_VERIF = "/" + PathConstant.CombinePath([PathConstant.LR_LEAD, PathConstant.VERIF]); //'/Lead/Verif'
    //#endregion
}
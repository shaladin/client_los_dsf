export class PathConstant {

    // layout-routes
    //#region layout-routes
    public static LR_DASHBOARD = "Dashboard";
    public static LR_FORMS = "Forms";
    public static LR_COMPNT = "Components";
    public static LR_NOTIF = "Notification";
    public static LR_PAGES = "Pages";
    public static LR_MOU = "Mou";
    public static LR_NAP = "Nap";
    public static LR_LEAD = "Lead";
    public static LR_INQUIRY = "Inquiry";
    public static LR_INTEGRATION = "Integration";
    public static LR_BACKDOOR = "Backdoor";
    public static LR_LTKM = "Ltkm";
    public static LR_TRIAL_CALC = "TrialCalculation";
    public static LR_TASK_REASSIGN = "TaskReassignment";
    public static UNAUTHORIZED = "Unauthorized";
    //#endregion

    //#region Common-Path
    public static VIEW = "View";
    public static PAGES = "Pages";
    public static NAP1 = "NAP1";
    public static NAP2 = "NAP2";
    public static NAP4 = "NAP4";
    public static PAGING = "Paging";
    public static MAIN = "Main";
    public static ADD = "Add";
    public static EDIT = "Edit";
    public static ADD_DETAIL = PathConstant.ADD + "/Detail";
    public static DETAIL = "Detail";
    public static VERIF = "Verif";
    public static APPRV = "Approval";
    public static INQUIRY = "Inquiry";
    public static CANCEL = "Cancel";
    public static PERSONAL = "Personal";
    public static COY = "Company";
    public static TEST_FINANCIAL = "Nap/TestFinData";
    public static NAP_FROM_LEAD = "NapFromLead";
    public static NAP_FROM_MOU = "NapFromMou";
    public static NAP1_FROM_LEAD = "Nap1FromLead";
    public static COMM_RSV_FUND = "CommissionReservedFund";
    public static PAGING_LOWERCASE = "paging";
    public static DETAIL_LOWERCASE = "detail";
    public static PERSONAL_LOWERCASE = "personal";
    public static COY_LOWERCASE = "company";
    public static OPL_LOWERCASE = "opl";
    //#endregion

    //#region Form-Module
    public static BASIC = "Basic";
    public static HORIZONTAL = "Horizontal";
    public static HIDDEN_LABELS = "Hidden-Labels";
    public static FORM_ACTIONS = "Form-Actions";
    public static BORDERED = "Bordered";
    public static STRIPED_ROWS = "Striped-Rows";
    public static INPUTS = "Inputs";
    public static INPUT_GROUPS = "Input-Groups";
    public static INPUT_GRID = "Input-Grid";
    public static VALIDATION = "Validation";
    public static WIZARD = "Wizard";
    public static NGX = "Ngx";
    public static ARCHWIZARD = "Archwizard";
    public static REPORT = "Report";
    //#endregion

    //#region Nap-Module
    public static NAP_CF4W = "ConsumerFinance";
    public static NAP_FL4W = "FinanceLeasing";
    public static NAP_CF2W = "CF2W";
    public static NAP_CFRFN4W = "CFRefinancing";
    public static NAP_CFNA = "CFNA";
    public static NAP_FCTR = "Factoring";
    public static NAP_OPL = "OPL";
    public static NAP_ADDTNL_PRCS = "AdditionalProcess";
    public static NAP_CRD_PRCS = "CreditProcess";
    public static NAP_ADM_PRCS = "AdminProcess";
    public static NAP_ADD_PRCS = "AddProcess";
    public static NAP_VIEW = "View";
    public static NAP_SHARING = "Sharing";
    public static NAP_VIEW_ASSET = "ViewAsset";
    public static NAP_MAIN_DATA = "MainData";
    public static NAP_CUST_COMPL = "CustCompletion";
    public static NAP_APP_PRCS = "ApplicationProcess";
    public static NAP_DLFN = "DLFN";
    //#endregion
    
    //#region Nap-CF2W
    public static CF2W_APP = "App";
    public static CF2W_ADD_FREE = "AddFree";
    public static CF2W_ADD_FIXED = "AddFixed";
    //#endregion
    
    //#region Nap-Cust-Compl
    public static CUST_COMPL_PRSNL = PathConstant.DETAIL + "/" + PathConstant.PERSONAL;
    public static CUST_COMPL_COY = PathConstant.DETAIL + "/" + PathConstant.COY;
    public static OPL_DETAIL_LOWERCASE = PathConstant.OPL_LOWERCASE + "/" + PathConstant.DETAIL_LOWERCASE;
    public static CUST_COMPL_OPL_PRSNL = PathConstant.OPL_LOWERCASE + "/" + PathConstant.DETAIL_LOWERCASE + "/" + PathConstant.PERSONAL_LOWERCASE;
    public static CUST_COMPL_OPL_COY = PathConstant.OPL_LOWERCASE + "/" + PathConstant.DETAIL_LOWERCASE + "/" + PathConstant.COY_LOWERCASE;
    //#endregion

    //#region Nap-FL4W
    public static FL4W_VIEW_AGRMNT = "ViewAgrmnt";
    public static FL4W_VIEW_INS = "ViewInsurance";
    public static FL4W_VIEW_AGRMNT_FL4W = "ViewAgrmntFL4W";
    public static FL4W_VIEW_DO = "ViewDo";
    public static FL4W_VIEW_DO_DETAIL = PathConstant.FL4W_VIEW_DO + "/" + PathConstant.DETAIL;
    public static FL4W_VIEW_DO_DETAIL_ASSET = PathConstant.FL4W_VIEW_DO + "/DetailAsset";
    //#endregion

    //#region Nap-Main-Data
    public static NAP1_PAGING = PathConstant.NAP1 + "/" + PathConstant.PAGING;
    public static NAP1_ADD = PathConstant.NAP1 + "/" + PathConstant.ADD;
    public static NAP2_PAGING = PathConstant.NAP2 + "/" + PathConstant.PAGING;
    //#endregion
    
    //#region Nap-Sharing-Page
    public static NAP_FROM_LEAD_PAGING = PathConstant.NAP_FROM_LEAD + "/" + PathConstant.PAGING;
    public static NAP_FROM_LEAD_DETAIL = PathConstant.NAP_FROM_LEAD + "/" + PathConstant.DETAIL;
    public static NAP_FROM_MOU_PAGING = PathConstant.NAP_FROM_MOU + "/" + PathConstant.PAGING;
    public static NAP_FROM_MOU_DETAIL = PathConstant.NAP_FROM_MOU + "/" + PathConstant.DETAIL;
    public static NAP1_FROM_LEAD_PAGING = PathConstant.NAP1_FROM_LEAD + "/" + PathConstant.PAGING;
    public static NAP1_FROM_LEAD_DETAIL = PathConstant.NAP1_FROM_LEAD + "/" + PathConstant.DETAIL;
    public static NAP_SIMPLE_LEAD = "NapFromSimpleLead";
    public static NAP_SIMPLE_LEAD_PAGING = PathConstant.NAP_SIMPLE_LEAD + "/" + PathConstant.PAGING;
    public static NAP_SIMPLE_LEAD_DETAIL = PathConstant.NAP_SIMPLE_LEAD + "/" + PathConstant.DETAIL;
    //#endregion

    //#region Nap-View
    public static APP_VIEW = "AppView";
    public static APP_VIEW_COLL_DATA_VIEW = PathConstant.APP_VIEW + "/CollateralDataView";
    public static AGRMNT_VIEW = "AgrmntView";
    public static PO_VIEW = "POView";
    //#endregion

    //#region Nap-Additional-Prcs
    public static CRD_APPRVL_RES_EXT = "CreditApprovalResultExt";
    public static CRD_APPRVL_RES_EXT_PAGING = PathConstant.CRD_APPRVL_RES_EXT + "/" + PathConstant.PAGING;
    public static CRD_APPRVL_RES_EXT_DETAIL = PathConstant.CRD_APPRVL_RES_EXT + "/" + PathConstant.DETAIL;
    public static CRD_APPRVL_RES_EXT_ASSET_INQUIRY = PathConstant.CRD_APPRVL_RES_EXT + "/AssetInquiry";
    public static CRD_APPR_RES_EXT_APPRVL = "CreditApvResultExtApproval";
    public static CRD_APPR_RES_EXT_APPRVL_PAGING = PathConstant.CRD_APPR_RES_EXT_APPRVL + "/" + PathConstant.PAGING;
    public static CRD_APPR_RES_EXT_APPRVL_DETAIL = PathConstant.CRD_APPR_RES_EXT_APPRVL + "/" + PathConstant.DETAIL;
    public static OUTSTANDING_TC = "OutstandingTC";
    public static OUTSTANDING_TC_PAGING = PathConstant.OUTSTANDING_TC + "/" + PathConstant.PAGING;
    public static OUTSTANDING_TC_DETAIL = PathConstant.OUTSTANDING_TC + "/" + PathConstant.DETAIL;
    public static RETURN_HANDLING = "ReturnHandling";
    public static RETURN_HANDLING_PAGING = PathConstant.RETURN_HANDLING + "/" + PathConstant.PAGING;
    public static RETURN_HANDLING_DETAIL = PathConstant.RETURN_HANDLING + "/" + PathConstant.DETAIL;
    public static RETURN_HANDLING_COMM_RSV_FUND_PAGING = PathConstant.RETURN_HANDLING + "/" + PathConstant.COMM_RSV_FUND + "/" + PathConstant.PAGING;
    public static RETURN_HANDLING_EDIT_APP_PAGING = PathConstant.RETURN_HANDLING + "/EditAppPaging";
    public static RETURN_HANDLING_EDIT_CUST_PAGING = PathConstant.RETURN_HANDLING + "/editcustpaging";
    public static RETURN_HANDLING_SRVY = PathConstant.RETURN_HANDLING + "/Survey";
    public static RETURN_HANDLING_SRVY_VERIF_PAGING = PathConstant.RETURN_HANDLING + "/SurveyVerif" + PathConstant.PAGING;
    public static RETURN_HANDLING_NAP2 = PathConstant.RETURN_HANDLING + PathConstant.NAP2;
    public static RETURN_HANDLING_NAP4 = PathConstant.RETURN_HANDLING + PathConstant.NAP4;
    public static APP_DUP_CHECK = "AppDupCheck";
    public static APP_EXIST_DATA = "ApplicantExistingData";
    public static APP_DUP_CHECK_PAGING = PathConstant.APP_DUP_CHECK + "/" + PathConstant.PAGING;
    public static APP_DUP_CHECK_PERSONAL = PathConstant.APP_DUP_CHECK + "/" + PathConstant.PERSONAL;
    public static APP_DUP_CHECK_COY = PathConstant.APP_DUP_CHECK + "/" + PathConstant.COY;
    public static APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL = PathConstant.APP_DUP_CHECK + "/" + PathConstant.APP_EXIST_DATA + "/" + PathConstant.PERSONAL;
    public static APP_DUP_CHECK_APP_EXIST_DATA_COY = PathConstant.APP_DUP_CHECK + "/" + PathConstant.APP_EXIST_DATA + "/" + PathConstant.COY;
    public static RETURN_HANDLING_PHN_VRF = "ReturnHandlingPhoneVerif";
    public static RETURN_HANDLING_PHN_VRF_PAGING = PathConstant.RETURN_HANDLING_PHN_VRF + "/" + PathConstant.PAGING;
    public static RETURN_HANDLING_COLL = "ReturnHandlingCollateral";
    public static RETURN_HANDLING_COLL_PAGING = PathConstant.RETURN_HANDLING_COLL + "/" + PathConstant.PAGING;
    public static RETURN_HANDLING_COLL_DETAIL = PathConstant.RETURN_HANDLING_COLL + "/" + PathConstant.DETAIL;
    public static RETURN_HANDLING_COLL_EDIT = PathConstant.RETURN_HANDLING_COLL + "/" + PathConstant.EDIT;
    public static COPY_CANCEL_APP = "CopyCancelledApplication";
    public static RETURN_HANDLING_ADD_TC = "ReturnHandlingAddTc";
    public static RETURN_HANDLING_ADD_TC_PAGING = PathConstant.RETURN_HANDLING_ADD_TC + "/" + PathConstant.PAGING;
    public static RETURN_HANDLING_ADD_TC_DETAIL = PathConstant.RETURN_HANDLING_ADD_TC + "/" + PathConstant.DETAIL;
    public static APP_DUP_CHECK_MAIN_DATA = "AppDupCheckMainData";
    public static APP_DUP_CHECK_MAIN_DATA_PAGING = PathConstant.APP_DUP_CHECK_MAIN_DATA + "/" + PathConstant.PAGING;
    public static APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST = PathConstant.APP_DUP_CHECK_MAIN_DATA + "/SubjList";
    public static APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH = PathConstant.APP_DUP_CHECK_MAIN_DATA + "/SubjMatch";
    public static ADD_TC = "addtc";
    public static ADD_TC_PAGING = PathConstant.ADD_TC + "/" + PathConstant.PAGING_LOWERCASE;
    public static ADD_TC_DETAIL = PathConstant.ADD_TC + "/" + PathConstant.DETAIL_LOWERCASE;
    public static APP_CAN = "AppCancel";
    public static APP_CAN_PAGING = PathConstant.APP_CAN + "/" + PathConstant.PAGING;
    public static APP_CAN_DETAIL = PathConstant.APP_CAN + "/" + PathConstant.DETAIL;
    public static APP_ASSET_CAN = "AppAssetCancel";
    public static APP_ASSET_CAN_PAGING = PathConstant.APP_ASSET_CAN + "/" + PathConstant.PAGING;
    public static APP_ASSET_CAN_DETAIL = PathConstant.APP_ASSET_CAN + "/" + PathConstant.DETAIL;
    public static DOC_PICKUP_REQUEST = "DocumentPickupRequest";
    public static DOC_PICKUP_REQUEST_PAGING = PathConstant.DOC_PICKUP_REQUEST + "/" + PathConstant.PAGING;
    public static DOC_PICKUP_REQUEST_DETAIL= PathConstant.DOC_PICKUP_REQUEST + "/" + PathConstant.DETAIL;
    public static EDIT_APP_AFT_APV = "EditAppAftApv";
    public static EDIT_APP_AFT_APV_PAGING = PathConstant.EDIT_APP_AFT_APV + "/" + PathConstant.PAGING;
    public static EDIT_APP_AFT_APV_INQUIRY = PathConstant.EDIT_APP_AFT_APV + "/" + PathConstant.INQUIRY;
    public static EDIT_APP_AFT_APV_DETAIL= PathConstant.EDIT_APP_AFT_APV + "/" + PathConstant.DETAIL;
    public static EDIT_APP_AFT_APV_VIEW= PathConstant.EDIT_APP_AFT_APV + "/" + PathConstant.VIEW;
    public static EDIT_APP_AFT_APV_APPRV= PathConstant.EDIT_APP_AFT_APV + "/" + PathConstant.APPRV;
    public static EDIT_APP_AFT_APV_APPRV_PAGING = PathConstant.EDIT_APP_AFT_APV_APPRV + "/" + PathConstant.PAGING;
    public static EDIT_APP_AFT_APV_APPRV_DETAIL= PathConstant.EDIT_APP_AFT_APV_APPRV + "/" + PathConstant.DETAIL;
    public static COPY_CANCEL_APP_CROSS_BL = "CopyCancelledApplicationCrossBl";
    public static COPY_CANCEL_APP_CROSS_BL_DETAIL = PathConstant.COPY_CANCEL_APP_CROSS_BL + "/" + PathConstant.DETAIL;

    public static RETURN_HANDLING_NAP2_PAGING = PathConstant.RETURN_HANDLING + "/" + PathConstant.NAP2;
    public static RETURN_HANDLING_NAP4_PAGING = PathConstant.RETURN_HANDLING + "/" + PathConstant.NAP4;
    //#endregion

    //#region Nap-Admin-Prcs
    public static PO = "PurchaseOrder";
    public static PO_EXT = "PO";
    public static NEW_PO = "NewPurchaseOrder";
    public static PO_PAGING = PathConstant.PO + "/" + PathConstant.PAGING;
    public static PO_PO_EXT = PathConstant.PO + "/" + PathConstant.PO_EXT;
    public static PO_PO_EXT_DETAIL = PathConstant.PO_PO_EXT + "/" + PathConstant.DETAIL;
    public static NEW_PO_PAGING = PathConstant.NEW_PO + "/" + PathConstant.PAGING;
    public static NEW_PO_DETAIL = PathConstant.NEW_PO + "/" + PathConstant.DETAIL;
    public static DO = "DeliveryOrder";
    public static DO_PAGING = PathConstant.DO + "/" + PathConstant.PAGING;
    public static DO_DETAIL = PathConstant.DO + "/" + PathConstant.DETAIL;
    public static CUST_CONFIRM = "CustConfirmation";
    public static CUST_CONFIRM_PAGING = PathConstant.CUST_CONFIRM + "/" + PathConstant.PAGING;
    public static CUST_CONFIRM_DETAIL = PathConstant.CUST_CONFIRM + "/" + PathConstant.DETAIL;
    public static SUBJ = "Subj";
    public static CUST_CONFIRM_SUBJ_DETAIL = PathConstant.CUST_CONFIRM + "/" + PathConstant.SUBJ + "/" + PathConstant.DETAIL;
    public static CUST_CONFIRM_SUBJ_VIEW = PathConstant.CUST_CONFIRM + "/" + PathConstant.SUBJ + "/" + PathConstant.VIEW;
    public static PGL = "PreGoLive";
    public static PGL_PAGING = PathConstant.PGL + "/" + PathConstant.PAGING;
    public static PGL_DETAIL = PathConstant.PGL + "/" + PathConstant.DETAIL;
    public static PGL_OPL = "pregoliveopl";
    public static PGL_OPL_PAGING = PathConstant.PGL_OPL + "/" + PathConstant.PAGING_LOWERCASE;
    public static PGL_OPL_DETAIL = PathConstant.PGL_OPL + "/" + PathConstant.DETAIL_LOWERCASE;
    public static PGL_REQ_APPRVL = PathConstant.PGL + "/RequestApproval";
    public static PGL_APPRVL_PAGING = PathConstant.PGL + "/" + PathConstant.APPRV + "/" + PathConstant.PAGING;
    public static PGL_APPRVL_DETAIL = PathConstant.PGL + "/" + PathConstant.APPRV + "/" + PathConstant.DETAIL;
    public static AGRMNT_CANCEL = "AgreementCancellation";
    public static AGRMNT_CANCEL_PAGING = PathConstant.AGRMNT_CANCEL + "/" + PathConstant.PAGING;
    public static AGRMNT_CANCEL_DETAIL = PathConstant.AGRMNT_CANCEL + "/" + PathConstant.DETAIL;
    public static AGRMNT_ACT = "AgrmntActivation";
    public static AGRMNT_ACT_PAGING = PathConstant.AGRMNT_ACT + "/" + PathConstant.PAGING;
    public static AGRMNT_ACT_DETAIL = PathConstant.AGRMNT_ACT + "/" + PathConstant.DETAIL;
    public static OFFERING_VALIDITY_APPRV = "OfferingValidityApproval";
    public static OFFERING_VALIDITY_APPRV_PAGING = PathConstant.OFFERING_VALIDITY_APPRV + "/" + PathConstant.PAGING;
    public static OFFERING_VALIDITY_APPRV_DETAIL = PathConstant.OFFERING_VALIDITY_APPRV + "/" + PathConstant.DETAIL;
    public static NAP_DOC_SIGNER = "DocumentSigner";
    public static NAP_DOC_SIGNER_PAGING = PathConstant.NAP_DOC_SIGNER + "/" + PathConstant.PAGING;
    public static NAP_DOC_SIGNER_DETAIL = PathConstant.NAP_DOC_SIGNER + "/" + PathConstant.DETAIL;
    public static NAP_CFNA_DOC_SIGNER = "CfnaDocumentSigner";
    public static NAP_CFNA_DOC_SIGNER_PAGING = PathConstant.NAP_CFNA_DOC_SIGNER + "/" + PathConstant.PAGING;
    public static NAP_CFNA_DOC_SIGNER_DETAIL = PathConstant.NAP_CFNA_DOC_SIGNER + "/" + PathConstant.DETAIL;
    public static INVOICE = "Invoice";
    public static INVOICE_DETAIL = PathConstant.INVOICE + "/" + PathConstant.DETAIL;
    public static NAP_DOC_PRINT = "DocPrint";
    public static NAP_DOC_PRINT_PAGING = PathConstant.NAP_DOC_PRINT + "/" + PathConstant.PAGING;
    public static NAP_DOC_PRINT_VIEW = PathConstant.NAP_DOC_PRINT + "/" + PathConstant.VIEW;
    public static DO_MULTI_ASSET = "DeliveryOrderMultiAsset";
    public static DO_MULTI_ASSET_PAGING = PathConstant.DO_MULTI_ASSET + "/" + PathConstant.PAGING;
    public static DO_MULTI_ASSET_DETAIL = PathConstant.DO_MULTI_ASSET + "/" + PathConstant.DETAIL;
    public static INVOICE_VERIF = "InvoiceVerif";
    public static INVOICE_VERIF_PAGING = PathConstant.INVOICE_VERIF + "/" + PathConstant.PAGING;
    public static INVOICE_VERIF_DETAIL = PathConstant.INVOICE_VERIF + "/" + PathConstant.DETAIL;
    public static INVOICE_VERIF_DETAIL_LIST_INV = PathConstant.INVOICE_VERIF + "/" + PathConstant.DETAIL + "/listOfInvoice";
    public static INVOICE_VERIF_INV_DSF = PathConstant.INVOICE_VERIF + "/InvoiceDetailDF";
    public static DOC_CHECK_LIST = "DocChecklist";
    public static DOC_CHECK_LIST_PAGING = PathConstant.DOC_CHECK_LIST + "/" + PathConstant.PAGING;
    public static DOC_CHECK_LIST_DETAIL = PathConstant.DOC_CHECK_LIST + "/" + PathConstant.DETAIL;
    public static DOC_CHECK_LIST_REQ_APPRV = PathConstant.DOC_CHECK_LIST + "/RequestApproval";
    public static DOC_CHECK_LIST_APPRV = PathConstant.DOC_CHECK_LIST + "/" + PathConstant.APPRV;
    public static DOC_CHECK_LIST_APPRV_PAGING = PathConstant.DOC_CHECK_LIST_APPRV + "/" + PathConstant.PAGING;
    public static DOC_CHECK_LIST_APPRV_DETAIL = PathConstant.DOC_CHECK_LIST_APPRV + "/" + PathConstant.DETAIL;
    public static ASSET_ALLOC = "AssetAllocation";
    public static ASSET_ALLOC_PAGING = PathConstant.ASSET_ALLOC + "/" + PathConstant.PAGING;
    public static ASSET_ALLOC_DETAIL = PathConstant.ASSET_ALLOC + "/" + PathConstant.DETAIL;
    //#endregion
    
    //#region Nap-Crd-Prcs
    public static COMM_RSV_FUND_PAGING = PathConstant.COMM_RSV_FUND + "/" + PathConstant.PAGING;
    public static COMM_RSV_FUND_DETAIL = PathConstant.COMM_RSV_FUND + "/" + PathConstant.DETAIL;
    public static PHN_VRF = "PhoneVerification";
    public static SUBJECT = "Subject";
    public static PHN_VRF_PAGING = PathConstant.PHN_VRF + "/" + PathConstant.PAGING;
    public static PHN_VRF_SUBJECT = PathConstant.PHN_VRF + "/" + PathConstant.SUBJECT;
    public static PHN_VRF_SUBJECT_VIEW = PathConstant.PHN_VRF_SUBJECT + "/" + PathConstant.VIEW;
    public static PHN_VRF_SUBJECT_VERIF = PathConstant.PHN_VRF_SUBJECT + "/" + PathConstant.VERIF;
    public static CRD_INVESTIGATION = "CreditInvestigation";
    public static CRD_INVESTIGATION_PAGING = PathConstant.CRD_INVESTIGATION + "/" + PathConstant.PAGING;
    public static CRD_INVESTIGATION_DETAIL = PathConstant.CRD_INVESTIGATION + "/" + PathConstant.DETAIL;
    public static NEW_CRD_INVESTIGATION = "NewCreditInvestigation";
    public static NEW_CRD_INVESTIGATION_PAGING = PathConstant.NEW_CRD_INVESTIGATION + "/" + PathConstant.PAGING;
    public static NEW_CRD_INVESTIGATION_DETAIL = PathConstant.NEW_CRD_INVESTIGATION + "/" + PathConstant.DETAIL;
    public static CRD_REVIEW = "CreditReview";
    public static CRD_REVIEW_PAGING = PathConstant.CRD_REVIEW + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_MAIN = PathConstant.CRD_REVIEW + "/" + PathConstant.MAIN;
    public static CRD_REVIEW_PROTOTYPE = "CreditReviewPrototype";
    public static CRD_REVIEW_PROTOTYPE_PAGING = PathConstant.CRD_REVIEW_PROTOTYPE + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_PROTOTYPE_DETAIL = PathConstant.CRD_REVIEW_PROTOTYPE + "/" + PathConstant.DETAIL;
    public static CRD_REVIEW_CFNA = "CreditReviewCfna";
    public static CRD_REVIEW_CFNA_PAGING = PathConstant.CRD_REVIEW_CFNA + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_CFNA_MAIN = PathConstant.CRD_REVIEW_CFNA + "/" + PathConstant.MAIN;
    public static CRD_APPRV = "CreditApproval";
    public static CRD_APPRV_PAGING = PathConstant.CRD_APPRV + "/" + PathConstant.PAGING;
    public static CRD_APPRV_DETAIL = PathConstant.CRD_APPRV + "/" + PathConstant.DETAIL;
    public static CRD_APPRV_CFNA = "CreditApprovalCfna";
    public static CRD_APPRV_CFNA_PAGING = PathConstant.CRD_APPRV_CFNA + "/" + PathConstant.PAGING;
    public static CRD_APPRV_CFNA_DETAIL = PathConstant.CRD_APPRV_CFNA + "/" + PathConstant.DETAIL;
    public static FRAUD_DETECTION = "FraudDetection";
    public static FRAUD_DETECTION_PAGING = PathConstant.FRAUD_DETECTION + "/" + PathConstant.PAGING;
    public static FRAUD_DETECTION_DETAIL = PathConstant.FRAUD_DETECTION + "/" + PathConstant.DETAIL;
    public static FRAUD_DETECTION_NEG_ASSET_DUP_CHECK = PathConstant.FRAUD_DETECTION + "/NegativeAssetDuplicateChecking";
    public static FRAUD_VERIF_MULTI_ASSET = "FraudVerifMultiAsset";
    public static FRAUD_VERIF_MULTI_ASSET_PAGING = PathConstant.FRAUD_VERIF_MULTI_ASSET + "/" + PathConstant.PAGING;
    public static CRD_INQUIRY = "CreditInquiry";
    public static CRD_INQUIRY_PAGING = PathConstant.CRD_INQUIRY + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_CR = "CreditReviewCr";
    public static CRD_REVIEW_CR_PAGING = PathConstant.CRD_REVIEW_CR + "/" + PathConstant.PAGING;
    public static CRD_REVIEW_CR_DETAIL = PathConstant.CRD_REVIEW_CR + "/" + PathConstant.DETAIL;
    public static CRD_APPRV_CR = "CreditApproval";
    public static CRD_APPRV_CR_PAGING = PathConstant.CRD_APPRV_CR + "/" + PathConstant.PAGING;
    public static CRD_APPRV_CR_DETAIL = PathConstant.CRD_APPRV_CR + "/" + PathConstant.DETAIL;
    //#endregion
    
    //#region Nap-App_Prcs
    public static APP_RVW = "ApplicationReview";
    public static APP_RVW_PAGING = PathConstant.APP_RVW + "/" + PathConstant.PAGING;
    public static APP_RVW_DETAIL = PathConstant.APP_RVW + "/" + PathConstant.DETAIL;
    public static APP_APPRV = "ApplicationApproval";
    public static APP_APPRV_PAGING = PathConstant.APP_APPRV + "/" + PathConstant.PAGING;
    public static APP_APPRV_DETAIL = PathConstant.APP_APPRV + "/" + PathConstant.DETAIL;
    //#endregion

    //#region MOU-Module
    public static MOU_DOC_SIGNER = "DocSigner";
    public static MOU_DOC_SIGNER_PAGING = PathConstant.MOU_DOC_SIGNER + "/" + PathConstant.PAGING;
    public static MOU_DOC_SIGNER_DETAIL = PathConstant.MOU_DOC_SIGNER + "/" + PathConstant.DETAIL;
    public static MOU_REQ = "Request";
    public static MOU_REQ_PAGING = PathConstant.MOU_REQ + "/" + PathConstant.PAGING;
    public static MOU_REQ_DETAIL = PathConstant.MOU_REQ + "/" + PathConstant.DETAIL;
    public static MOU_CUST_DOC = "CustomerDoc";
    public static MOU_CUST_DOC_PAGING = PathConstant.MOU_CUST_DOC + "/" + PathConstant.PAGING;
    public static MOU_CUST_DOC_DETAIL = PathConstant.MOU_CUST_DOC + "/" + PathConstant.DETAIL;
    public static MOU_CUST_LEGAL_RVW = "CustomerLegalReview";
    public static MOU_CUST_LEGAL_RVW_PAGING = PathConstant.MOU_CUST_LEGAL_RVW + "/" + PathConstant.PAGING;
    public static MOU_CUST_LEGAL_RVW_DETAIL = PathConstant.MOU_CUST_LEGAL_RVW + "/" + PathConstant.DETAIL;
    public static MOU_CUST = "Cust";
    public static MOU_CUSTOMER = "Customer"; 
    public static MOU_CUST_RVW_PAGING = PathConstant.MOU_CUST + "/ReviewPaging";
    public static MOU_CUST_RVW_GENERAL = PathConstant.MOU_CUST + "/ReviewGeneral";
    public static MOU_CUST_RVW_FCTR = PathConstant.MOU_CUST + "/ReviewFactoring";
    public static MOU_CUST_RVW_DFLN = PathConstant.MOU_CUST + "/ReviewDLFN";
    public static MOU_CUST_APPRV = PathConstant.MOU_CUST + "/Approval";
    public static MOU_CUST_APPRV_GENERAL = PathConstant.MOU_CUST + "/ApprovalGeneral";
    public static MOU_CUST_APPRV_FCTR = PathConstant.MOU_CUST + "/ApprovalFactoring";
    public static MOU_CUST_REQ_ADD_COLL = PathConstant.MOU_CUST + "/RequestAddColl";
    public static MOU_CUST_INQUIRY = PathConstant.MOU_CUST + "/Inquiry";
    public static MOU_CUST_CANCEL = PathConstant.MOU_CUST + "/Cancel";
    public static MOU_CUST_OUTSTANDING_TC = PathConstant.MOU_CUST + "/OutstandingTC";
    public static MOU_CUST_OUTSTANDING_TC_PAGING = PathConstant.MOU_CUST_OUTSTANDING_TC + "/" + PathConstant.PAGING;
    public static MOU_CUST_OUTSTANDING_TC_DETAIL = PathConstant.MOU_CUST_OUTSTANDING_TC + "/" + PathConstant.DETAIL;
    public static MOU_EXECUTION = "Execution";
    public static MOU_EXECUTION_PAGING = PathConstant.MOU_EXECUTION + "/" + PathConstant.PAGING;
    public static MOU_EXECUTION_DETAIL = PathConstant.MOU_EXECUTION + "/" + PathConstant.DETAIL;
    public static MOU_DUP_CHECK = "DuplicateCheck";
    public static MOU_DUP_CHECK_PAGING = PathConstant.MOU_DUP_CHECK + "/" + PathConstant.PAGING;
    public static MOU_DUP_CHECK_SIMILAR_PERSONAL = PathConstant.MOU_DUP_CHECK + "/SimilarPersonal";
    public static MOU_DUP_CHECK_SIMILAR_COY = PathConstant.MOU_DUP_CHECK + "/SimilarCompany";
    public static MOU_DUP_CHECK_EXIST_PERSONAL = PathConstant.MOU_DUP_CHECK + "/ExistingPersonal";
    public static MOU_DUP_CHECK_EXIST_COY = PathConstant.MOU_DUP_CHECK + "/ExistingCompany";
    public static MOU_EDIT_CUST_PAGING = "EditMouCustomer/" + PathConstant.PAGING;
    public static MOU_TEST_UPLOAD = "TestUpload";
    public static MOU_VIEW = "MouView";
    public static MOU_FREEZE = "FreezeUnfreeze";
    public static MOU_FREEZE_PAGING = PathConstant.MOU_FREEZE + "/" + PathConstant.PAGING;
    public static MOU_FREEZE_DETAIL = PathConstant.MOU_FREEZE + "/" + PathConstant.DETAIL;
    public static MOU_FREEZE_INQUIRY = PathConstant.MOU_FREEZE + "/" + PathConstant.INQUIRY;
    public static MOU_FREEZE_VIEW = PathConstant.MOU_FREEZE + "/" + PathConstant.VIEW;
    public static MOU_FREEZE_APV = "FreezeUnfreezeApv";
    public static MOU_FREEZE_APV_PAGING = PathConstant.MOU_FREEZE_APV + "/" + PathConstant.PAGING;
    public static MOU_FREEZE_APV_DETAIL = PathConstant.MOU_FREEZE_APV + "/" + PathConstant.DETAIL;
    public static CHANGE_MOU_REQ = "ChangeMouRequest";
    public static CHANGE_MOU_REQ_PAGING = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.PAGING;
    public static CHANGE_MOU_REQ_DETAIL = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL;
    public static CHANGE_MOU_REQ_DETAIL_CUST = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL + "/" + PathConstant.MOU_CUSTOMER; 
    public static CHANGE_MOU_REQ_DETAIL_CUST_TYPE = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL + "/Customer/:MOUType";
    public static CHANGE_MOU = "ChangeMou";
    public static CHANGE_MOU_INQUIRY = PathConstant.CHANGE_MOU + "/" + PathConstant.INQUIRY;
    public static CHANGE_MOU_CANCEL = PathConstant.CHANGE_MOU + "/" + PathConstant.CANCEL;
    public static CHANGE_MOU_EXEC_PAGING = PathConstant.CHANGE_MOU + "/ExecPaging";
    public static CHANGE_MOU_EXEC_DETAIL = PathConstant.CHANGE_MOU + "/ExecDetail";
    public static CHANGE_MOU_CUST_ASSET = PathConstant.CHANGE_MOU + "/CustAsset";
    public static CHANGE_MOU_RVW_PAGING = PathConstant.CHANGE_MOU + "/ReviewPaging";
    public static CHANGE_MOU_RVW_DETAIL_GEN = PathConstant.CHANGE_MOU + "/ReviewDetailGen";
    public static CHANGE_MOU_RVW_DETAIL_FCTR = PathConstant.CHANGE_MOU + "/ReviewDetailFctr";
    public static CHANGE_MOU_RVW_DETAIL_FIN = PathConstant.CHANGE_MOU + "/ReviewFinancing";
    public static CHANGE_MOU_APV_PAGING = PathConstant.CHANGE_MOU + "/ApvPaging";
    public static CHANGE_MOU_APV_DETAIL_GEN = PathConstant.CHANGE_MOU + "/ApvDetailGen";
    public static CHANGE_MOU_APV_DETAIL_FCTR = PathConstant.CHANGE_MOU + "/ApvDetailFctr";
    public static CHANGE_MOU_APV_DETAIL_FIN = PathConstant.CHANGE_MOU + "/ApvDetailFinancing";
    public static CHANGE_MOU_RTN_PAGING = PathConstant.CHANGE_MOU + "/ReturnPaging";
    public static CHANGE_MOU_RTN_DETAIL = PathConstant.CHANGE_MOU + "/ReturnDetail";
    public static CHANGE_MOU_REQ_ADD_COLL = PathConstant.CHANGE_MOU + "/RequestAddColl";
    public static CHANGE_MOU_CUST_ASSET_DETAIL = PathConstant.CHANGE_MOU_CUST_ASSET + "/" + PathConstant.DETAIL;
    public static CHANGE_MOU_DETAIL = "ChangeMouDetail";
    public static CHANGE_MOU_DETAIL_GEN = PathConstant.CHANGE_MOU_DETAIL + "/General";
    public static CHANGE_MOU_DETAIL_FCTR = PathConstant.CHANGE_MOU_DETAIL + "/Factoring";
    public static CHANGE_MOU_DETAIL_DLFN = PathConstant.CHANGE_MOU_DETAIL + "/Dealerfinancing";
    //#endregion

    //#region Lead-Module
    public static LEAD_CONFIRM_CANCEL = "ConfirmCancel";
    public static LEAD = "Lead";
    public static PAGE = "Page";
    public static LEAD_PAGING = PathConstant.LEAD + "/" + PathConstant.PAGING;
    public static LEAD_INPUT = "LeadInput";
    public static LEAD_INPUT_CUST_DATA = PathConstant.LEAD_INPUT + "/CustData";
    public static LEAD_INPUT_PAGE = PathConstant.LEAD_INPUT + "/" + PathConstant.PAGE;
    public static LEAD_INPUT_MAIN_INFO = PathConstant.LEAD_INPUT + "/MainInfo";
    public static LEAD_INPUT_LEAD_DATA = PathConstant.LEAD_INPUT + "/LeadData";
    public static LEAD_FRAUD_VERIF = "FraudVerif";
    public static LEAD_FRAUD_VERIF_PAGING = PathConstant.LEAD_FRAUD_VERIF + "/" + PathConstant.PAGING;
    public static LEAD_FRAUD_VERIF_PAGE = PathConstant.LEAD_FRAUD_VERIF + "/" + PathConstant.PAGE;
    public static LEAD_INQUIRY = "LeadInquiry";
    public static LEAD_TELE_VERIF = "TeleVerif";
    public static LEAD_TELE_VERIF_PAGING = PathConstant.LEAD_TELE_VERIF + "/" + PathConstant.PAGING;
    public static LEAD_TELE_VERIF_DETAIL = PathConstant.LEAD_TELE_VERIF + "/" + PathConstant.DETAIL;
    public static LEAD_UPDATE = "LeadUpdate";
    public static LEAD_UPDATE_PAGING = PathConstant.LEAD_UPDATE + "/" + PathConstant.PAGING;
    public static LEAD_MONITORING = "Monitoring";
    public static LEAD_RVW_MONITORING = "ReviewMonitoring";
    public static LEAD_RVW_MONITORING_PAGING = PathConstant.LEAD_RVW_MONITORING + "/" + PathConstant.PAGING;
    public static LEAD_RVW_MONITORING_DETAIL = PathConstant.LEAD_RVW_MONITORING + "/" + PathConstant.DETAIL;
    public static SIMPLE_LEAD = "SimpleLead";
    public static SIMPLE_LEAD_PAGING = PathConstant.SIMPLE_LEAD + "/" + PathConstant.PAGING;
    public static SIMPLE_LEAD_DETAIL = PathConstant.SIMPLE_LEAD + "/" + PathConstant.DETAIL;
    public static SIMPLE_LEAD_MAIN_INFO = PathConstant.SIMPLE_LEAD + "/MainInfo";
    public static SIMPLE_LEAD_MONITORING = PathConstant.SIMPLE_LEAD + "/" + PathConstant.LEAD_MONITORING;
    public static SIMPLE_LEAD_RVW_MONITORING_PAGING = PathConstant.SIMPLE_LEAD + "/" + PathConstant.LEAD_RVW_MONITORING_PAGING;
    public static SIMPLE_LEAD_RVW_MONITORING_DETAIL = PathConstant.SIMPLE_LEAD + "/" + PathConstant.LEAD_RVW_MONITORING_DETAIL;
    public static SIMPLE_LEAD_FRAUD_VERIF = "SimpleLeadFraudVerif";
    public static SIMPLE_LEAD_FRAUD_VERIF_PAGING = PathConstant.SIMPLE_LEAD_FRAUD_VERIF + "/" + PathConstant.PAGING;
    public static SIMPLE_LEAD_FRAUD_VERIF_DETAIL = PathConstant.SIMPLE_LEAD_FRAUD_VERIF + "/" + PathConstant.DETAIL;
    public static SIMPLE_LEAD_UPD = "SimpleLeadUpdate";
    public static SIMPLE_LEAD_UPD_PAGING = PathConstant.SIMPLE_LEAD_UPD + "/" + PathConstant.PAGING;
    public static POTENTIAL_RO = "PotentialRo";
    public static POTENTIAL_RO_PAGING = PathConstant.POTENTIAL_RO + "/" + PathConstant.PAGING;
    public static POTENTIAL_RO_INQUIRY = PathConstant.POTENTIAL_RO + "/" + PathConstant.INQUIRY;
    public static POTENTIAL_RO_VIEW = PathConstant.POTENTIAL_RO + "/" + PathConstant.VIEW;
    public static POTENTIAL_RO_EXEC = PathConstant.POTENTIAL_RO + "/Execution";
    public static POTENTIAL_RO_TEL_OFFER = PathConstant.POTENTIAL_RO + "/RoTelemkOffer";
    public static POTENTIAL_RO_TEL_OFFER_PAGING = PathConstant.POTENTIAL_RO_TEL_OFFER + "/" + PathConstant.PAGING;
    public static POTENTIAL_RO_TEL_OFFER_DETAIL = PathConstant.POTENTIAL_RO_TEL_OFFER + "/" + PathConstant.DETAIL;
    public static POTENTIAL_RO_TEL_OFFER_VERIF = PathConstant.POTENTIAL_RO_TEL_OFFER + "/" + PathConstant.VERIF;
    //#endregion
    
    //#region LTKM-Module
    public static REQ = "Request";
    public static VERIFY = "Verify";
    public static VERIFY_PAGING = PathConstant.VERIFY + "/" + PathConstant.PAGING;
    public static VERIFY_DETAIL = PathConstant.VERIFY + "/" + PathConstant.DETAIL;
    public static VERIFY_APV = "VerifyApproval";
    public static VERIFY_APV_PAGING = PathConstant.VERIFY_APV + "/" + PathConstant.PAGING;
    public static VERIFY_APV_DETAIL = PathConstant.VERIFY_APV + "/" + PathConstant.DETAIL;
    public static RTN_HANDLING = "ReturnHandling";
    public static RTN_HANDLING_PAGING = PathConstant.RTN_HANDLING + "/" + PathConstant.PAGING;
    public static RTN_HANDLING_DETAIL = PathConstant.RTN_HANDLING + "/" + PathConstant.DETAIL;
    //#endregion

    //#region task-reassignment-Module
    public static TASK_REASSIGN_APV = "TaskReassignmentApproval";
    public static TASK_REASSIGN_APV_PAGING = PathConstant.TASK_REASSIGN_APV + "/" + PathConstant.PAGING;
    public static TASK_REASSIGN_APV_DETAIL = PathConstant.TASK_REASSIGN_APV + "/" + PathConstant.DETAIL;
    //#endregion
    
    public static TRIAL_CALC = "Trial-Calculation";

    //#region Report-Module
    public static REPORT_MARKETING = "RptMarketing";
    public static REPORT_APPLICATION_PENDING = "RptAppPending";
    public static REPORT_RENT_SUMMARY = "RptRentSummary";
    public static REPORT_RENT_DETAIL = "RptRentDetail";
    //#endregion

    //#region Inquiry-Module
    public static APP_INQUIRY = "AppInquiry";
    public static PURCHASE_TRACKING_INQUIRY = "PurchaseTrackingInquiry";
    //#endregion

    //#region Integration-Module
    public static LOS_ERR_DATA_MONITORING = "LosErrorDataMonitoring";
    //#endregion

    //#region FullPages-Module
    public static FULL_PAGES_PROFILE = "profile";
    //#endregion

    //#region ContentPages-Module
    public static CONTENT_PAGE = "Content";
    public static CONTENT_PAGE_LOGIN = "Login";
    public static CONTENT_PAGE_SELF_VERIF = "SelfVerification";
    public static CONTENT_PAGE_REQ_PASSWORD = "RequestPassword";
    public static CONTENT_PAGE_RESET_PASSWORD = "ResetPassword/:code";
    public static CONTENT_PAGE_CHANGE_PASSWORD = "ChangePassword";
    //#endregion

    //#region Dashboard-Module
    public static DASHBOARD1 = "DashBoard1";
    public static DASHBOARD2 = "DashBoard2";
    public static DASHBOARD = "Dash-Board";
    //#endregion

    //#region Content-Route
    public static CONTENT_ROUTES_PAGES = "Pages";
    public static CONTENT_ROUTES_VIEW = "View";
    //#endregion

    //#region View-Enhancing-Module
    public static VIEW_APP = "AppView";
    public static VIEW_AGRMNT = "AgrmntView";
    public static VIEW_PO = "POView";
    public static VIEW_LEAD = "Lead";
    public static VIEW_MOU_CUST = "Mou/CustView";
    public static VIEW_CHANGE_MOU = "ChangeMouView";
    public static VIEW_SRVY = "SurveyView";
    public static VIEW_CUST_EXPSR = "CustExposureView";
    public static VIEW_PHN_VERIF = "PhoneVerifView";
    public static VIEW_PURCHASE_TRACKING = "PurchaseTracking";
    public static VIEW_APP_ASSET = "AppAsset";
    public static VIEW_APP_LIST = "AppList";
    public static VIEW_PEFINDO = "Pefindo";
    //#endregion

    //#region FOU-View-Module
    public static VIEW_FOU_CUST_PERSONAL_DETAIL = "Customer/PersonalDetail";
    public static VIEW_FOU_CUST_COY_DETAIL = "Customer/CoyDetail"
    public static VIEW_FOU_VENDOR_BRANCH = "Vendor/VendorBranch";
    public static VIEW_FOU_SRVY_TASK = "Survey/SurveyTask";
    public static VIEW_FOU_SRVY_ORDER = "Survey/SurveyOrder";
    //#endregion

    //#region FOU-View-Module
public static REQUISITION_DECISION = "requisitiondecision";
    //#endregion

    //PRODUCT
    public static LR_PRODUCT = "Product";
    public static PROD_OFFERING = "ProdOffering";
    public static RTN_PAGING = "ReturnPaging";
    public static CR_VIEW = "View";
    public static VIEW_OFFERING = "Offering";
    public static VIEW_PRODUCT_HO = "ProductHO";
    public static PROD_OFFERING_PAGING = PathConstant.PROD_OFFERING + "/" + PathConstant.PAGING;
    public static PROD_OFFERING_RTN_PAGING = PathConstant.PROD_OFFERING + "/" + PathConstant.RTN_PAGING;
    public static PROD_OFFERING_ADD = PathConstant.PROD_OFFERING + "/" + PathConstant.ADD;
    public static PROD_OFFERING_ADD_DETAIL = PathConstant.PROD_OFFERING + "/" + PathConstant.ADD_DETAIL;
    public static HO_PAGING = "HOPaging";
    public static HO_RTN_PAGING = "HOReturnPaging";
    public static HO_ADD = "HOAdd";
    public static HO_ADD_DETAIL = "HOAddDetail";
    public static HO_DEACTIVATE = "HODeactivate";
    public static HO_DEACTIVATE_EDIT = PathConstant.HO_DEACTIVATE + "/" + PathConstant.EDIT;
    public static HO_VIEW = "HOView";
    public static OFFERING_VIEW = "OfferingView";
    public static HO_APPRV = "HOApproval";
    public static HO_APPRV_DETAIL = PathConstant.HO_APPRV + "/" + PathConstant.DETAIL;
    public static OFFERING_APPRV = "OfferingApproval";
    public static OFFERING_APPRV_DETAIL = PathConstant.OFFERING_APPRV + "/" + PathConstant.DETAIL;
    public static HO_DEACTIVATE_APPRV = "HODeactivateApproval";
    public static HO_DEACTIVATE_APPRV_DETAIL = PathConstant.HO_DEACTIVATE_APPRV + "/" + PathConstant.DETAIL;
    public static OFFERING_DEACTIVATE = "OfferingDeactivate";
    public static OFFERING_DEACTIVATE_EDIT = PathConstant.HO_DEACTIVATE_APPRV + "/" + PathConstant.EDIT;
    public static OFFERING_DEACTIVATE_APPRV = "OfferingDeactivateApproval";
    public static OFFERING_DEACTIVATE_APPRV_DETAIL = PathConstant.OFFERING_DEACTIVATE_APPRV + "/" + PathConstant.DETAIL;
    public static HO_REVIEW = "HOReview";
    public static HO_REVIEW_DETAIL = PathConstant.HO_REVIEW + "/" + PathConstant.DETAIL;
    public static OFFERING_REVIEW = "OfferingReview";
    public static OFFERING_REVIEW_DETAIL = PathConstant.OFFERING_REVIEW + "/" + PathConstant.DETAIL;

    //#region PEFINDO
    public static PEFINDO_VIEW = "PefindoView";
    //#endregion
}

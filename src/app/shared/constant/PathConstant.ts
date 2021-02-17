export class PathConstant {
    // Notes: data yang di CombinePath itu arti ny ada lebih dari 1 Const dan ada /

    public static CombinePath(ListPath: Array<string>): string { return ListPath.join('/'); }

    // layout-routes
    //#region layout-routes
    public static LR_DASHBOARD = "dashboard";
    public static LR_FORMS = "forms";
    public static LR_COMPNT = "components";
    public static LR_NOTIF = "notification";
    public static LR_PAGES = "pages";
    public static LR_MOU = "Mou";
    public static LR_NAP = "Nap";
    public static LR_LEAD = "Lead";
    public static LR_INQUIRY = "Inquiry";
    public static LR_INTEGRATION = "Integration";
    public static LR_BACKDOOR = "Backdoor";
    //#endregion

    //#region Common-Path
    public static VIEW = "View";
    public static PAGES = "pages";
    public static NAP1 = "NAP1";
    public static NAP2 = "NAP2";
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
    //#endregion

    //#region Form-Module
    public static BASIC = "basic";
    public static HORIZONTAL = "horizontal";
    public static HIDDEN_LABELS = "hidden-labels";
    public static FORM_ACTIONS = "form-actions";
    public static BORDERED = "bordered";
    public static STRIPED_ROWS = "striped-rows";
    public static INPUTS = "inputs";
    public static INPUT_GROUPS = "input-groups";
    public static INPUT_GRID = "input-grid";
    public static VALIDATION = "validation";
    public static WIZARD = "wizard";
    public static NGX = "ngx";
    public static ARCHWIZARD = "archwizard";
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
    //#endregion
    
    //#region Nap-CF2W
    public static CF2W_APP = "App";
    public static CF2W_ADD_FREE = "AddFree";
    public static CF2W_ADD_FIXED = "AddFixed";
    //#endregion
    
    //#region Nap-Cust-Compl
    public static CUST_COMPL_PRSNL = PathConstant.CombinePath([PathConstant.DETAIL, PathConstant.PERSONAL]);
    public static CUST_COMPL_COY = PathConstant.CombinePath([PathConstant.DETAIL, PathConstant.COY]);
    //#endregion

    //#region Nap-FL4W
    public static FL4W_VIEW_AGRMNT = "ViewAgrmnt";
    public static FL4W_VIEW_INS = "ViewInsurance";
    public static FL4W_VIEW_AGRMNT_FL4W = "ViewAgrmntFL4W";
    public static FL4W_VIEW_DO = "ViewDo";
    public static FL4W_VIEW_DO_DETAIL = PathConstant.CombinePath([PathConstant.FL4W_VIEW_DO, PathConstant.DETAIL]);
    public static FL4W_VIEW_DO_DETAIL_ASSET = PathConstant.FL4W_VIEW_DO + "/DetailAsset";
    //#endregion

    //#region Nap-Main-Data
    public static NAP1_PAGING = PathConstant.CombinePath([PathConstant.NAP1, PathConstant.PAGING]);
    public static NAP1_ADD = PathConstant.CombinePath([PathConstant.NAP1, PathConstant.ADD]);
    public static NAP2_PAGING = PathConstant.CombinePath([PathConstant.NAP2, PathConstant.PAGING]);
    //#endregion
    
    //#region Nap-Sharing-Page
    public static NAP_FROM_LEAD_PAGING = PathConstant.CombinePath([PathConstant.NAP_FROM_LEAD, PathConstant.PAGING]);
    public static NAP_FROM_LEAD_DETAIL = PathConstant.CombinePath([PathConstant.NAP_FROM_LEAD, PathConstant.DETAIL]);
    public static NAP_FROM_MOU_PAGING = PathConstant.CombinePath([PathConstant.NAP_FROM_MOU, PathConstant.PAGING]);
    public static NAP_FROM_MOU_DETAIL = PathConstant.CombinePath([PathConstant.NAP_FROM_MOU, PathConstant.DETAIL]);
    public static NAP1_FROM_LEAD_PAGING = PathConstant.CombinePath([PathConstant.NAP1_FROM_LEAD, PathConstant.PAGING]);
    public static NAP1_FROM_LEAD_DETAIL = PathConstant.CombinePath([PathConstant.NAP1_FROM_LEAD, PathConstant.DETAIL]);
    //#endregion

    //#region Nap-View
    public static APP_VIEW = "AppView";
    public static APP_VIEW_COLL_DATA_VIEW = PathConstant.APP_VIEW + "/CollateralDataView";
    public static AGRMNT_VIEW = "AgrmntView";
    public static PO_VIEW = "POView";
    //#endregion

    //#region Nap-Additional-Prcs
    public static CRD_APPRVL_RES_EXT = "CreditApprovalResultExt";
    public static CRD_APPRVL_RES_EXT_PAGING = PathConstant.CombinePath([PathConstant.CRD_APPRVL_RES_EXT, PathConstant.PAGING]);
    public static CRD_APPRVL_RES_EXT_DETAIL = PathConstant.CombinePath([PathConstant.CRD_APPRVL_RES_EXT, PathConstant.DETAIL]);
    public static CRD_APPRVL_RES_EXT_ASSET_INQUIRY = PathConstant.CRD_APPRVL_RES_EXT + "/AssetInquiry";
    public static OUTSTANDING_TC = "OutstandingTC";
    public static OUTSTANDING_TC_PAGING = PathConstant.CombinePath([PathConstant.OUTSTANDING_TC, PathConstant.PAGING]);
    public static OUTSTANDING_TC_DETAIL = PathConstant.CombinePath([PathConstant.OUTSTANDING_TC, PathConstant.DETAIL]);
    public static RETURN_HANDLING = "ReturnHandling";
    public static RETURN_HANDLING_PAGING = PathConstant.CombinePath([PathConstant.RETURN_HANDLING, PathConstant.PAGING]);
    public static RETURN_HANDLING_DETAIL = PathConstant.CombinePath([PathConstant.RETURN_HANDLING, PathConstant.DETAIL]);
    public static RETURN_HANDLING_COMM_RSV_FUND_PAGING = PathConstant.CombinePath([PathConstant.RETURN_HANDLING, PathConstant.COMM_RSV_FUND, PathConstant.PAGING]);
    public static RETURN_HANDLING_EDIT_APP_PAGING = PathConstant.RETURN_HANDLING + "/EditAppPaging";
    public static RETURN_HANDLING_SRVY = PathConstant.RETURN_HANDLING + "/Survey";
    public static APP_DUP_CHECK = "AppDupCheck";
    public static APP_EXIST_DATA = "ApplicantExistingData";
    public static APP_DUP_CHECK_PAGING = PathConstant.CombinePath([PathConstant.APP_DUP_CHECK, PathConstant.PAGING]);
    public static APP_DUP_CHECK_PERSONAL = PathConstant.CombinePath([PathConstant.APP_DUP_CHECK, PathConstant.PERSONAL]);
    public static APP_DUP_CHECK_COY = PathConstant.CombinePath([PathConstant.APP_DUP_CHECK, PathConstant.COY]);
    public static APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL = PathConstant.CombinePath([PathConstant.APP_DUP_CHECK, PathConstant.APP_EXIST_DATA, PathConstant.PERSONAL]);
    public static APP_DUP_CHECK_APP_EXIST_DATA_COY = PathConstant.CombinePath([PathConstant.APP_DUP_CHECK, PathConstant.APP_EXIST_DATA, PathConstant.COY]);
    public static RETURN_HANDLING_PHN_VRF = "ReturnHandlingPhoneVerif";
    public static RETURN_HANDLING_PHN_VRF_PAGING = PathConstant.CombinePath([PathConstant.RETURN_HANDLING_PHN_VRF, PathConstant.PAGING]);
    public static RETURN_HANDLING_COLL = "ReturnHandlingCollateral";
    public static RETURN_HANDLING_COLL_PAGING = PathConstant.CombinePath([PathConstant.RETURN_HANDLING_COLL, PathConstant.PAGING]);
    public static RETURN_HANDLING_COLL_DETAIL = PathConstant.CombinePath([PathConstant.RETURN_HANDLING_COLL, PathConstant.DETAIL]);
    public static RETURN_HANDLING_COLL_EDIT = PathConstant.CombinePath([PathConstant.RETURN_HANDLING_COLL, PathConstant.EDIT]);
    public static COPY_CANCEL_APP = "CopyCancelledApplication";
    public static RETURN_HANDLING_ADD_TC = "ReturnHandlingAddTc";
    public static RETURN_HANDLING_ADD_TC_PAGING = PathConstant.CombinePath([PathConstant.RETURN_HANDLING_ADD_TC, PathConstant.PAGING]);
    public static RETURN_HANDLING_ADD_TC_DETAIL = PathConstant.CombinePath([PathConstant.RETURN_HANDLING_ADD_TC, PathConstant.DETAIL]);
    public static APP_DUP_CHECK_MAIN_DATA = "AppDupCheckMainData";
    public static APP_DUP_CHECK_MAIN_DATA_PAGING = PathConstant.CombinePath([PathConstant.APP_DUP_CHECK_MAIN_DATA, PathConstant.PAGING]);
    public static APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST = PathConstant.APP_DUP_CHECK_MAIN_DATA + "/SubjList";
    public static APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH = PathConstant.APP_DUP_CHECK_MAIN_DATA + "/SubjMatch";
    //#endregion

    //#region Nap-Admin-Prcs
    public static PO = "PurchaseOrder";
    public static PO_EXT = "PO";
    public static NEW_PO = "NewPurchaseOrder";
    public static PO_PAGING = PathConstant.CombinePath([PathConstant.PO, PathConstant.PAGING]);
    public static PO_PO_EXT = PathConstant.CombinePath([PathConstant.PO, PathConstant.PO_EXT]);
    public static PO_PO_EXT_DETAIL = PathConstant.CombinePath([PathConstant.PO_PO_EXT, PathConstant.DETAIL]);
    public static NEW_PO_PAGING = PathConstant.CombinePath([PathConstant.NEW_PO, PathConstant.PAGING]);
    public static NEW_PO_DETAIL = PathConstant.CombinePath([PathConstant.NEW_PO, PathConstant.DETAIL]);
    public static DO = "DeliveryOrder";
    public static DO_PAGING = PathConstant.CombinePath([PathConstant.DO, PathConstant.PAGING]);
    public static DO_DETAIL = PathConstant.CombinePath([PathConstant.DO, PathConstant.DETAIL]);
    public static CUST_CONFIRM = "CustConfirmation";
    public static CUST_CONFIRM_PAGING = PathConstant.CombinePath([PathConstant.CUST_CONFIRM, PathConstant.PAGING]);
    public static CUST_CONFIRM_DETAIL = PathConstant.CombinePath([PathConstant.CUST_CONFIRM, PathConstant.DETAIL]);
    public static SUBJ = "Subj";
    public static CUST_CONFIRM_SUBJ_DETAIL = PathConstant.CombinePath([PathConstant.CUST_CONFIRM, PathConstant.SUBJ, PathConstant.DETAIL]);
    public static CUST_CONFIRM_SUBJ_VIEW = PathConstant.CombinePath([PathConstant.CUST_CONFIRM, PathConstant.SUBJ, PathConstant.VIEW]);
    public static PGL = "PreGoLive";
    public static PGL_PAGING = PathConstant.CombinePath([PathConstant.PGL, PathConstant.PAGING]);
    public static PGL_DETAIL = PathConstant.CombinePath([PathConstant.PGL, PathConstant.DETAIL]);
    public static PGL_REQ_APPRVL = PathConstant.PGL + "/RequestApproval";
    public static PGL_APPRVL_PAGING = PathConstant.CombinePath([PathConstant.PGL, PathConstant.APPRV, PathConstant.PAGING]);
    public static PGL_APPRVL_DETAIL = PathConstant.CombinePath([PathConstant.PGL, PathConstant.APPRV, PathConstant.DETAIL]);
    public static AGRMNT_CANCEL = "AgreementCancellation";
    public static AGRMNT_CANCEL_PAGING = PathConstant.CombinePath([PathConstant.AGRMNT_CANCEL, PathConstant.PAGING]);
    public static AGRMNT_CANCEL_DETAIL = PathConstant.CombinePath([PathConstant.AGRMNT_CANCEL, PathConstant.DETAIL]);
    public static AGRMNT_ACT = "AgrmntActivation";
    public static AGRMNT_ACT_PAGING = PathConstant.CombinePath([PathConstant.AGRMNT_ACT, PathConstant.PAGING]);
    public static AGRMNT_ACT_DETAIL = PathConstant.CombinePath([PathConstant.AGRMNT_ACT, PathConstant.DETAIL]);
    public static OFFERING_VALIDITY_APPRV = "OfferingValidityApproval";
    public static OFFERING_VALIDITY_APPRV_PAGING = PathConstant.CombinePath([PathConstant.OFFERING_VALIDITY_APPRV, PathConstant.PAGING]);
    public static OFFERING_VALIDITY_APPRV_DETAIL = PathConstant.CombinePath([PathConstant.OFFERING_VALIDITY_APPRV, PathConstant.DETAIL]);
    public static NAP_DOC_SIGNER = "DocumentSigner";
    public static NAP_DOC_SIGNER_PAGING = PathConstant.CombinePath([PathConstant.NAP_DOC_SIGNER, PathConstant.PAGING]);
    public static NAP_DOC_SIGNER_DETAIL = PathConstant.CombinePath([PathConstant.NAP_DOC_SIGNER, PathConstant.DETAIL]);
    public static NAP_CFNA_DOC_SIGNER = "CfnaDocumentSigner";
    public static NAP_CFNA_DOC_SIGNER_PAGING = PathConstant.CombinePath([PathConstant.NAP_CFNA_DOC_SIGNER, PathConstant.PAGING]);
    public static NAP_CFNA_DOC_SIGNER_DETAIL = PathConstant.CombinePath([PathConstant.NAP_CFNA_DOC_SIGNER, PathConstant.DETAIL]);
    public static INVOICE = "Invoice";
    public static INVOICE_DETAIL = PathConstant.CombinePath([PathConstant.INVOICE, PathConstant.DETAIL]);
    public static NAP_DOC_PRINT = "DocPrint";
    public static NAP_DOC_PRINT_PAGING = PathConstant.CombinePath([PathConstant.NAP_DOC_PRINT, PathConstant.PAGING]);
    public static NAP_DOC_PRINT_VIEW = PathConstant.CombinePath([PathConstant.NAP_DOC_PRINT, PathConstant.VIEW]);
    public static DO_MULTI_ASSET = "DeliveryOrderMultiAsset";
    public static DO_MULTI_ASSET_PAGING = PathConstant.CombinePath([PathConstant.DO_MULTI_ASSET, PathConstant.PAGING]);
    public static DO_MULTI_ASSET_DETAIL = PathConstant.CombinePath([PathConstant.DO_MULTI_ASSET, PathConstant.DETAIL]);
    public static INVOICE_VERIF = "InvoiceVerif";
    public static INVOICE_VERIF_PAGING = PathConstant.CombinePath([PathConstant.INVOICE_VERIF, PathConstant.PAGING]);
    public static INVOICE_VERIF_DETAIL = PathConstant.CombinePath([PathConstant.INVOICE_VERIF, PathConstant.DETAIL]);
    public static DOC_CHECK_LIST = "DocChecklist";
    public static DOC_CHECK_LIST_PAGING = PathConstant.CombinePath([PathConstant.DOC_CHECK_LIST, PathConstant.PAGING]);
    public static DOC_CHECK_LIST_DETAIL = PathConstant.CombinePath([PathConstant.DOC_CHECK_LIST, PathConstant.DETAIL]);
    public static DOC_CHECK_LIST_REQ_APPRV = PathConstant.PGL + "/RequestApproval";
    public static DOC_CHECK_LIST_APPRV = PathConstant.CombinePath([PathConstant.DOC_CHECK_LIST, PathConstant.APPRV]);
    public static DOC_CHECK_LIST_APPRV_PAGING = PathConstant.CombinePath([PathConstant.DOC_CHECK_LIST_APPRV, PathConstant.PAGING]);
    public static DOC_CHECK_LIST_APPRV_DETAIL = PathConstant.CombinePath([PathConstant.DOC_CHECK_LIST_APPRV, PathConstant.DETAIL]);
    //#endregion
    
    //#region Nap-Crd-Prcs
    public static COMM_RSV_FUND_PAGING = PathConstant.CombinePath([PathConstant.COMM_RSV_FUND, PathConstant.PAGING]);
    public static COMM_RSV_FUND_DETAIL = PathConstant.CombinePath([PathConstant.COMM_RSV_FUND, PathConstant.DETAIL]);
    public static PHN_VRF = "PhoneVerification";
    public static SUBJECT = "Subject";
    public static PHN_VRF_PAGING = PathConstant.CombinePath([PathConstant.PHN_VRF, PathConstant.PAGING]);
    public static PHN_VRF_SUBJECT = PathConstant.CombinePath([PathConstant.PHN_VRF, PathConstant.SUBJECT]);
    public static PHN_VRF_SUBJECT_VIEW = PathConstant.CombinePath([PathConstant.PHN_VRF_SUBJECT, PathConstant.VIEW]);
    public static PHN_VRF_SUBJECT_VERIF = PathConstant.CombinePath([PathConstant.PHN_VRF_SUBJECT, PathConstant.VERIF]);
    public static CRD_INVESTIGATION = "CreditInvestigation";
    public static CRD_INVESTIGATION_PAGING = PathConstant.CombinePath([PathConstant.CRD_INVESTIGATION, PathConstant.PAGING]);
    public static CRD_INVESTIGATION_DETAIL = PathConstant.CombinePath([PathConstant.CRD_INVESTIGATION, PathConstant.DETAIL]);
    public static NEW_CRD_INVESTIGATION = "NewCreditInvestigation";
    public static NEW_CRD_INVESTIGATION_PAGING = PathConstant.CombinePath([PathConstant.NEW_CRD_INVESTIGATION, PathConstant.PAGING]);
    public static NEW_CRD_INVESTIGATION_DETAIL = PathConstant.CombinePath([PathConstant.NEW_CRD_INVESTIGATION, PathConstant.DETAIL]);
    public static CRD_REVIEW = "CreditReview";
    public static CRD_REVIEW_PAGING = PathConstant.CombinePath([PathConstant.CRD_REVIEW, PathConstant.PAGING]);
    public static CRD_REVIEW_MAIN = PathConstant.CombinePath([PathConstant.CRD_REVIEW, PathConstant.MAIN]);
    public static CRD_REVIEW_PROTOTYPE = "CreditReviewPrototype";
    public static CRD_REVIEW_PROTOTYPE_PAGING = PathConstant.CombinePath([PathConstant.CRD_REVIEW_PROTOTYPE, PathConstant.PAGING]);
    public static CRD_REVIEW_PROTOTYPE_DETAIL = PathConstant.CombinePath([PathConstant.CRD_REVIEW_PROTOTYPE, PathConstant.DETAIL]);
    public static CRD_REVIEW_CFNA = "CreditReviewCfna";
    public static CRD_REVIEW_CFNA_PAGING = PathConstant.CombinePath([PathConstant.CRD_REVIEW_CFNA, PathConstant.PAGING]);
    public static CRD_REVIEW_CFNA_MAIN = PathConstant.CombinePath([PathConstant.CRD_REVIEW_CFNA, PathConstant.MAIN]);
    public static CRD_APPRV = "CreditApproval";
    public static CRD_APPRV_PAGING = PathConstant.CombinePath([PathConstant.CRD_APPRV, PathConstant.PAGING]);
    public static CRD_APPRV_DETAIL = PathConstant.CombinePath([PathConstant.CRD_APPRV, PathConstant.DETAIL]);
    public static CRD_APPRV_CFNA = "CreditApprovalCfna";
    public static CRD_APPRV_CFNA_PAGING = PathConstant.CombinePath([PathConstant.CRD_APPRV_CFNA, PathConstant.PAGING]);
    public static CRD_APPRV_CFNA_DETAIL = PathConstant.CombinePath([PathConstant.CRD_APPRV_CFNA, PathConstant.DETAIL]);
    public static FRAUD_DETECTION = "FraudDetection";
    public static FRAUD_DETECTION_PAGING = PathConstant.CombinePath([PathConstant.FRAUD_DETECTION, PathConstant.PAGING]);
    public static FRAUD_DETECTION_DETAIL = PathConstant.CombinePath([PathConstant.FRAUD_DETECTION, PathConstant.DETAIL]);
    public static FRAUD_DETECTION_NEG_ASSET_DUP_CHECK = PathConstant.FRAUD_DETECTION + "/NegativeAssetDuplicateChecking";
    public static FRAUD_VERIF_MULTI_ASSET = "FraudVerifMultiAsset";
    public static FRAUD_VERIF_MULTI_ASSET_PAGING = PathConstant.CombinePath([PathConstant.FRAUD_VERIF_MULTI_ASSET, PathConstant.PAGING]);
    public static CRD_INQUIRY = "CreditInquiry";
    public static CRD_INQUIRY_PAGING = PathConstant.CombinePath([PathConstant.CRD_INQUIRY, PathConstant.PAGING]);
    public static CRD_REVIEW_CR = "CreditReviewCr";
    public static CRD_REVIEW_CR_PAGING = PathConstant.CombinePath([PathConstant.CRD_REVIEW_CR, PathConstant.PAGING]);
    public static CRD_REVIEW_CR_DETAIL = PathConstant.CombinePath([PathConstant.CRD_REVIEW_CR, PathConstant.DETAIL]);
    public static CRD_APPRV_CR = "CreditApproval";
    public static CRD_APPRV_CR_PAGING = PathConstant.CombinePath([PathConstant.CRD_APPRV_CR, PathConstant.PAGING]);
    public static CRD_APPRV_CR_DETAIL = PathConstant.CombinePath([PathConstant.CRD_APPRV_CR, PathConstant.DETAIL]);
    //#endregion
    
    //#region Nap-App_Prcs
    public static APP_RVW = "ApplicationReview";
    public static APP_RVW_PAGING = PathConstant.CombinePath([PathConstant.APP_RVW, PathConstant.PAGING]);
    public static APP_RVW_DETAIL = PathConstant.CombinePath([PathConstant.APP_RVW, PathConstant.DETAIL]);
    //#endregion

    //#region MOU-Module
    public static MOU_DOC_SIGNER = "DocSigner";
    public static MOU_DOC_SIGNER_PAGING = PathConstant.CombinePath([PathConstant.MOU_DOC_SIGNER, PathConstant.PAGING]);
    public static MOU_DOC_SIGNER_DETAIL = PathConstant.CombinePath([PathConstant.MOU_DOC_SIGNER, PathConstant.DETAIL]);
    public static MOU_REQ = "Request";
    public static MOU_REQ_PAGING = PathConstant.CombinePath([PathConstant.MOU_REQ, PathConstant.PAGING]);
    public static MOU_REQ_DETAIL = PathConstant.CombinePath([PathConstant.MOU_REQ, PathConstant.DETAIL]);
    public static MOU_CUST_DOC = "CustomerDoc";
    public static MOU_CUST_DOC_PAGING = PathConstant.CombinePath([PathConstant.MOU_CUST_DOC, PathConstant.PAGING]);
    public static MOU_CUST_DOC_DETAIL = PathConstant.CombinePath([PathConstant.MOU_CUST_DOC, PathConstant.DETAIL]);
    public static MOU_CUST_LEGAL_RVW = "CustomerLegalReview";
    public static MOU_CUST_LEGAL_RVW_PAGING = PathConstant.CombinePath([PathConstant.MOU_CUST_LEGAL_RVW, PathConstant.PAGING]);
    public static MOU_CUST_LEGAL_RVW_DETAIL = PathConstant.CombinePath([PathConstant.MOU_CUST_LEGAL_RVW, PathConstant.DETAIL]);
    public static MOU_CUST = "Cust";
    public static MOU_CUST_RVW_PAGING = PathConstant.MOU_CUST + "/ReviewPaging";
    public static MOU_CUST_RVW_GENERAL = PathConstant.MOU_CUST + "/ReviewGeneral";
    public static MOU_CUST_RVW_FCTR = PathConstant.MOU_CUST + "/ReviewFactoring";
    public static MOU_CUST_APPRV = PathConstant.MOU_CUST + "/Approval";
    public static MOU_CUST_APPRV_GENERAL = PathConstant.MOU_CUST + "/ApprovalGeneral";
    public static MOU_CUST_APPRV_FCTR = PathConstant.MOU_CUST + "/ApprovalFactoring";
    public static MOU_CUST_REQ_ADD_COLL = PathConstant.MOU_CUST + "/RequestAddColl";
    public static MOU_CUST_INQUIRY = PathConstant.MOU_CUST + "/Inquiry";
    public static MOU_CUST_CANCEL = PathConstant.MOU_CUST + "/Cancel";
    public static MOU_CUST_OUTSTANDING_TC = PathConstant.MOU_CUST + "/OutstandingTC";
    public static MOU_CUST_OUTSTANDING_TC_PAGING = PathConstant.CombinePath([PathConstant.MOU_CUST_OUTSTANDING_TC, PathConstant.PAGING]);
    public static MOU_CUST_OUTSTANDING_TC_DETAIL = PathConstant.CombinePath([PathConstant.MOU_CUST_OUTSTANDING_TC, PathConstant.DETAIL]);
    public static MOU_UNAUTHORIZED_PAGE = "UnauthorizedPage";
    public static MOU_EXECUTION = "Execution";
    public static MOU_EXECUTION_PAGING = PathConstant.CombinePath([PathConstant.MOU_EXECUTION, PathConstant.PAGING]);
    public static MOU_EXECUTION_DETAIL = PathConstant.CombinePath([PathConstant.MOU_EXECUTION, PathConstant.DETAIL]);
    public static MOU_DUP_CHECK = "DuplicateCheck";
    public static MOU_DUP_CHECK_PAGING = PathConstant.CombinePath([PathConstant.MOU_DUP_CHECK, PathConstant.PAGING]);
    public static MOU_DUP_CHECK_SIMILAR_PERSONAL = PathConstant.MOU_DUP_CHECK + "/SimilarPersonal";
    public static MOU_DUP_CHECK_SIMILAR_COY = PathConstant.MOU_DUP_CHECK + "/SimilarCompany";
    public static MOU_DUP_CHECK_EXIST_PERSONAL = PathConstant.MOU_DUP_CHECK + "/ExistingPersonal";
    public static MOU_DUP_CHECK_EXIST_COY = PathConstant.MOU_DUP_CHECK + "/ExistingCompany";
    public static MOU_EDIT_CUST_PAGING = PathConstant.CombinePath(["EditMouCustomer", PathConstant.PAGING]);
    public static MOU_TEST_UPLOAD = "TestUpload";
    //#endregion

    //#region Lead-Module
    public static LEAD_CONFIRM_CANCEL = "ConfirmCancel";
    public static LEAD = "Lead";
    public static PAGE = "Page";
    public static LEAD_PAGING = PathConstant.CombinePath([PathConstant.LEAD, PathConstant.PAGING]);
    public static LEAD_INPUT = "LeadInput";
    public static LEAD_INPUT_CUST_DATA = PathConstant.LEAD_INPUT + "/CustData";
    public static LEAD_INPUT_PAGE = PathConstant.CombinePath([PathConstant.LEAD_INPUT, PathConstant.PAGE]);
    public static LEAD_INPUT_MAIN_INFO = PathConstant.LEAD_INPUT + "/MainInfo";
    public static LEAD_INPUT_LEAD_DATA = PathConstant.LEAD_INPUT + "/LeadData";
    public static LEAD_FRAUD_VERIF = "FraudVerif";
    public static LEAD_FRAUD_VERIF_PAGING = PathConstant.CombinePath([PathConstant.LEAD_FRAUD_VERIF, PathConstant.PAGING]);
    public static LEAD_FRAUD_VERIF_PAGE = PathConstant.CombinePath([PathConstant.LEAD_FRAUD_VERIF, PathConstant.PAGE]);
    public static LEAD_INQUIRY = "LeadInquiry";
    public static LEAD_TELE_VERIF = "TeleVerif";
    public static LEAD_TELE_VERIF_PAGING = PathConstant.CombinePath([PathConstant.LEAD_TELE_VERIF, PathConstant.PAGING]);
    public static LEAD_TELE_VERIF_DETAIL = PathConstant.CombinePath([PathConstant.LEAD_TELE_VERIF, PathConstant.DETAIL]);V
    public static LEAD_UPDATE = "LeadUpdate";
    public static LEAD_UPDATE_PAGING = PathConstant.CombinePath([PathConstant.LEAD_UPDATE, PathConstant.PAGING]);
    public static LEAD_MONITORING = "Monitoring";
    public static LEAD_RVW_MONITORING = "ReviewMonitoring";
    public static LEAD_RVW_MONITORING_PAGING = PathConstant.CombinePath([PathConstant.LEAD_RVW_MONITORING, PathConstant.PAGING]);
    public static LEAD_RVW_MONITORING_DETAIL = PathConstant.CombinePath([PathConstant.LEAD_RVW_MONITORING, PathConstant.DETAIL]);
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
    public static CONTENT_PAGE = "content";
    public static CONTENT_PAGE_LOGIN = "login";
    public static CONTENT_PAGE_SELF_VERIF = "SelfVerification";
    public static CONTENT_PAGE_REQ_PASSWORD = "RequestPassword";
    public static CONTENT_PAGE_RESET_PASSWORD = "ResetPassword/:code";
    //#endregion

    //#region Dashboard-Module
    public static DASHBOARD1 = "dashboard1";
    public static DASHBOARD2 = "dashboard2";
    public static DASHBOARD = "dash-board";
    //#endregion

    //#region Content-Route
    public static CONTENT_ROUTES_PAGES = "pages";
    public static CONTENT_ROUTES_VIEW = "View";
    //#endregion

    //#region View-Enhancing-Module
    public static VIEW_APP = "AppView";
    public static VIEW_AGRMNT = "AgrmntView";
    public static VIEW_PO = "POView";
    public static VIEW_LEAD = "Lead";
    public static VIEW_MOU_CUST = "Mou/CustView";
    public static VIEW_SRVY = "SurveyView";
    public static VIEW_CUST_EXPSR = "CustExposureView";
    public static VIEW_PHN_VERIF = "PhoneVerifView";
    public static VIEW_PURCHASE_TRACKING = "PurchaseTracking";
    public static VIEW_APP_ASSET = "AppAsset";
    //#endregion

    //#region FOU-View-Module
    public static VIEW_FOU_CUST_PERSONAL_DETAIL = "Customer/PersonalDetail";
    public static VIEW_FOU_OFFERING = "Offering";
    public static VIEW_FOU_VENDOR_BRANCH = "Vendor/VendorBranch";
    public static VIEW_FOU_SRVY_TASK = "Survey/SurveyTask";
    public static VIEW_FOU_SRVY_ORDER = "Survey/SurveyOrder";
    //#endregion
}
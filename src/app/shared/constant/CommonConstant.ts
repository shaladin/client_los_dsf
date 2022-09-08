import { CurrencyMaskInputMode } from "ngx-currency";

export class CommonConstant {
  
  // REGEX
  public static regexAPI = "\\/[v,V][1-9]\\d*(\\.[1-9]\\d*)*";
  public static regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";

  //FORM
  public static INVALID_FORM = "INVALID";

  // ADD EDIT DELETE UPDATE
  public static ADD = 'Add';
  public static EDIT = 'Edit';
  public static DELETE = 'Delete';
  public static UPDATE = 'Update';
  public static CANCEL = 'Cancel';
  public static REQ = 'request';
  public static RTN = 'return';
  
  // Behaviour
  public static DEFAULT = 'DEF';

  // MOU
  public static MOU_FRZ_REQ = 'REQ';
  public static MOU_FRZ_APV = 'APV';

  // PercentageAmt
  public static InputTypeAmt = 'AMT';
  public static InputTypePrcnt = 'PRCNT';

  // BOOLEAN CONDITION
  public static TRUE = "true";
  public static FALSE = "false";

  // REF CHANGE ITEM STAT
  public static ChangeItemCodeAssetDataSerialNo1 = 'ASSET_DATA_SERIAL_NO_1';
  public static ChangeItemCodeAssetDataSerialNo2 = 'ASSET_DATA_SERIAL_NO_2';
  public static ChangeItemCodeAssetDataSerialNo3 = 'ASSET_DATA_SERIAL_NO_3';
  public static ChangeItemCodeAssetDataSerialNo4 = 'ASSET_DATA_SERIAL_NO_4';
  public static ChangeItemCodeAssetDataSerialNo5 = 'ASSET_DATA_SERIAL_NO_5';
  public static ChangeItemCodeAssetDataManufacturYear = 'ASSET_DATA_MANUFACTURE_YEAR';
  public static ChangeItemCodeAssetDataColor = 'ASSET_DATA_COLOR';

  //PHN VERF SUBJECT DATA
  public static PHN_VERF_RES_SCS = "SCS";
  public static PHN_VERF_RES_FAIL = "FAIL";

  //Application Item
  public static MENU = "Menu";
  public static ENVIRONMENT_MODULE = 'EnvironmentModule';
  public static USER_ACCESS = "UserAccess";
  public static USER_NAME = "UserName";
  public static USER_NAME_LOCAL_STORAGE = "Username";
  public static OFFICE_CODE = "OfficeCode";
  public static AREA_CODE = "AreaCode";
  public static ROLE_CODE = "RoleCode";
  public static CURRENT_USER_CONTEXT = "currentUserContext"
  public static PAGE_ACCESS = "PageAccess";
  public static BUSINESS_DT = "BusinessDt";
  public static BUSINESS_DATE = "BusinessDate";
  public static TOKEN = "XSRF-TOKEN";
  public static BIZ_TEMPLATE_CODE = "BizTemplateCode";
  public static BUSINESS_DATE_RAW = "BusinessDateRaw";
  public static VERSION = "Version";
  public static LAST_ACCESS_TIME = "LastAccessTime";
  public static EMP_NO = "EmpNo";
  public static EMP_NAME = "EmpName";
  public static MR_OFFICE_TYPE_CODE = "MrOfficeTypeCode";
  public static BUSINESS_DT_STR = "BusinessDtStr";

  // Module
  public static LOAN_ORIGINATION = "LOS";
  public static FOUNDATION = "FOUNDATION";
  public static MODULE_LMS = "LMS";

  // COMPONENTS
  public static LINE = 'Line';
  public static LINE_AREA_DASHBOARD = 'lineAreaDashboard';

  //Apv Category
  public static ApvCategoryCreditApproval = "CRD_APV"
  public static ApvCategoryCreditApprovalResultExtensionApproval = "CR_APV_RES_EXP_D_CAT";
  public static ApvCategoryPackageValidityChecking = "PCKG_VLDT_APV"
  public static ApvCategoryPreGoLive = "PRE_GPV_APV"
  public static ApvCategoryOfferingValidity = "OFF_VLD_APV"
  public static INV_VERF_RESULT_STAT = "INV_VERF_RESULT_STAT";
  public static ApvCategoryApplicaitonApproval = "APP_OPL_APV";
  public static ApvCategoryDocumentChecklistApproval = "DOC_CHCKLIST_APV";

  //CUST TYPE
  public static CustTypePersonal = "PERSONAL";
  public static CustTypeCompany = "COMPANY";
  public static CustTypePublic = "PUBLIC";
  public static GuarantorTypeCodePersonal = "PERSONAL";
  public static GuarantorTypeCodeCompany = "COMPANY";
  public static CustGrupIndentifierTypePersonal = "custGrpMember";
  public static CustGrupIndentifierTypeCompany = "custGrpMemberCompany";

  //CUST MAIN DATA MODE
  public static CustMainDataModeCust = "CUST";
  public static CustMainDataModeGuarantor = "GUARANTOR";
  public static CustMainDataModeFamily = "FAMILY";
  public static CustMainDataModeMgmntShrholder = "SHAREHOLDER";

  //CUST PERSONAL RELATIONSHIP
  public static SelfCustomer = "SELF";

  //MOU STAT
  public static MouStatCancel = "CAN";
  public static MouDocSigner = "DSG";
  public static ChangeMouNew = "NEW";
  public static ChangeMouReturn = "RTN";

  //LEAD STAT
  public static LeadStatCancel = "CAN";
  public static LeadStatNew = "NEW";
  public static LeadStatReject = "RJC";
  public static LeadStatNewSmpl = "NEW_SMPL";

  //LEAD STEP
  public static LeadStepCancel = "CAN";
  public static LeadStepNew = "NEW";
  public static LeadStepReject = "RJC";
  public static LeadStepSelfVerification = "SVR";
  public static LeadStepAppCust = "APP_CUST";

  //ASSET CONDITION 
  public static AssetConditionUsed = "USED";
  public static AssetConditionNew = "NEW";
  
  public static ModeAddColl = "addColl";
  public static ModeEditColl = "editColl";

  // SOCIAL MEDIA
  public static FACEBOOK = "FB";
  public static TWITTER = "TW"
  public static INSTAGRAM = "IG"

  //App Step
  public static AppStepNew = "NEW";
  public static AppStepCust = "CUST";
  public static AppStepFamily = "FAM";
  public static AppStepGuar = "GUAR";
  public static AppStepShr = "SHR";
  public static AppStepRef = "REF";
  public static AppStepApp = "APP";
  public static AppStepNapd = "NAPD";
  public static AppStepAsset = "ASSET";
  public static AppStepExpense = "EXPENSE";
  public static AppStepIns = "INS";
  public static AppStepLIns = "LFI";
  public static AppStepFin = "FIN";
  public static AppStepTC = "TC";
  public static AppStepUplDoc = "UPL_DOC";
  public static AppStepColl = "COLL";
  public static AppStepInvoice = "INVOICE";
  public static AppStepOther = "OTH";
  public static AppStepCrdIns = "CRI";
  public static AppStepComm = "COM";
  public static AppStepRSVFund = "RSV";
  public static AppStepPhnVerif = "PHN";
  public static AppStepSurvey = "SRVY";
  public static AppStepFraud = "FRD";
  public static AppStepCrdInv = "CINV";
  public static AppStepScoring = "SCOR";
  public static AppStepDev = "DEVC";
  public static AppStepRvw = "RVW";
  public static AppStepApv = "APV";
  public static AppStepRtn = "RTN";
  public static AppStepAgr = "AGR";
  public static AppStepLiv = "LIV";
  public static AppStepPO = "PO";
  public static AppStepOFVC = "OFVC";
  public static AppStepOFVR = "OFVR";
  public static AppStepOFVA = "OFVA";
  public static AppStepDO = "DO";
  public static AppStepCNFR = "CNFR";
  public static AppStepPGLV = "PGLV";
  public static AppStepCSR = "CSR";
  public static AppStepAssetExpense = "AEX";
  public static AppStepCustCmpltn = "CMPLTN";
  public static FL4W = "FL4W";
  public static CF4W = "CF4W";
  public static CF2W = "CF2W";
  public static FCTR = "FCTR";
  public static DF = "DLFN";
  public static CFRFN4W = "CFRFN4W";
  public static CFRFN = "CFRFN";
  public static CFNEWCAR = "CFNEWCAR";
  public static CFNA = "CFNA";
  public static CENTER_GROUP_CODE = "CG";
  public static ROS = "ROS";
  public static OPL = "OPL";

  //OFFICE TYPE
  public static HeadOffice = "HO";
  public static SuperUser = "SUPUSR";
  public static HeadOfficeName = "Head Office";
  public static CenterGroup = "Center Group"

  public static GENERAL = "GENERAL";
  public static FINANCING = "FINANCING";
  public static FACTORING = "FACTORING";
  public static DEALERFINANCING = "FINANCING";
  public static ID_TYPE_NPWP = "NPWP";

  public static SALES_JOB_CODE = "SALES_PERSON";
  public static ADMIN_HEAD_JOB_CODE = "ADMIN_HEAD";
  public static BRANCH_MANAGER_JOB_CODE = "BRANCH_MANAGER";
  public static SUPERVISOR_JOB_CODE = "SUPERVISOR";
  
  public static REF_REASON_MOU_GENERAL = "MOUC_GEN_RVW";
  public static REF_REASON_MOU_FACTORING = "MOUC_FCTR_RVW";
  public static REF_REASON_MOU_FINANCING = "MOUC_FIN_RVW";

  //LEAD - TELEMARKETING
  public static REF_REASON_RO_POTENTIAL = "RO_POTENTIAL";

  //REF VERF ANSWER_TYPE
  public static VerfAnswerTypeCodeDdl = "DDL";
  public static VerfAnswerTypeCodeUcInputNumber = "UC_INPUT_NUMBER";

  //PO ITEM CODE
  public static PoItemCodeTotalAssetPrice = "TOTAL_ASSET_PRICE";
  public static PoItemCodeDpNett = "DP_NETT";

  public static PoItemCodeTdpAtCoy = "TDP_AT_COY";
  public static PoItemCodeInstAmt = "INST_AMT";
  public static PoItemCodeInsNotCptlz = "INS_NOT_CPTLZ";
  public static PoItemCodeLfiNotCptlz = "LFI_NOT_CPTLZ";
  public static PoItemCodeDiffRateAmt = "DIFF_RATE_AMT";
  public static PoItemCodeAdditionalAdminFee = "ADD_ADMIN_FEE_NOT_CPTLZ";
  public static PoItemCodeProvisionFee = "PRVSN_FEE_NOT_CPTLZ";
  public static PoItemCodeFirstInstAmt = "FIRST_INST_AMT";
  public static PoItemCodeAdminFee = "ADMIN_FEE_NOT_CPTLZ";
  public static PoItemCodeFiduciaFee = "FDCIA_FEE_NOT_CPTLZ";
  public static PoItemCodeNotaryFee = "NTRY_FEE_NOT_CPTLZ";
  //STATUS GRP
  public static StatusGrpVerfResultStat = "VERF_RESULT_STAT";
  public static VerfResultStatSuccess = "SCS";
  public static VerfResultStatFailed = "FAIL";
  public static TrxTypeCodePhn = "PHN";
  public static VerfTrxTypeCodePhn = "PHN_VERIF";
  public static VerfTrxTypeCodeSurvey = "SURVEY_VERIF";
  public static VerfTrxTypeCodeInvoice = "INVOICE";
  public static VerfResultStatCodeNew = "NEW";
  public static RtnHandlingReturnStatDone = "DONE";
  public static CrdInvstgStatDone = "DONE";
  public static CrdRvwStatDone = "DONE";
  public static ASSET_TYPE_CAR = "CAR";
  public static LICENSE_PLATE_NO = "LICENSE PLATE NO";
  public static OFFERING_VALIDITY_APV = "OFF_VLD_APV";
  public static LtkmStepApproval = "APV";

  //APV RESULT
  public static ApvResultReturn = "Return";
  public static ApvResultReturnFinal = "ReturnFinal";
  public static ApvResultRejectFinal = "RejectFinal";

  //BOOKMARK VALUE
  public static BOOKMARK_DONE = "DONE";

  //REF PROD COMPNT
  public static RefProdCompntCodeWayOfFinancing = "WAY_OF_FINANCING";
  public static RefProdCompntCodePurposeOfFinancing = "PURPOSE_OF_FINANCING";
  public static RefProdCompntCodeCrApvResExpDays = "CR_APV_RES_EXP_DAYS";
  public static CollateralNeeded = "COLLATERALNEEDED";
  public static RefProdCompntCodeDisburseToCust = "DISBURSE_TO_CUST";
  public static REF_PROD_COMPNT_CODE_CRD_APV = "CRD_APV";
  public static REF_PROD_COMPNT_CODE_OFF_VLD_APV = "OFF_VLD_APV";
  public static REF_PROD_COMPNT_CODE_CURR = "CURR";

  // PRODUCT BEHAVIOUR
  public static ProductBehaviourLock = "LOCK";
  public static ProductBehaviourDefault = "DEFAULT";

  // COMPONENT GROUP
  public static PRODUCT_COMP_GRP_GEN = "GEN";

  //VERIFICATION
  public static VerificationNew = "NEW";
  public static VerificationFail = "FAIL";

  //Asset Usage 
  public static AssetUsageNonComm = "NON_COMM"
  public static AssetUsageComm = "COMM"

  //Nationality
  public static NationalityLocal = "LOCAL";

  //App Collateral Attr
  public static AppCollateralAttrAssetRegion = "ASSET_REGION";
  public static AppCollateralAttrColor = "COLOR";
  public static AppCollateralAttrCategory = "CATEGORY";
  public static AppCollateralAttrTransmition = "TRANSMITION";
  public static AppCollateralAttrTaxCityIssuer = "TAX_CITY_ISSUER";
  public static AppCollateralAttrBpkbIssueDate = "BPKB_ISSUE_DATE";

  //ATTR GROUP 
  public static AttrGroupCustCompanyOther = "CUST_COMPANY_OTH"
  public static AttrGroupCustPersonalOther = "CUST_PERSONAL_OTH"
  public static AttrGroupCustCompanyFinData = "CUST_COMPANY_FINDATA"
  public static AttrGroupCustPersonalFinData = "CUST_PERSONAL_FINDATA"
  public static AttrGroupCustPersonalFinDataIncome = "CUST_PERSONAL_FINDATA_INCOME"
  public static AttrGroupCustPersonalFinDataExpense = "CUST_PERSONAL_FINDATA_EXPENSE"
  public static AttrGroupCustPersonalFinDataOther = "CUST_PERSONAL_FINDATA_OTHER"
  public static AttrGroupCustCompanyFinDataIncome = "CUST_COMPANY_FINDATA_INCOME"
  public static AttrGroupCustCompanyFinDataExpense = "CUST_COMPANY_FINDATA_EXPENSE"
  public static AttrGroupCustCompanyFinDataOther = "CUST_COMPANY_FINDATA_OTHER"
  public static AttrGroupApplicationData = "APPLICATION_DATA";
  public static AttrGroupAsset = "ASSET";

  //ATTR INTPUT TYPE
  public static AttrInputTypeDate = "D";
  public static AttrInputTypeNum = "N";
  public static AttrInputTypeNumPerc = "P";
  public static AttrInputTypeList = "L";
  public static AttrInputTypeSearchList = "SL";
  public static AttrInputTypeText = "T";
  public static AttrInputTypeTextArea = "TA";
  public static AttrInputTypeRefMaster = "RM";

  //ATTR CODE
  public static AttrCodeDeptAml = "AML_CUST_DEPARTMENT";
  public static AttrCodeAuthAml = "AUTH_AML";
  public static AttrCodeRoadWorthinessDoc = "ROAD_WORTHINESS_DOC";
  
  //ATTR VALUE
  public static AttrValueOnTheRoad = "ON_THE_ROAD";
  public static AttrValueOffTheRoad = "OFF_THE_ROAD";

  //Interest Type
  public static InterestTypeFixed = "FIXED";

  //ASSET STAT
  public static AssetStatNew = "NEW";
  public static AssetStatExisting = "EXISTING";

  //CUST STAT
  public static CustStatNew = "NEW";
  public static CustStatExisting = "EXISTING";

  //VERF TRX TYPE
  public static VerfTrxTypeCodeCustConfirm = "CUST_CONFIRM";

  // AGRMNT STAT
  public static AgrmntStatCancel = "CANCEL";
  public static AgrmntStatReject = "RJC";
  public static AgrmntStatExpired = "EXP";
  public static AgrmntStatPaid = "RRD";

  //COVER PERIOD
  public static CoverPeriodAnnually = "AN";
  public static CoverPeriodFullTenor = "FT";
  public static CoverPeriodPartialTenor = "PT";
  public static CoverPeriodOverTenor = "OT";

  //PREMIUM TYPE
  public static PremiumTypeAmt = "AMT";
  public static PremiumTypePrcnt = "PRCNT";

  //FIRST INST TYPE
  public static FirstInstTypeAdvance = "AD"
  public static FirstInstTypeAdvanceString = "Advance"
  public static FirstInstTypeArrearString = "Arrear"

  //FEE TYPE
  public static FeeTypeAmt = "AMT";
  public static FeeTypePrcnt = "PRCNT";

  //DOWM PAYMENT TYPE
  public static DownPaymentTypeAmt = "AMT";
  public static DownPaymentTypePrcnt = "PRCNT";

  //PAYMENT TYPE
  public static PaymentTypeAmt = "AMT";
  public static PaymentTypePrcnt = "PRCNT";

  //DEVIATION TYPE
  public static DeviationTypeManualDev = "MANUAL_DEV"
  public static DeviationTypeAutomaticDev = "AUTOMATIC_DEV"

  //TOP CALC BASED
  public static TopCalcBasedInvcDt = "INVC_DT";
  public static TopCalcBasedEffDt = "EFF_DT";

  //INST TYPE
  public static InstTypeSingle = "SINGLE";
  public static InstTypeMultiple = "MULTIPLE";

  //ADDR TYPE
  public static AddrTypeLegal = "LEGAL";
  public static AddrTypeResidence = "RESIDENCE";
  public static AddrTypeMailing = "MAILING";
  public static AddrTypeJob = "JOB";
  public static AddrTypePrevJob = "PREV_JOB";
  public static AddrTypeOthBiz = "OTH_BIZ";
  public static AddrTypeCompany = "COMPANY";
  public static AddrTypeEmergency = "EMERGENCY";
  public static AddrTypeContactInfo = "CONTACT";
  public static AddrTypeBiz = "BIZ";

  //CUST MODEL
  public static CustModelProfessional = "PROF";
  public static CustModelNonProfessional = "NONPROF";
  public static CustModelEmployee = "EMP";
  public static CustModelSmallMediumEnterprise = "SME";

  //VENDOR CATEGORY 
  public static VendorCategoryAssetInscoBranch = "ASSET_INSCO_BRANCH";

  //INSURED BY
  public static InsuredByCustomer = "CU";
  public static InsuredByOffSystem = "OFF";
  public static InsuredByCompany = "CO";
  public static InsuredByCustomerCompany = "CUCO";

  //INSURANCE FEE BEHAVIOR
  public static InsFeeBhvDef = "DEF";
  public static InsFeeBhvLock = "LOCK";
  public static InsFeeBhvMax = "MAX";
  public static InsFeeBhvMin = "MIN";

  //INSURANCE PAID BY BEHAVIOR
  public static InsPaidByBhvDef = "DEF";
  public static InsPaidByBhvLock = "LOCK";

  // INSURANCE ADDITIONAL COVERAGE
  public static MrAddCvgTypeCodeLoading = 'LOADING';
  public static AddCvgTypeNameLoading = 'Loading';
  public static MrAddCvgTypeCodeTpl = 'TPL';
  public static MrAddCvgTypeCodePap = 'PAP';

  //INSURANCE CAPITALIZED GENERAL SETTING VALUE
  public static InsGSCapitalizeYearly = 'YEARLY';
  public static InsGSCapitalizePartial = 'PARTIAL';

  //INS PAID BY
  public static InsPaidByCustomer = "CU";
  public static InsPaidByAtCost = "CO";

  //LIFE INS PAY METHOD 
  public static LifeInsPayMethodFullPaidInAdvance = "PAID_IN_ADV";
  public static LifeInsPayMethodFullCapitalized = "CPTLZ";
  public static LifeInsPayMethodPaidInAdvanceAndCapitalizedMix = "IN_ADV_CPTLZ_MIX";

  //INST SCHM
  public static InstSchmBalloon = "BL";
  public static InstSchmStepUpStepDownNormal = "STNM";
  public static InstSchmStepUpStepDownLeasing = "STLS";
  public static InstSchmStepUpStepDownCummulative = "STCM";
  public static InstSchmRegularFix = "RF";
  public static InstSchmEvenPrincipal = "EP";

  //REF PROD COMPNT
  public static RefProdCompntAssetType = "ASSETTYPE";
  public static RefProdCompntSupplSchm = "SUPPLSCHM";
  public static RefProdCompntAssetSchm = "ASSETSCHM";
  public static RefProdCompntAssetCond = "ASSETCOND";
  public static RefProdCompntLob = "LOB";
  public static RefProdCompntCurr = "CURR";
  public static RefProdCompntPayFreq = "PAYFREQ";
  public static RefProdCompntProdType = "PROD_TYPE";
  public static RefProdCompntDocChecklist = "DOC_CHKLST_APV";

  // REF REASON TYPE CODE
  public static RefReasonTypeCodeAppAgrCncl = "APP_AGR_CNCL";
  public static RefReasonTypeCodePreGlvApv = "PRE_GLV_APV";
  public static RefReasonTypeCodeCrdReview = "CRD_REVIEW";
  public static RefReasonTypeCodeLtkmVerify = "LTKM_VERIFY";
  public static RefReasonTypeCodeEditAppAfterApproval = "EDIT_APP_AFT_APV";
  public static RefReasonTypeDocChecklist = "DCK_LIST";
  public static RefReasonTypeCodeInvoiceDataVerif = "INVOICE_DATA_VERIF";
  public static RefReasonTypeCodeProdDeactivate = "PROD_DEACT";
  public static RefReasonTypeCodeNewProduct = "NEW_PRODUCT";
  public static RefReasonTypeCodeReturnHandlingGeneral = "RTN_H_GEN";
  public static RefReasonTypeCodeOfferingValidityReqApv = "OFF_VLD_REQ_APV";

  // INST TYPE
  public static SINGLE_INST_TYPE = "SINGLE";
  public static MULTIPLE_INST_TYPE = "MULTIPLE";
  public static PAY_FREQ_MONTHLY = "MONTHLY";
  public static INST_SCHM_REGULAR_FIXED = "RF";

  // INTEREST CALC BASED
  public static TOP_INTEREST_CALC_BASED = "TOP"; 
  public static INTEREST_INTEREST_CALC_BASED = "INTEREST"; 

  // MR ID TYPE CODE
  public static MrIdTypeCodeEKTP = "EKTP";
  public static MrIdTypeCodeSIM = "SIM";
  public static MrIdTypeCodeKITAS = "KITAS";
  public static MrIdTypeCodeNPWP = "NPWP";
  public static MrIdTypeCodeAKTA = "AKTA";
  public static MrIdTypeCodeKTM = "KTM";

  // MR ID TYPE CODE VENDOR
  public static MrIdTypeCodeVendorKTP = "KTP";
  public static MrIdTypeCodeVendorSIM = "SIM";
  public static MrIdTypeCodeVendorTDP = "TDP";

  // Tax
  public static AppCom = "APP_COM";
  public static ExchangeRateAmt = "1";
  public static TaxTypeCode = "WHT";
  public static VATTypeCode = "VAT";
  public static TrxTypeCode = "APP_COM";
  public static TrxTypeCodeAppCom = "APP_COM";
  public static LabelSupplier = "Supplier";
  public static LabelSupplierEmp = "Supplier Employee";
  public static LabelReferantor = "Referantor";
  public static ContentSupplier = "Supplier";
  public static ContentSupplierEmp = "SupplierEmployee";
  public static ContentReferantor = "Referantor";
  public static CommissionReceipientTypeCodeSupplier = "SUPPLIER";
  public static CommissionReceipientTypeCodeSupplierEmp = "SUPPLIER_EMP";
  public static CommissionReceipientTypeCodeReferantor = "REFERANTOR";
  public static CommissionIdentifierSupplier = "SupplierIdentifier";
  public static CommissionIdentifierSupplierEmp = "SupplierEmpIdentifier";
  public static CommissionIdentifierReferantor = "SupplierReferantor";
  public static MessageCalculate = "CALC";
  public static MessagePassData = "PASS";
  public static MessageDel = "DEL";

  public static AllocTypeAmt = "Amount";
  public static AllocTypePerc = "Percentage";
  
  // VERIFY STAT
  public static Reject = "REJECT";
  public static Verify = "VERIFY";

  // APP FEE
  public static MrFeeTypeCodeAdmin = "ADMIN";
  public static MrFeeTypeCodeProvision = "PROVISION";

  // RETURN HANDLING
  public static ModeResultHandling = "ReturnHandling";
  public static ReturnHandlingEditApp = "RTN_EDIT_APP";
  public static ReturnHandlingEditCust = "RTN_EDIT_CUST";
  public static ReturnHandlingEditNAP4 = "RTN_EDIT_NAP4";
  public static ReturnHandlingAddPhnVerf = "RTN_ADD_PHN_VERF";
  public static ReturnHandlingAddSurvey = "RTN_ADD_SRVY";
  public static ReturnHandlingEditComRsvFnd = "RTN_EDIT_COM_RSV_FND";
  public static ReturnHandlingAddColtr = "RTN_ADD_COLTR";
  public static ReturnHandlingAddTc = "RTN_ADD_TC";
  public static ReturnStatNew = "NEW";
  public static ReturnStatRequest = "REQ";
  public static ReturnStatus = "Status";
  public static ReturnTask = "RETURN_TASK";

  public static TitleSupplier = "List Supplier Commission Data";
  public static TitleSupplierEmp = "List Supplier Employee Commission Data";
  public static TitleReferantor = "List Referantor Commission Data";
  public static ReturnObj = "ReturnObject";
  public static RefMasterObjs = "RefMasterObjs";
  public static Result = "Result";

  public static RefMasterTypeCodeDisbToDlrFncng = "DISB_TO_DLR_FNCNG";
  public static RefMasterTypeCodeDisbToFctr = "DISB_TO_FCTR";
  public static RefMasterTypeCodeCustType = "CUST_TYPE";
  public static RefMasterTypeCodeShareholderCustType = "SHR_TYPE";
  public static RefMasterTypeCodeSlsRecom = "SLS_RECOM";
  public static RefMasterTypeCodeWOP = "WOP";
  public static RefMasterTypeCodeInstSchm = "INST_SCHM";
  public static RefMasterTypeCodePayFreq = "PAYFREQ";
  public static RefMasterTypeCodeCustNotifyOpt = "CUST_NOTIF_OPT";
  public static RefMasterTypeCodeFirstInstType = "FIRST_INST_TYPE";
  public static RefMasterTypeCodeAssetCondition = "ASSET_CONDITION";
  public static RefMasterTypeCodeAssetUsage = "ASSET_USAGE";
  public static RefMasterTypeCodeCustPersonalRelationship = "CUST_PERSONAL_RELATIONSHIP";
  public static RefMasterTypeCodeCustCompanyRelationship = "CUST_COMPANY_RELATIONSHIP";
  public static RefMasterTypeCodeGuarPersonalRelationship = "GUAR_PERSONAL_RELATIONSHIP";
  public static RefMasterTypeCodeGuarCompanyRelationship = "GUAR_COMPANY_RELATIONSHIP";
  public static RefMasterTypeCodeIdType = "ID_TYPE";
  public static RefMasterTypeCodeRateType = "RATE_TYPE";
  public static RefMasterTypeCodeAddrType = "ADDR_TYPE";
  public static RefMasterTypeCustAddrType = "CUST_ADDR_TYPE"
  public static RefMasterTypeCodeGracePeriodType = "GRACE_PERIOD_TYPE";
  public static RefMasterTypeLegalReview = "LGL_REVIEW";
  public static RefMasterTypeCodeFeeType = "FEE_TYPE";
  public static RefMasterTypeCodeRecourseType = "RECOURSE_TYPE";
  public static RefMasterTypeCodePaidBy = "PAID_BY";
  public static RefMasterTypeCodeInstType = "INST_TYPE";
  public static RefMasterTypeCodeSingleInstCalcMethod = "SINGLE_INST_CALC_METHOD";
  public static RefMasterTypeCodeCurrency = "CURRENCY";
  public static RefMasterTypeCodeGender = "GENDER";
  public static RefMasterTypeCodeMaritalStat = "MARITAL_STAT";
  public static RefMasterTypeCodeCustModel = "CUST_MODEL";
  public static RefMasterTypeCodeDownPaymentType = "DOWN_PAYMENT_TYPE";
  public static RefMasterTypeCodeLeadSource = "LEAD_SOURCE";
  public static RefMasterTypeCodeStepUpStepDownInputType = "STEP_UP_STEP_DOWN_INPUT_TYPE";
  public static RefMasterTypeCodeBuildingOwnership = "BUILDING_OWNERSHIP";
  public static RefMasterTypeCodeMonth = "MONTH";
  public static RefMasterTypeCodeJobPosition = "JOB_POSITION";
  public static RefMasterTypeCodeCoyScale = "COY_SCALE";
  public static RefMasterTypeCodeJobStat = "JOB_STAT";
  public static RefMasterTypeCodeInvestmentType = "INVESTMENT_TYPE";
  public static RefMasterTypeCodeLegalDocType = "LEGAL_DOC_TYPE";
  public static RefMasterTypeCodeCustRelationship = "CUST_RELATIONSHIP";
  public static RefMasterTypeCodeSourceIncome = "SOURCE_OF_INCOME";
  public static RefMasterTypeCodeNationality = "NATIONALITY";
  public static RefMasterTypeCodeEducation = "EDUCATION";
  public static RefMasterTypeCodeReligion = "RELIGION";
  public static RefMasterTypeCodeCompanyType = "COMPANY_TYPE";
  public static RefMasterTypeCodeSocmedType = "SOCMED_TYPE";
  public static RefMasterTypeCodeAssetInsRegion = "ASSET_INS_REGION";
  public static RefMasterTypeCodeInsuredBy = "INSURED_BY";
  public static RefMasterTypeCodeInsPaidBy = "INS_PAID_BY";
  public static RefMasterTypeCodeInsMainCvgType = "INS_MAIN_CVG_TYPE";
  public static RefMasterTypeCodeInsAddCvgType = "INS_ADD_CVG_TYPE";
  public static RefMasterTypeCodeInsCoverPeriod = "INS_COVER_PERIOD";
  public static RefMasterTypeCodePayPeriodToInsco = "PAY_PERIOD_TO_INSCO";
  public static RefMasterTypeCodeOtherExpenseOpl = "OTH_EXPENSE_OPL";
  public static RefMasterTypeCodeFeeTypeOpl = "FEE_TYPE_OPL";
  public static RefMasterTypeCodeInpFeeTypeOpl = "INP_FEE_TYPE_OPL";
  public static RefMasterTypeCodeLifeInsPayMethod = "LIFE_INS_PAY_METHOD";
  public static RefMasterTypeCodeLifeInscoBranch = "LIFE_INSCO_BRANCH";
  public static RefMasterTypeCodeReturnTaskCF4W = "RETURN_TASK_CF4W";
  public static RefMasterTypeCodeReturnTaskCFNA = "RETURN_TASK_CFNA";
  public static RefMasterTypeCodeReturnTaskCFRFN4W = "RETURN_TASK_CFRFN4W";
  public static RefMasterTypeCodeReturnTaskFL4W = "RETURN_TASK_FL4W";
  public static RefMasterTypeCodeReturnTaskOPL = "RETURN_TASK_OPL";
  public static RefMasterTypeCodeReturnTaskFCTR = "RETURN_TASK_FCTR";
  public static RefMasterTypeCodeReturnTaskDF = "RETURN_TASK_DLFN";
  public static RefMasterTypeCodeVerfSubjRelation = "VERF_SUBJ_RELATION";
  public static RefMasterTypeCodeCrdRvwAnalysisItem = "CRD_RVW_ANALYSIS_ITEM";
  public static RefMasterTypeCodeCrdInvstgAnalysisItem = "CRD_INVSTG_ANALYSIS_ITEM";
  public static RefMasterTypeCodeInterestInputType = "INTEREST_INPUT_TYPE";
  public static RefMasterTypeCodeAppPaidBy = "APP_PAID_BY";
  public static RefMasterTypeCodeInterestTypeGeneral = "INTRSTTYPE";
  public static APP_APV = "APP_APV";
  public static RefMasterTypeCodeInterestTypeFactoring = "INTEREST_TYPE";
  public static RefMasterTypeCodeTopCalcBased = "TOP_CALC_BASED";
  public static RefMasterTypeCodeSubsidyFromType = "SUBSIDY_FROM_TYPE";
  public static RefMasterTypeCodePoItemCode = "PO_ITEM_CODE";
  public static RefMasterTypeCodeFinDataCalcBaseOn = "FIN_DATA_CALC_BASE_ON";
  public static PurchaseOrderItemTypeNonFee = "NON_FEE";
  public static PurchaseOrderItemTypeFee = "FEE";
  public static RefProdCompFirstInstType = "FIRSTINSTTYPE";
  public static RefProdCompIntrstType = "INTRSTTYPE";
  public static RefProdCompAssetCond = "ASSETCOND";
  public static RefProdCompInstScheme = "INST_SCHM";
  public static RefMasterTypeCodeProvisionSource = "PROVISION_SOURCE";
  public static RefMasterTypeCodeProvisionType = "PROVISION_TYPE";
  public static RefMasterTypeCodeCharacteristicCredit = "CHARACTERISTIC_OF_CREDIT";
  public static RefMasterTypeCodeWayOfRestructure = "WAY_OF_RESTRUCTURE";
  public static RefMasterTypeStepUpStepDownInputTypePrcnt = "PRCNT";
  public static RefMasterTypeCodeSalutation = "SALUTATION";
  public static RefMasterTypeCodePaymentType = "PAYMENT_TYPE";
  public static RefMasterTypeCodeMouCustFeePaymentType = "MOU_CUST_FEE_PAYMENT_TYPE";
  public static RefMasterTypeCodeAgreementAffected = "AGREEMENT_AFFECTED";
  public static RefMasterTypeCodePlafonType = "PLAFOND_TYPE";
  public static RefMasterTypeCodeMOUFreezeUnfreeze = "MOU_FRZ_UNFRZ";
  public static RefMasterTypeCodeAdditionalInterestPaidBy = "ADDITIONAL_INTEREST_PAID_BY";
  public static RefMasterTypeCodeRegularExpression = "REGULAR_EXPRESSION";
  public static RefMasterTypeCodeLob = "LOB";
  public static RefMasterTypeCodeAppSrcType = "APP_SRC_TYPE";
  public static RefMasterTypeCodeMouType = "MOU_TYPE";
  public static RefMasterTypeCodeCspUslAml = "CSP_USL_AML";
  public static RefMasterTypeCodePublicType = "PUBLIC_TYPE";
  public static RefMasterTypeCodePositionSlik = "POSITION_SLIK";
  public static RefMasterTypeCodeInterestCalcBased = "INTEREST_CALC_BASED"; 
  public static RefMasterTypeCodeTaxCalcMethod = "TAX_CALC_METHOD"; 
  public static RefMasterTypeCodeReferantorCategory = "REFERANTOR_CATEGORY";

  // REF MASTER MASTER CODE
  public static RefMasterMasterCodeCust = "CUST";
  public static RefMasterMasterCodeCustFctr = "CUST_FCTR";
  public static RefMasterMasterCodeOth = "OTH";
  public static RefMasterMasterCodeVendor = "VENDOR";
  public static RefMasterMasterCodeManufacturer = "MANUFACTURER";
  public static RefMasterMasterCodeCustomer = "CUSTOMER";
  public static RefMasterMasterCodeSelf = "SELF";
  public static RefMasterTypeCodeCustExpsrType = "CUST_EXPSR_TYPE";
  public static RefMasterTypeCodeResidualType = "RESIDUAL_TYPE";
  public static RefMasterTypeCodeOperatingMargin = "OPERATING_MARGIN_TYPE";
  public static RefMasterTypeCodeCashflowItem = "CASHFLOW_ITEM";
  public static RefMasterTypeCodeCaptureStat = "CAPTURE_STAT";

  //RATE TYPE
  public static RateTypeFlat = "FLT";
  public static RateTypeEffective = "EFCTV";

  //FIN DATA CALC BASE ON
  public static FinDataCalcBaseOnRate = "CALC_BASE_ON_RATE";
  public static FinDataCalcBaseOnInst = "CALC_BASE_ON_INST";
  public static FinDataCalcBaseOnCommission = "CALC_BASE_ON_COMM";

  //LIFE INS CUST TYPE
  public static LifeInsCustTypeCustomer = "CUSTOMER";

  //SUBSIDY ALLOC
  public static SubsidyAllocSubsidyRate = "SUBRATE";

  //SUBSIDY FROM TYPE
  public static SubsidyFromTypeAtpm = "ATPM";
  public static SubsidyFromTypeSupplier = "SUPPLIER";
  public static SubsidyFromTypeIns = "INS";

  //SCORE TYPE
  public static ScoreTypeScoring = "SCORING";
  public static ScoreTypeDsr = "DSR";
  public static ScoreTypeDukcapil = "DUKCAPIL";

  //Gender Type
  public static MasterCodeGenderFemale = "FEMALE";
  public static MasteCodeGenderMale = "MALE";
  public static MasterCodeGenderFemaleName = "Female";
  public static MasterCodeGenderMaleName = "Male";

  //REFERANTOR TYPE
  public static ReferantorCategoryAgency = "AGENCY";
  public static ReferantorCategoryCustomer = "CUSTOMER";
  public static ReferantorCategorySupplierEmployee = "SUPPLIER EMPLOYEE";
  public static ReferantorCategoryMultifinanceEmployee = "MULTIFINANCE EMPLOYEE";
  public static ReferantorTypeSupplierEmployee = "SUPPL_EMP";
  public static ReferantorTypeCustomerCompany = "CUSTOMER_COMPANY";

  //Martial Status
  public static MasteCodeMartialStatsMarried = "MARRIED";
  public static MasteCodeMartialStatsSingle = "SINGLE";

  //Relationship Code
  public static MasteCodeRelationshipSpouse = "SPOUSE";

  // Rule Behaviour
  public static RuleBehaviourLock = "LOCK";

  //Status Code
  public static STATUS_CODE_USER_LOCKED = "002";

  //Paid By
  public static PAID_BY_CUST = "CUST";
  public static PAID_BY_CUST_FCTR = "CUST_FCTR";

  //Recourse Type
  public static WITH_RECOURSE_TYPE = "WITH_RECOURSE";
  public static WITHOUT_RECOURSE_TYPE = "WITHOUT_RECOURSE";

  //Mou Revolving Type
  public static MOU_REVOLVING_TYPE = "MOU_REVOLVING_TYPE";
  public static MRT_ON_PAYMENT = "ON_PAYMENT";
  public static MRT_ON_FIN_CON = "ON_FIN_CON";

  // Negative Customer Source Code
  public static NegCustSourceCodeConfins = "CONFINS";

  //ASSET ATTRIBUTE
  public static AttrTypeCodeTrx = "TRX";

  //CHARACTERISTIC OF CREDIT
  public static CharacteristicOfCreditTypeCredit = "CREDIT";
  public static CharacteristicOfCreditTypeOther = "OTHER";

  //GENERAL SETTING
  public static GSCodeDefLocalNationality = "DEF_LOCAL_NATIONALITY";
  public static GSCodeAppDataOfficer = "APP_DATA_OFFICER_CODE";
  public static GsCptlzInsSetting = "CPTLZ_INS_SETTING";
  public static GsDiffdaysglveff = "DIFFDAYSGLVEFF";
  public static GSCodeIntegratorCheckBySystem = "INTEGRATOR_CHECK_BY_SYSTEM";
  public static GSCodeInputOPLFeeType = "INPOPLFEETYPE";
  public static GSCodeInputOPLFeeBehaviour = "INPOPLFEETBHV";
  public static GSCodeIsUseDigitalization = "IS_USE_DIGITALIZATION";
  public static GSCodeLobKta = "LOB_KTA";
  public static GSSerialNoRegex = "SERIAL_NO_REGEX";
  public static GSCodeListLegalDocCantDuplicate = "LIST_LEGAL_DOC_CANNOT_DUPLICATE";
  public static GSCodeRoleDashboardLosOperational = "ROLE_DASHBOARD_LOS_OPERATIONAL";
  public static GSCodeDashboardUsr = "DASHBOARD_USR";
  public static GSCodeDashboardPwd = "DASHBOARD_PWD";
  public static GSCodeFilterAddr = "FILTER_ADDR";
  public static GSCodeLoadingFeeCountType = "LOADING_FEE_COUNT_TYPE";
  public static GSCodeDefaultLoadingFeeYear = "DEFAULT_LOADING_FEE_YEAR";
  public static LoadingFeeCountType_FirstYear = "FY";
  public static LoadingFeeCountType_LastYear = "LY";
  public static LoadingFeeCountType_CountingYear = "CY";
  public static GSCodeFilterAppDataSalesOfficerCode = "FILTER_APP_DATA_SALES_OFFICER_CODE";
  public static GSCodeAgrStepToCheckSerialMandatoryEaaa = "AGR_STEP_TO_CHECK_SERIAL_MANDATORY_EAAA";
  public static GSCodeOwnershipMandatoryAddrType = "OWNERSHIP_MANDATORY_BY_ADDR_TYPE";
  public static GsCodePasswordRegex = "PASSWORD_REGEX";
  public static GsCodeMaximumReferantor = "MAX_REFERANTOR";
  public static GsCodeIsShowMultiReferantor = "IS_SHOW_MULTI_REFERANTOR";
  public static GsCodeManufacturingYearMandatoryByCollType = "MANUFACTURING_YEAR_MANDATORY_BY_COLLATERAL_TYPE";
  public static GsCodeNegCustAllowNap = "NEGCUSTALLOWNAP";
  public static GsCodeAssetTypeForHeavyEquipment = "ASSET_TYPE_CODE_FOR_HEAVY_EQUIPMENT";
  public static GSCodeCoyMandatoryLegalDocs = "COY_MANDATORY_LEGAL_DOCS";
  public static GSCodeCustAgeLimit = "CUST_AGE_LIMIT";

  //MOU CUST FEE PAYMENT TYPE
  public static PaymentTypeApDeduction = "AP_DEDUCTION";
  public static PaymentTypeDirectPayment = "DIRECT_PAYMENT";

  //CHANGE MOU TYPE
  public static CHANGE_MOU_TYPE = "CHANGE_MOU_TYPE";

  //LTKM
  public static RefMasterTypeCodeLevelIndication = "LVL_INDICATION_AML";
  public static RefMasterTypeCodeSourceIndication = "SRC_INDICATION_AML";
  public static RefMasterTypeCodeSuspciousFor = "SUSP_FOR_AML";
  public static RefMasterTypeCodeSuspciousTrxDueTo = "SUSP_TRX_DUE_AML";
  //END LTKM

  public static RefMasterTypeCustAsset = "CUST_ASSET_TYPE";

  // VERF SCHEME CODE
  public static VerfSchemeCodeRoTelemkOffering = "RO_TELEMK_OFFERING";

  //Serial Item
  public static Chassis_No = "Chassis No";
  public static License_Plate_No = "License Plate No";
  public static Engine_No = "Engine No";

  // Cust Type  
  public static WhiteIndicator = "WHITE";
  public static NoData = "No Data";
  public static MaritalStatusMarried = "MARRIED";
  public static ExposureCustTypeCode = "CUST_EXPSR";
  public static ExposureCustGroupTypeCode = "CUST_GRP_EXPSR";
  public static ExposureObligorTypeCode = "CUST_OBLGR_EXPSR";

  // Role Type
  public static RoleCustData = "CUST";
  public static RoleFamilyData = "SPOUSE";
  public static RoleGuarantorData = "GUARANTOR";
  public static RoleShareholder = "SHAREHOLDER";

  //Approval
  public static SCHM_CODE_MOU_APV_GENERAL = "MOUC_GEN_APV";
  public static SCHM_CODE_MOU_APV_DLFN = "MOUC_DLFN_APV";
  public static SCHM_CODE_MOU_APV_FACTORING = "MOUC_FCTR_APV";
  public static SCHM_CODE_APV_PRE_GO_LIVE = "PRE_GLV_APV_CF";
  public static SCHM_CODE_MOU_FRZ_UNFRZ = "MOU_FRZ_UNFRZ";
  public static SCHM_CODE_CRD_APV_CF = "CRD_APV_CF";
  public static SCHM_CODE_APV_RENT_APP = "APV_RENT_APP";
  public static SCHM_CODE_AML_APV = "AML_APV_SCHM";
  public static SCHM_CODE_EDIT_APP_AFT_APV_APV_SCHM_NORMAL = "EDIT_APP_AFT_APV_APV_SCHM_NORMAL";
  public static SCHM_CODE_CHG_MOU_APV = "CHG_MOU_APV";
  public static SCHM_CODE_CHG_MOU_DLFN_APV = "CHG_MOU_DLFN_APV";
  public static SCHM_CODE_CHG_MOU_FCTR_APV  = "CHG_MOU_FCTR_APV";
  public static SCHM_CODE_MOU_FRZ_UNFRZ_DLFN = "MOU_FRZ_UNFRZ_DLFN";
  public static SCHM_CODE_MOU_FRZ_UNFRZ_FCTR = "MOU_FRZ_UNFRZ_FCTR";
  public static SCHM_CODE_CHG_MOU_EXP_APV = "CHG_MOU_EXP_APV";
  public static SCHM_CODE_CHG_MOU_EXP_DLFN_APV = "CHG_MOU_EXP_DLFN_APV";
  public static SCHM_CODE_CHG_MOU_EXP_FCTR_APV = "CHG_MOU_EXP_FCTR_APV";


  public static CAT_CODE_MOU_APV_GENERAL = "MOUC_GEN_APV";
  public static CAT_CODE_MOU_APV_DLFN = "MOUC_DLFN_APV";
  public static CAT_CODE_MOU_APV_FACTORING = "MOUC_FCTR_APV";
  public static CAT_CODE_PRE_GO_LIVE_APV = "PRE_GPV_APV";
  public static CAT_CODE_CRD_APV = "CRD_APV";
  public static SCHM_CODE_OFF_VLD_APV_CF = "OFF_VLD_APV_CF";
  public static CAT_CODE_OFF_VLD_APV = "OFF_VLD_APV";
  public static CAT_CODE_DOC_CHCKLIST_APV = "DOC_CHCKLIST_APV";
  public static CAT_CODE_APP_OPL_APV = "APP_OPL_APV";
  public static CAT_CODE_AML_APV = "AML_APV";
  public static CAT_CODE_EDIT_APP_AFT_APV_APV = "EDIT_APP_AFT_APV_APV";

  public static EDIT_APP_AFT_APV_APV_TYPE = "EDIT_APP_AFT_APV_APV_TYPE";
  public static CAT_CODE_MOU_FREEZE_UNFREEZE = "MOU_FREEZE_UNFREEZE";
  public static CAT_CODE_CHG_MOU_APV = "CHG_MOU_APV";

  public static CAT_CODE_APV_RES_EXP_D = "CR_APV_RES_EXP_D_CAT";
  public static SCHM_CODE_CR_APV_RES_EXP_D = "CR_APV_RES_EXP_D_SCM";
  public static APV_TYPE_MOU_FRZ_UNFRZ_APV_TYPE = "MOU_FRZ_UNFRZ_APV_TYPE";
  public static APV_TYPE_CHG_MOU_APV_TYPE = "CHG_MOU_APV_TYPE";

  //TRX_TYPE_CODE
  public static APP_TRX_TYPE_CODE = "APP";
  public static MOU_TRX_TYPE_CODE = "MOU";
  public static LEAD_TRX_TYPE_CODE = "LEAD";

  //FRAUD CHECK TYPE
  public static FRAUD_CHCK_ASSET = "ASSET";
  public static FRAUD_CHCK_CUST = "CUST";

  //DMS
  public static DmsKeyR2 = "1234567891234567";
  public static DmsIVR2 = "1234567891234567";
  public static DmsKey = "PHL7KV8RR0VG30K4";
  public static DmsIV = "0G7HFV96AVWXUQ51";
  public static DmsNoCust = "No Customer";
  public static DmsNoApp = "No Application";
  public static DmsNoAgr = "No Agreement";
  public static DmsMouId = "Mou Id";
  public static DmsLeadId = "Lead Id";
  public static DmsOfficeCode = "Office Code";
  public static DmsCustName = "Cust Name";
  public static DmsDealerName = "Dealer Name";
  public static DmsExpiredDate = "Expired Date";
  public static DmsTimestamp = "Tiemstamp";
  public static DmsRoleName = "Role Name";
  public static DmsOverideSecurity = "OverideSecurity";
  public static DmsOverideUpload = "Upload,Delete";
  public static DmsOverideView = "View";
  public static DmsOverideUploadView = "Upload,Delete,View";
  public static DmsOverideUploadDownload = "Upload,Delete,Download";
  public static DmsOverideViewDownload = "View,Download";
  public static DmsOverideUploadDownloadView = "Upload,Delete,Download,View";
  public static DmsViewCodeCust = "ConfinsCust";
  public static DmsViewCodeApp = "ConfinsApp";
  public static DmsViewCodeAgr = "ConfinsAgr";
  public static DmsViewCodeMou = "ConfinsMou";
  public static DmsViewCodeLead = "ConfinsLead";

  public static DefaultSlikSecEcoCode = "930000";

  public static TaskReassignmentApv = "APV";
  public static CAT_CODE_TASK_RASGN = "TASK_RASGN";
  public static SCHM_CODE_RASGN_APV_SCHM = "RASGN_APV_SCHM";

  //MOU CUST
  public static MOU_CUST_PLAFOND_TYPE_BOCLLTR = "BOCLLTR";
  public static MOU_CUST_PLAFOND_TYPE_BOAMT = "BOAMT";
  public static GS_MAX_DAYS_CUST_THIRD_PARTY_CHECK = "MAX_DAYS_CUST_THIRD_PARTY_CHECK";

  public static CHANGE_MOU_TRX_TYPE_CHANGE_MOU = "CHNGMOU";
  public static CHANGE_MOU_TRX_TYPE_REQ_EXP = "REQEXP";

  //MR SINGLE CALC METHOD
  public static SINGLE_INST_CALC_MTHD_DISKONTO = "DISKONTO";
  public static SINGLE_INST_CALC_MTHD_SIMPLE = "SIMPLE";
  
  // CrdRvw
  public static CrdRvwRelationTypeCustomer = "Customer";
  public static CrdRvwRelationTypeFamily = "Family";
  public static CrdRvwRelationTypeShrholder = "Shareholder";
  public static CrdRvwRelationTypeGuarantor = "Guarantor";

  public static CaptureStatReq = "REQ";
  public static CaptureStatScs = "SCS";
  public static CaptureStatFail = "FAIL";

  //MOU TYPE
  public static MOU_TYPE_GENERAL = "GENERAL";
  public static MOU_TYPE_FACTORING = "FACTORING";
  public static MOU_TYPE_DLFN = "FINANCING";

  //Cashflow Item Type
  public static CashFlowItemMasterCodeFeeCptlz = "CASHFLOW_FEE_CPTLZ";
  public static CashFlowItemMasterCodeInstallment = "CASHFLOW_INSTALLMENT";
  public static CashFlowItemMasterCodeInsurance = "CASHFLOW_INSURANCE";
  public static CashFlowItemMasterCodeMaint = "CASHFLOW_MAINT";
  public static CashFlowItemMasterCodeReplaceCar = "CASHFLOW_REPLACE_CAR";
  public static CashFlowItemMasterCodeStnk = "CASHFLOW_STNK";
  public static CashFlowItemMasterCodeOdb = "CASHFLOW_ODB";

  //oth expense opl
  public static OtherExpenseMasterCodeExpStn = "STNKEXP";
  public static OtherExpenseMasterCodeExpOdb = "ODB";
  public static OtherExpenseMasterCodeExpRc = "RCEXP";

  //SYS CONFIG
  public static ConfigCodeIsUseDms = "IS_USE_DMS";
  public static ConfigCodeDigitalizationSvcType = "DIGITALIZATION_SVC_TYPE";
  public static SYS_CONFIG_USING_DMS_ADINS = "USING_DMS_ADINS"
  public static SvcTypeAsliRi = "IS_USE_ASLIRI";
  
  //interest input type
  public static InterestInputTypeAmt = "AMT";
  public static InterestInputTypePrcnt = "PRCNT"

  //Behaviour Type
  public static BehaviourTypeLock = "LOCK";
  public static BehaviourTypeMin = "MIN";
  public static BehaviourTypeMax = "MAX";
  public static BehaviourTypeDefault = "DEFAULT";

  // ProductDeact
  public static PROD_REASON_DEACT = "PROD_DEACT"

  //Product Status
  public static ProdStatApproval = "APVL";
  public static ProdStatReqDeact = "REQD";
  public static ProdStatNew = "NEW";

  //Product Approval
  public static SCHM_CODE_APV_HO_ACT_SCHM = "APV_HO_ACT_SCHM";
  public static SCHM_CODE_APV_HO_DEACT_SCHM = "APV_HO_DEACT_SCHM";
  public static SCHM_CODE_APV_OFR_ACT_SCHM = "APV_OFR_ACT_SCHM";
  public static SCHM_CODE_APV_OFR_DEACT_SCHM = "APV_OFR_DEACT_SCHM";
  public static CAT_CODE_PRD_HO_APV = "PRD_HO_APV";
  public static CAT_CODE_PRD_HO_DEACT_APV = "PRD_HO_DEACT_APV";
  public static CAT_CODE_PRD_OFR_APV = "PRD_OFR_APV";
  public static CAT_CODE_PRD_OFR_DEACT_APV = "PRD_OFR_DEACT_APV";
  public static PRD_HO_APV_TYPE = "PROD_HO_APV_TYPE";
  public static PRD_HO_DEACT_APV_TYPE = "PROD_HO_DEACT_APV_TYPE";
  public static PRD_OFR_APV_TYPE = "PROD_OFR_APV_TYPE";
  public static PRD_OFR_DEACT_APV_TYPE = "PROD_OFR_DEACT_APV_TYPE";    

  //Product Component
  public static LIST_EDITABLE_PROD_COMPNT = "LIST_EDITABLE_PROD_COMPNT";

  //PROD OFFERING
  public static PROD_OFF_STAT_ACT = "ACT";
  public static PRD_OFR_DEACT_APV = "PRD_OFR_DEACT_APV";

  //APP STAT
  public static AppStatCancel = "CAN";
  public static AppStatReject = "RJC";
  
  //INVOICE STAT
  public static InvoiceStatApv = "APV";
  public static InvoiceStatRjc = "RJC";

  //WOP
  public static WopAutoDebit = "AD";  
  
  // GENERAL SETTING CODE
  public static GS_CODE_SALES_OFFICER_CODE = "SALES_OFFICER_CODE";
  

  // JOIN TYPE
  public static JOIN_TYPE_INNER = "Inner";

  // WORKFLOW
  public static ACT_CODE_AGR = "AGR_";
  public static ACT_CODE_RVW = "RVW_";
  public static ACT_CODE_OFVR = "OFVR_";
  public static ACT_CODE_REQU_DEC = "REQU_DEC_";
  public static ACT_CODE_DCK_DEC = "DCK_DEC_";
  public static ACT_CODE_AST_ALO = "AST_ALO_";
  public static WF_UPL_LEAD = "WF_UPL_LEAD";
  public static UPLOAD_LEAD_REVIEW = "UPLOAD_LEAD_REVIEW";
  public static WF_MOU = "WF_MOU_{0}";
  public static WF_MOU_GENERAL = "WF_MOU_GENERAL";
  public static WF_MOU_FACTORING = "WF_MOU_FACTORING";
  public static WF_MOU_DLFN = "WF_MOU_DLFN";
  public static MOU_REVIEW = "MOU_REVIEW_{0}";
  public static LEGAL_RVW = "LEGAL_RVW_{0}";
  public static MOU_RETURN = "MOU_RETURN_{0}";
  public static MOU_APV = "MOU_APV";
  public static MOU_DOC_SIGNER = "MOU_DOC_SIGNER_{0}";
  public static MOU_EXECUTION = "MOU_EXECUTION_{0}";
  public static WF_UPL_SMPL_LEAD = "WF_UPL_SMPL_LEAD";
  public static UPLOAD_SMPL_LEAD_REVIEW = "UPLOAD_SMPL_LEAD_REVIEW";
  public static PROD_OFF_APV = "PROD_OFF_APV";
  public static PROD_OFFERING_RVW = "PROD_OFFERING_RVW";

  
  // CUST ADDR TYPE
  public static CustAddrTypeLegal = "LEGAL";
  public static CustAddrTypeContact = "CONTACT";
  public static CustAddrTypeCompany = "COMPANY";
  public static CustAddrTypeResidence = "RESIDENCE";
  public static CustAddrTypeEmergency = "EMERGENCY";
  public static CustAddrTypeJob = "JOB";
  public static CustAddrTypeOthBiz = "OTH_BIZ";
  public static CustAddrTypePreJob = "PREV_JOB";
  public static CustAddrTypeBiz = "BIZ";

  // LEAD
  public static MrLeadTypeCodeLead = "LEAD";
  public static MrLeadTypeCodeSimpleLead = "SIMPLE_LEAD";
  public static LeadCancelTitle = "Lead Cancel";
  public static SimpleLeadCancelTitle = "Simple Lead Cancel";

  //WORFKLOW LEAD
  public static WF_CODE_LEAD = "WF_LEAD";
  public static WF_CODE_SIMPLE_LEAD = "WF_SIMPLE_LEAD";
  public static ACT_CODE_SIMPLE_FRAUD_VERIFICATION = "SIMPLE_FRAUD_VERIFICATION";
  public static ACT_CODE_SIMPLE_LEAD_UPD = "SIMPLE_LEAD_UPD";
  public static ACT_CODE_TELE_VERIFICATION = "TELE_VERIFICATION";
  public static ACT_CODE_LEAD_UPD = "LEAD_UPD";
  public static ACT_CODE_LEAD_VERIFICATION = "LEAD_VERIFICATION";

  //WORFKLOW RETURN HANDLING
  public static WF_RTN_ADD_PHN_VERF = "RTN_ADD_PHN_VERF_";
  public static ACT_CODE_ADD_PHN_VERF = "ADD_PHN_VERF_";
  public static RTN_EDIT_APP = "RTN_EDIT_APP_";
  public static RTN_ADD_COLTR = "RTN_ADD_COLTR_";
  public static ADD_COLTR = "ADD_COLTR_";
  public static EDIT_APP = "EDIT_APP_";
  public static RTN_EDIT_COM_RSV_FND = "RTN_EDIT_COM_RSV_FND_";
  public static EDIT_COM_RSV_FND = "EDIT_COM_RSV_FND_";
  public static RTN_EDIT_NAP4 = "RTN_EDIT_NAP4_";
  public static EDIT_NAP4 = "EDIT_NAP4_";
  public static WF_LTKM_REQ_MANUAL = "WF_LTKM_REQ_MANUAL";
  public static WF_LTKM_REQ_AUTO = "WF_LTKM_REQ_AUTO";
  public static LTKM_VERIFY = "LTKM_VERIFY";
  public static LTKM_RTN = "LTKM_RTN";
  public static RTN_ADD_TC = "RTN_ADD_TC_";
  public static ADD_COLTR_ = "ADD_COLTR_";
  public static ADD_TC = "ADD_TC_";




  //WORFKLOW PRODUCT
  public static WF_CODE_PROD_HO_APV = "PROD_HO_APV";
  public static ACT_CODE_PROD_HO_RVW = "PROD_HO_RVW";
  
  //WORKFLOW MOU
  public static WF_CHANGE_MOU = "WF_CHANGE_MOU";
  public static ACT_CODE_CHNG_MOU_REVIEW = "CHNG_MOU_REVIEW";
  public static ACT_CODE_CHNG_MOU_APV = "CHNG_MOU_APV";
  public static ACT_CODE_CHG_MOU_RTRN = "CHG_MOU_RTRN";

  //Lead Step
  public static LeadStepSimpleLeadFraudVerif = "FRV_SMPL";
  public static LeadStepLeadVerf = "LVR";
  public static LeadStepTeleVerf = "TVR";
  public static LeadStepLeadUpd = "LUP";

  // Financial Data
  public static FinancialPriceLabel = "Asset Price (Incl. Accessory)";

  //WORKFLOW NAP
  public static WF_CODE_CRP_MD = "WF_CRP_MD_";
  public static WF_CR_APV_RES_EXP_D = "WF_CR_APV_RES_EXP_D";
  public static ACT_CODE_CUST_MD = "CUST_MD_";
  public static ACT_CODE_NAPD_MD = "NAPD_MD_";
  public static ACT_CODE_COM_RSV = "COM_RSV_";
  public static ACT_CODE_RTN = "RTN_";
  public static ACT_CODE_PHN = "PHN_";
  public static WF_CODE_DUP_CHECK_MD = "WF_DUP_CHECK_MD_";
  public static ACT_CODE_CDC_MANUAL = "CDC_MANUAL_";
  public static ACT_CODE_CDA = "CDA_";
  public static ACT_CODE_CDC = "CDC";
  public static ACT_CODE_INV_VERIF = "INV_VERIF_";
  public static ACT_INV_VERIF = "INV_VERIF";
  public static WF_CRP_AFT_ACT = "WF_CRP_{0}_AFT_ACT";
  public static ACT_CODE_PO = "PO_";
  public static ACT_CODE_DO = "DO_";
  public static ACT_CODE_CNFR = "CNFR_";
  public static ACT_CODE_PGLV = "PGLV_";
  public static WF_CODE_RTN = "WF_RTN_";
  
  public static CurrencyMaskPrct = { suffix: ' %', thousands: ',', decimal: '.', align: 'right', allowNegative: false, allowZero: true, precision: 6, nullable: false, inputMode: CurrencyMaskInputMode.NATURAL };
  public static PrcntMinValue: number = 0.000001;

  public static STAT_CODE_ACT = "ACT";

  //DIGITALIZATION SVC TYPE CODE
  public static DigitalizationSvcTypeTrustingSocial = "TS";
  public static DigitalizationSvcTypePefindo = "PEFINDO";
  public static DigitalizationSvcTypeDukcapil = "DUKCAPIL";
  public static DigitalizationSvcTypeRapindo = "RAPINDO";
  public static DigitalizationSvcTypeProfind = "PROFIND";
  public static DigitalizationSvcTypeSlik = "SLIK";

  //LIST APP STEP
  public static AppCurrStepNap2 = {
    "NAPD": CommonConstant.AppStepNapd,
    "REF": CommonConstant.AppStepRef,
    "APP": CommonConstant.AppStepApp,
    "ASSET": CommonConstant.AppStepAsset,
    "COLL": CommonConstant.AppStepColl,
    "INS": CommonConstant.AppStepIns,
    "LFI": CommonConstant.AppStepLIns,
    "FIN": CommonConstant.AppStepFin,
    "TC": CommonConstant.AppStepTC,
    "UPL_DOC": CommonConstant.AppStepUplDoc,
    "INVOICE": CommonConstant.AppStepInvoice,
    "CMPLTN": CommonConstant.AppStepCustCmpltn,
    "AEX": CommonConstant.AppStepAssetExpense
  }

  public static CompanyTypePT = "PT";

  // UI ROLEPICK
  public static IS_USE_NEW_ROLEPICK = "IS_USE_NEW_ROLEPICK";
  // SysCtrlCoy
  public static IsEODRun = "IsEODRun"
}

export class CommonConstant {
  //FORM
  public static INVALID_FORM = "INVALID";

  // ADD EDIT DELETE UPDATE
  public static ADD = 'Add';
  public static EDIT = 'Edit';
  public static DELETE = 'Delete';
  public static UPDATE = 'Update';

  // Behaviour
  public static DEFAULT = 'DEF';

  //Application Item
  public static MENU = "Menu";
  public static ENVIRONMENT_MODULE = 'EnvironmentModule';
  public static USER_ACCESS = "UserAccess";
  public static USER_NAME = "UserName";
  public static USER_NAME_LOCAL_STORAGE = "Username";
  public static OFFICE_CODE = "OfficeCode";
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
  // Module
  public static LOAN_ORIGINATION = "LOS";
  public static FOUNDATION = "FOUNDATION";

  // COMPONENTS
  public static LINE = 'Line';
  public static LINE_AREA_DASHBOARD = 'lineAreaDashboard';

  //Apv Category
  public static ApvCategoryCreditApproval = "CRD_APV"
  public static ApvCategoryPackageValidityChecking = "PCKG_VLDT_APV"
  public static ApvCategoryPreGoLive = "PRE_GPV_APV"
  public static ApvCategoryOfferingValidity = "OFF_VLD_APV"
  public static INV_VERF_RESULT_STAT = "INV_VERF_RESULT_STAT";
  public static ApvCategoryApplicaitonApproval = "APP_OPL_APV";
  public static ApvCategoryDocumentChecklistApproval = "DOC_CHCKLIST_APV";

  //CUST TYPE
  public static CustTypePersonal = "PERSONAL";
  public static CustTypeCompany = "COMPANY";
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

  //LEAD STAT
  public static LeadStatCancel = "CAN";
  public static LeadStatNew = "NEW";
  public static LeadStatReject = "RJC";

  //LEAD STEP
  public static LeadStepCancel = "CAN";
  public static LeadStepNew = "NEW";
  public static LeadStepReject = "RJC";
  public static LeadStepSelfVerification = "SVR";

  //ASSET CONDITION 
  public static AssetConditionUsed = "USED";
  public static AssetConditionNew = "NEW";

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
  public static AppStepPO = "PO";
  public static AppStepOFVC = "OFVC";
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
  public static CFRFN4W = "CFRFN4W";
  public static CFRFN = "CFRFN";
  public static CFNEWCAR = "CFNEWCAR";
  public static CFNA = "CFNA";
  public static CENTER_GROUP_CODE = "CG";
  public static ROS = "ROS";
  public static OPL = "OPL";
  //OFFICE TYPE
  public static HeadOffice = "HO";
  public static HeadOfficeName = "Head Office";
  public static CenterGroup = "Center Group"

  public static GENERAL = "GENERAL";
  public static FACTORING = "FACTORING";
  public static ID_TYPE_NPWP = "NPWP";

  public static SALES_JOB_CODE = "SALES_PERSON";
  public static ADMIN_HEAD_JOB_CODE = "ADMIN_HEAD";
  public static BRANCH_MANAGER_JOB_CODE = "BRANCH_MANAGER";
  public static SUPERVISOR_JOB_CODE = "SUPERVISOR";
  
  public static REF_REASON_MOU_GENERAL = "MOUC_GEN_RVW";
  public static REF_REASON_MOU_FACTORING = "MOUC_FCTR_RVW";

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

  //STATUS GRP
  public static StatusGrpVerfResultStat = "VERF_RESULT_STAT";
  public static VerfResultStatSuccess = "SCS";
  public static VerfResultStatFailed = "FAIL";
  public static TrxTypeCodePhn = "PHN";
  public static VerfTrxTypeCodePhn = "PHN_VERIF";
  public static VerfTrxTypeCodeInvoice = "INVOICE";
  public static VerfResultStatCodeNew = "NEW";
  public static RtnHandlingReturnStatDone = "DONE";
  public static CrdInvstgStatDone = "DONE";
  public static CrdRvwStatDone = "DONE";
  public static ASSET_TYPE_CAR = "CAR";
  public static LICENSE_PLATE_NO = "LICENSE PLATE NO";
  public static OFFERING_VALIDITY_APV = "OFF_VLD_APV";

  //APV RESULT
  public static ApvResultReturn = "Return";
  public static ApvResultReturnFinal = "ReturnFinal";
  public static ApvResultRejectFinal = "RejectFinal";

  //REF PROD COMPNT
  public static RefProdCompntCodeWayOfFinancing = "WAY_OF_FINANCING";
  public static RefProdCompntCodePurposeOfFinancing = "PURPOSE_OF_FINANCING";
  public static RefProdCompntCodeCrApvResExpDays = "CR_APV_RES_EXP_DAYS";
  public static CollateralNeeded = "COLLATERALNEEDED";
  public static RefProdCompntCodeDisburseToCust = "DISBURSE_TO_CUST";

  // PRODUCT BEHAVIOUR
  public static ProductBehaviourLock = "LOCK";
  public static ProductBehaviourDefault = "DEFAULT";

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

  //APP CUST 
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
  public static AddrTypeOthBiz = "OTHERBIZ";
  public static AddrTypeCompany = "COMPANY";
  public static AddrTypeEmergency = "EMERGENCY";
  public static AddrTypeContactInfo = "CONTACT";

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

  // INSURANCE ADDITIONAL COVERAGE
  public static MrAddCvgTypeCodeLoading = 'LOADING';
  public static AddCvgTypeNameLoading = 'Loading';
  public static MrAddCvgTypeCodeTpl = 'TPL';


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
  public static RefReasonTypeDocChecklist = "DCK_LIST";
  public static RefReasonTypeCodeInvoiceDataVerif = "INVOICE_DATA_VERIF";
  public static RefReasonTypeCodeProdDeactivate = "PROD_DEACT";

  // INST TYPE
  public static SINGLE_INST_TYPE = "SINGLE";
  public static MULTIPLE_INST_TYPE = "MULTIPLE";
  public static PAY_FREQ_MONTHLY = "MONTHLY";
  public static INST_SCHM_REGULAR_FIXED = "RF";

  // MR ID TYPE CODE
  public static MrIdTypeCodeEKTP = "EKTP";
  public static MrIdTypeCodeSIM = "SIM";
  public static MrIdTypeCodeKITAS = "KITAS";
  public static MrIdTypeCodeNPWP = "NPWP";
  public static MrIdTypeCodeAKTA = "AKTA";

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
  public static ReturnHandlingEditComRsvFnd = "RTN_EDIT_COM_RSV_FND";
  public static ReturnHandlingAddColtr = "RTN_ADD_COLTR";
  public static ReturnHandlingAddTc = "RTN_ADD_TC";
  public static ReturnHandlingInvoice = "RTN_INVOICE_VERF";
  public static ReturnStatNew = "NEW";
  public static ReturnStatRequest = "REQ";
  public static ReturnStatus = "Status";

  public static TitleSupplier = "List Supplier Commission Data";
  public static TitleSupplierEmp = "List Supplier Employee Commission Data";
  public static TitleReferantor = "List Referantor Commission Data";
  public static ReturnObj = "ReturnObject";
  public static RefMasterObjs = "RefMasterObjs";
  public static Result = "Result";

  public static RefMasterTypeCodeCustType = "CUST_TYPE";
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
  public static RefMasterTypeCodeVerfSubjRelation = "VERF_SUBJ_RELATION";
  public static RefMasterTypeCodeCrdRvwAnalysisItem = "CRD_RVW_ANALYSIS_ITEM";
  public static RefMasterTypeCodeCrdInvstgAnalysisItem = "CRD_INVSTG_ANALYSIS_ITEM";
  public static RefMasterTypeCodeInterestInputType = "INTEREST_INPUT_TYPE";
  public static RefMasterTypeCodeAppPaidBy = "APP_PAID_BY";
  public static RefMasterTypeCodeInterestTypeGeneral = "INTRSTTYPE";
  public static RefMasterTypeCodeInterestTypeFactoring = "INTEREST_TYPE";
  public static RefMasterTypeCodeTopCalcBased = "TOP_CALC_BASED";
  public static RefMasterTypeCodeSubsidyFromType = "SUBSIDY_FROM_TYPE";
  public static RefMasterTypeCodePoItemCode = "PO_ITEM_CODE";
  public static RefMasterTypeCodeFinDataCalcBaseOn = "FIN_DATA_CALC_BASE_ON";
  public static PurchaseOrderItemTypeNonFee = "NON_FEE";
  public static PurchaseOrderItemTypeFee = "FEE";
  public static RefProdCompFirstInstType = "FIRSTINSTTYPE";
  public static RefProdCompAssetCond = "ASSETCOND";
  public static RefMasterTypeCodeProvisionSource = "PROVISION_SOURCE";
  public static RefMasterTypeCodeCharacteristicCredit = "CHARACTERISTIC_OF_CREDIT";
  public static RefMasterTypeCodeWayOfRestructure = "WAY_OF_RESTRUCTURE";
  public static RefMasterTypeStepUpStepDownInputTypePrcnt = "PRCNT";
  public static RefMasterTypeCodeSalutation = "SALUTATION";
  public static RefMasterTypeCodePaymentType = "PAYMENT_TYPE";
  public static RefMasterTypeCodeCustExpsrType = "CUST_EXPSR_TYPE";
  public static RefMasterTypeCodeResidualType = "RESIDUAL_TYPE";
  public static RefMasterTypeCodeOperatingMargin = "OPERATING_MARGIN_TYPE";
  public static RefMasterTypeCodeCashflowItem = "CASHFLOW_ITEM";
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

  //Martial Status
  public static MasteCodeMartialStatsMarried = "MARRIED";

  //Relationship Code
  public static MasteCodeRelationshipSpouse = "SPOUSE";

  // Rule Behaviour
  public static RuleBehaviourLock = "LOCK";

  //Status Code
  public static STATUS_CODE_USER_LOCKED = "002";

  //Paid By
  public static PAID_BY_CUST = "CUST";
  public static PAID_BY_CUST_FCTR = "CUST_FCTR";

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
  public static GSCodeIntegratorCheckBySystem = "INTEGRATOR_CHECK_BY_SYSTEM";
  public static GSCodeInputOPLFeeType = "INPOPLFEETYPE";
  public static GSCodeInputOPLFeeBehaviour = "INPOPLFEETBHV";
  public static GSCodeIsUseDigitalization = "IS_USE_DIGITALIZATION";
  public static GSCodeLobKta = "LOB_KTA";
  public static GSSerialNoRegex = "SERIAL_NO_REGEX";


  //Serial Item
  public static Chassis_No = "Chassis No";
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
  public static SCHM_CODE_MOU_APV_FACTORING = "MOUC_FCTR_APV";
  public static SCHM_CODE_APV_PRE_GO_LIVE = "PRE_GLV_APV_CF";
  public static SCHM_CODE_CRD_APV_CF = "CRD_APV_CF";
  public static SCHM_CODE_APV_RENT_APP = "APV_RENT_APP";

  public static CAT_CODE_MOU_APV_GENERAL = "MOUC_GEN_APV";
  public static CAT_CODE_MOU_APV_FACTORING = "MOUC_FCTR_APV";
  public static CAT_CODE_PRE_GO_LIVE_APV = "PRE_GPV_APV";
  public static CAT_CODE_CRD_APV = "CRD_APV";
  public static CAT_CODE_DOC_CHCLIST_APV = "DOC_CHCKLIST_APV";
  public static CAT_CODE_APP_OPL_APV = "APP_OPL_APV";

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
  public static DmsOverideUpload = "Upload";
  public static DmsOverideView = "View";
  public static DmsOverideUploadView = "Upload,View";
  public static DmsViewCodeCust = "ConfinsCust";
  public static DmsViewCodeApp = "ConfinsApp";
  public static DmsViewCodeAgr = "ConfinsAgr";
  public static DmsViewCodeMou = "ConfinsMou";
  public static DmsViewCodeLead = "ConfinsLead";

  public static DefaultSlikSecEcoCode = "930000";

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

  //Cashflow Item Type
  public static CashFlowItemMasterCodeFeeCptlz = "CASHFLOW_FEE_CPTLZ";
  public static CashFlowItemMasterCodeInstallment = "CASHFLOW_INSTALLMENT";
  public static CashFlowItemMasterCodeInsurance = "CASHFLOW_INSURANCE";
  public static CashFlowItemMasterCodeMaint = "CASHFLOW_MAINT";
  public static CashFlowItemMasterCodeReplaceCar = "CASHFLOW_REPLACE_CAR";
  public static CashFlowItemMasterCodeStnk = "CASHFLOW_STNK";
  public static CashFlowItemMasterCodeOdb = "CASHFLOW_ODB";

  //oth expense opl
  public static OtherExpenseMasterCodeExpStn = "EXP_STN";
  public static OtherExpenseMasterCodeExpOdb = "ODB";
  public static OtherExpenseMasterCodeExpRc = "RC";

  //SYS CONFIG
  public static ConfigCodeIsUseDms = "IS_USE_DMS";
  public static SYS_CONFIG_USING_DMS_ADINS = "USING_DMS_ADINS"
  
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

  //PROD OFFERING
  public static PROD_OFF_STAT_ACT = "ACT";

  //APP STAT
  public static AppStatCancel = "CAN";
  public static AppStatReject = "RJC";
  
  // GENERAL SETTING CODE
  public static GS_CODE_SALES_OFFICER_CODE = "SALES_OFFICER_CODE";
}

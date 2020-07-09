
export class CommonConstant {

    //Apv Category
    public static ApvCategoryCreditApproval = "CRD_APV"
    public static ApvCategoryPackageValidityChecking = "PCKG_VLDT_APV"
    public static ApvCategoryPreGoLive = "PRE_GPV_APV"

    public static INV_VERF_RESULT_STAT = "INV_VERF_RESULT_STAT";

    //CUST TYPE
    public static CustTypePersonal = "PERSONAL";
    public static CustTypeCompany = "COMPANY";
    public static CustGrupIndentifierTypePersonal = "custGrpMember";
    public static CustGrupIndentifierTypeCompany = "custGrpMemberCompany";

    //CUST PERSONAL RELATIONSHIP
    public static SelfCustomer = "SELF";

    //OFFICE TYPE
    public static HeadOffice = "HO";
    public static CollectionGroup = "CG"
    public static CenterGroup = "Center Group"

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

    //ASSET CONDITION 
    public static AssetConditionUsed = "USED";
    public static AssetConditionNew = "NEW";

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

    //REF PROD COMPNT
    public static RefProdCompntCodeWayOfFinancing = "WAY_OF_FINANCING";
    public static RefProdCompntCodePurposeOfFinancing = "PURPOSE_OF_FINANCING";

    //VERIFICATION
    public static VerificationNew = "NEW";
    public static VerificationFail = "FAIL";
    //Asset Usage 
    public static AssetUsageNonComm = "NON_COMM"

    //Nationality
    public static NationalityLocal = "LOCAL";

    //App Collateral Attr
    public static AppCollateralAttrAssetRegion = "ASSET_REGION";
    public static AppCollateralAttrColor = "COLOR";
    public static AppCollateralAttrCategory = "CATEGORY";
    public static AppCollateralAttrTransmition = "TRANSMITION";
    public static AppCollateralAttrTaxCityIssuer = "TAX_CITY_ISSUER";
    public static AppCollateralAttrBpkbIssueDate = "BPKB_ISSUE_DATE";

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

    //FEE TYPE
    public static FeeTypeAmt = "AMT";
    public static FeeTypePrcnt = "PRCNT";

    //DOWM PAYMENT TYPE
    public static DownPaymentTypeAmt = "AMT";
    public static DownPaymentTypePrcnt = "PRCNT";


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

    //REF PROD COMPNT
    public static RefProdCompntAssetType = "ASSETTYPE";
    public static RefProdCompntSupplSchm = "SUPPLSCHM";
    public static RefProdCompntAssetSchm = "ASSETSCHM";
    public static RefProdCompntLob = "LOB";
    public static RefProdCompntCurr = "CURR";
    public static RefProdCompntPayFreq = "PAYFREQ";
    public static RefProdCompntProdType = "PROD_TYPE";

    // REF REASON TYPE CODE
    public static RefReasonTypeCodeAppAgrCncl = "APP_AGR_CNCL";
    public static RefReasonTypeCodePreGlvApv = "PRE_GLV_APV";
    public static RefReasonTypeCodeCrdReview = "CRD_REVIEW";

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
    public static LabelSupplier = "Supplier";
    public static LabelSupplierEmp = "Supplier Employee";
    public static LabelReferantor = "Referantor";
    public static ContentSupplier = "Supplier";
    public static ContentSupplierEmp = "SupplierEmployee";
    public static ContentReferantor = "Referantor";
    public static CommissionReceipientTypeCodeSupplier = "SUPPLIER";
    public static CommissionReceipientTypeCodeSupplierEmp = "SUPPLIER_EMP";
    public static CommissionReceipientTypeCodeReferantor = "REFERANTOR";
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
    public static ReturnHandlingAddPhnVerf = "RTN_ADD_PHN_VERF";
    public static ReturnHandlingEditComRsvFnd = "RTN_EDIT_COM_RSV_FND";
    public static ReturnHandlingAddColtr = "RTN_ADD_COLTR";
    public static ReturnStatNew = "NEW";
    public static ReturnStatRequest = "REQ";

    public static TitleSupplier = "List Supplier Commission Data";
    public static TitleSupplierEmp = "List Supplier Employee Commission Data";
    public static TitleReferantor = "List Referantor Commission Data";
    public static ReturnObj = "ReturnObject";

    public static RefMasterTypeCodeCustType = "CUST_TYPE";
    public static RefMasterTypeCodeSlsRecom = "SLS_RECOM";
    public static RefMasterTypeCodeWOP = "WOP";
    public static RefMasterTypeCodeInstSchm = "INST_SCHM";
    public static RefMasterTypeCodePayFreq = "PAYFREQ";
    public static RefMasterTypeCodeCustNotifyOpt = "CUST_NOTIF_OPT";
    public static RefMasterTypeCodeFirstInstType = "FIRST_INST_TYPE";
    public static RefMasterTypeCodeInterestType = "INTRSTTYPE";
    public static RefMasterTypeCodeAssetCondition = "ASSET_CONDITION";
    public static RefMasterTypeCodeAssetUsage = "ASSET_USAGE";
    public static RefMasterTypeCodeCustPersonalRelationship = "CUST_PERSONAL_RELATIONSHIP";
    public static RefMasterTypeCodeCustCompanyRelationship = "CUST_COMPANY_RELATIONSHIP"; 
    public static RefMasterTypeCodeIdType = "ID_TYPE";
    public static RefMasterTypeCodeRateType = "RATE_TYPE";
    public static RefMasterTypeCodeAddrType = "ADDR_TYPE";
    public static RefMasterTypeCodeGracePeriodType = "GRACE_PERIOD_TYPE";
    public static RefMasterTypeLegalReview  = "LGL_REVIEW";
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
    public static RefMasterTypeCodeJobPosition= "JOB_POSITION";
    public static RefMasterTypeCodeCoyScale = "COY_SCALE";
    public static RefMasterTypeCodeJobStat = "JOB_STAT";
    public static RefMasterTypeCodeInvestmentType = "INVESTMENT_TYPE";
    public static RefMasterTypeCodeLegalDocType = "LEGAL_DOC_TYPE";
    public static RefMasterTypeCodeCustRelationship = "CUST_RELATIONSHIP";
    public static RefMasterTypeCodeSourceIncome = "SOURCE_INCOME";
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
    public static RefMasterTypeCodeInsCoverPeriod= "INS_COVER_PERIOD"; 
    public static RefMasterTypeCodePayPeriodToInsco= "PAY_PERIOD_TO_INSCO"; 
    public static RefMasterTypeCodeLifeInsPayMethod= "LIFE_INS_PAY_METHOD"; 
    public static RefMasterTypeCodeLifeInscoBranch= "LIFE_INSCO_BRANCH"; 
    public static RefMasterTypeCodeReturnTask = "RETURN_TASK"; 
    public static RefMasterTypeCodeVerfSubjRelation = "VERF_SUBJ_RELATION"; 
    public static RefMasterTypeCodeCrdRvwAnalysisItem = "CRD_RVW_ANALYSIS_ITEM"; 
    public static RefMasterTypeCodeCrdInvstgAnalysisItem = "CRD_INVSTG_ANALYSIS_ITEM"; 
    
    public static RefProdCompFirstInstType = "FIRSTINSTTYPE";
    public static RefProdCompAssetCond = "ASSETCOND";


    //RATE TYPE
    public static RateTypeFlat = "FLT";
    public static RateTypeEffective = "EFCTV";
    
}
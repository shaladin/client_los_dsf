import {CurrencyMaskInputMode} from 'ngx-currency';

export class CommonConstantX {
    //RefMaster
    public static RefMasterTypeCodeSbePositionMnl = "SBE_POSITION_MNL";

    //CommissionRsvFund Allocations
    public static AllocationFronInsuranceIncomeCode= "INSURANCE_INCOME";

    //Ref Master Type Code
    public static RefMasterTypeCodeOrdStatus = "ORD_STATUS";
    public static RefMasterTypeCodeStatusBpkb = "STATUS_BPKB";
    public static RefMasterTypeCodePayPeriodToInsco = "PAY_PERIOD_TO_INSCO"

    //LOB
    public static SLB = "SLB";

    //WOP Descr
    public static WOPADDescr = "Auto Debit";

    //General Setting Code
    public static GSVendorSlbCode = "VENDOR_SLB_CODE";
    public static GSVendorMpfFdCode = "VENDOR_MPFFD_CODE";
    public static RefMasterTypeCodeMouFctrType = 'MOU_FCTR_TYPE';
    public static GSCodePefindoBasicRole = "PEFINDO_BASIC_ROLE";
    public static GsCodePONoNeedToPayBank = "PO_NO_NEED_TO_PAY_BANK_ACC";
    public static GsCodeIsDoDtValidation = "ISDODTVALIDATION";
    public static GsCodeIsAllowSkipSurvey = "IS_ALLOW_SKIP_SURVEY";
    public static GsCodeCustCompletionByPass = "CUST_COMPLETION_BY_PASS";
    public static GsCodeMandatoryByCollType = "MANDATORY_BY_COLL_TYPE"
    public static GsCodeAutoDebitBca = "AUTO_DEBIT_BCA";
    public static GsCodeMinTenorAssetFL = "MIN_TENOR_ASSET_FL";
    public static GsCodeMapPofWofFL = "MAP_POF_WOF_FL";
    public static GsCodeHideLifeInsCapitalized = "HIDE_LIFE_INS_CAPITALIZED";

    //General Setting Value
    public static GsValueOfHideLifeInsCapitalized = "1";

    //Ref Reason Type Code
    public static RefReasonTypeCodeCessiePreGoLive = "CESSIE_PREGOLIVE";
    public static RefReasonTypeCodeEditCommAfterApproval = "EDIT_COMM_AFT_APV";

    // MR ID TYPE CODE
    public static MrIdTypeCodePassport = "PASSPORT";
    public static MrIdTypeCodeNIB = "NIB";
    public static MrIdTypeCodeTDPNIB = "TDPNIB";

    //Approval Scheme
    public static SCHM_CODE_CESSIE_PGLV_APV = "CESSIE_PGLV_APV_SCHEME";
    public static SCHM_CODE_CHG_MOU_DLFN_APV = "CHG_MOU_DLFN_APV";
    public static SCHM_CODE_CHG_MOU_FCTR_APV  = "CHG_MOU_FCTR_APV ";
    public static SCHM_CODE_CHG_MOU_EXP_APV = "CHG_MOU_EXP_APV";
    public static SCHM_CODE_CHG_MOU_EXP_DLFN_APV = "CHG_MOU_EXP_DLFN_APV";
    public static SCHM_CODE_CHG_MOU_EXP_FCTR_APV = "CHG_MOU_EXP_FCTR_APV";
    public static SCHM_CODE_EDIT_COMM_AFT_APV_APV_SCHM_NORMAL = "EDIT_COMM_AFT_APV_APV_SCHM_NORMAL";
    public static EDIT_COMM_AFT_APV_APV_SCHM = 'EDIT_COMM_AFT_APV_APV_SCHM';


    //Approval Type
    public static CESSIE_PRE_GLV_APV_TYPE = "CESSIE_PRE_GLV_APV_TYPE";
    public static GO_LIVE_APV_TYPE_APV_TYPE = "GO_LIVE_APV_TYPE";
    public static EDIT_COMM_AFT_APV_APV_TYPE = "EDIT_COMM_AFT_APV_APV_TYPE";

    //Approval Category
    public static CESSIE_PRE_GPV_APV_CATEGORY = "CESSIE_PGLV_APV";
    public static CAT_CODE_GO_LIVE_APV = "GO_LIVE_APV";
    public static CAT_CODE_END_DT_GO_LIVE_APV = "END_DATE_GO_LIVE_APV";
    public static CAT_CODE_EDIT_COMM_AFT_APV_APV = "EDIT_COMM_AFT_APV_APV";



  //Add Interest Paid By
    public static AdditionalInterestPaidByCustomer = "CU";

    //Cessie
    public static INIT_CRT_CESSIE_PROCESS_DEFAULT_STAT_NOT_YET_SET = "-";

    //APP ASSET CONDITION
    public static APP_ASSET_CONDITION_CODE_NEW = "NEW";
    public static APP_ASSET_CONDITION_CODE_USED = "USED";
    
    // APP ASSET ATTRIBUTE
    public static APP_ASSET_ATTRIBUTE_PLAT_COLOR = "PLAT COLOR";

    //Ref Master
    public static REF_MASTER_ASSET_CONDITION_DESCR_USED = "Used";
    public static REF_MASTER_CODE_NO_ADD_INTEREST = "NO_ADD_INTEREST";

    //Return Handling
    public static ReturnHandlingAddSurveyVerf = "RTN_ADD_SRVY";

    //Default SlikSecEcoCode
    public static DefaultSlikSecEcoCode = "ECOSLIK_DEFAULT";

    public static CurrencyMaskPrct = { suffix: ' %', thousands: ',', decimal: '.', align: 'right', allowNegative: false, allowZero: true, precision: 6, nullable: false, inputMode: CurrencyMaskInputMode.NATURAL };

    //Insurance
    public static PayPeriodAnnualy = "ANNUALY";
    public static ALLRISK = "ALLRISK";
    public static ALL_RISK = "ALL RISK"
    public static TLO = "TLO";
    public static TOTAL_LOSS_ONLY = "TOTAL LOSS ONLY"
    public static ALLRISK_MIP = "ALLRISK_MIP";
    public static ALL_RISK_MIP = "ALL_RISK_MIP";
    public static TLO_MIP = "TLO_MIP";
    public static TOTAL_LOSS_ONLY_MIP = "TOTAL LOSS ONLY MIP";
    public static ALLRISK_OTR = "ALLRISK_OTR";
    public static ALL_RISK_OTHER = "ALL RISK OTHER";

    //Survey Verification
    public static ACT_CODE_SURVEY_VERIF = "SURVEY_"
    public static APP_STEP_SURVEY_VERIF = "SRVY_VRF"
    public static RETURN_HANDLING_ADD_SURVEY = "RTN_ADD_SRVY_";
    public static APP_STEP_RETURN_SURVEY_VERIF = "ADD_SRVY_"

    //LOB CODE
    public static CFNA_LOB_CODE_FD = "FD";
    public static CFNA_LOB_CODE_MPF = "MPF";
    public static CF4W_LOB_CODE_CF = "CF";
    public static FL4W_LOB_CODE_LS = "LS";
    public static FL4W_LOB_CODE_SLB = "SLB";

    // BOOLEAN CONDITION
    public static TRUE_CONDITION = "1";
    public static FALSE_CONDITION = "0";

    // NAP 4 Tab
    public static FINANCIAL_TAB = "Financial";

    //DDL COMMISSION
    public static COM_DDL_SUPPL_EMP = "COM_DDL_SUPPL_EMP";

    //PO
    public static SRC_AGRMNT_FIN_DATA_FIELD_TOTAL_INS_CUST_AMT = "TotalInsCustAmt";

    //GS
    public static GSCodeShareholderJobPostIsOnwer = "SHAREHOLDER_JOB_POST_IS_OWNER";
    public static GSCodeDisableRequiredNotesApvAct = "DISABLE_REQUIRED_NOTES_APV_ACT";
    public static GSCodeDistanceGoLiveDtToSystemDt = "DISTANCE_GOLIVE_DT";
    public static GSCodeDistanceMaturityDtToSystemDt = "DISTANCE_MATURITY_DT";
    public static GSCodeConfigPayloadRptSubrpt = "CONFIG_PAYLOAD_RPT_SUBRPT";

    //NAP 4
    public static SubjRelationLessee = "LESSEE";
    public static SubjRelationCustomer = "CUSTOMER";
    public static SubjRelationFamily = "FAMILY";
    public static SubjRelationShrholder = "SHAREHOLDER";
    public static SubjRelationGuarantor = "GUARANTOR";
    public static CustSubjFamily = "FAM";
    public static CustSubjShareholder = "SHR";
    public static CustSubjGuarantor = "GUAR";

    //Const Asset Tab
    public static DPType = "Down Payment Type";
    public static DP = "Down Payment";
    public static SDType = "Security Deposit Type";
    public static SD = "Security Deposit";

    //#region Auto Debit Registration
    public static REF_REASON_AUTO_DEBIT_REG = "AUTO_DEBIT_REG";
    public static REF_STATUS_AUTO_DEBIT_REG = "AUTO_DEBIT_REGIS_STAT"
    public static AUTO_DEBIT_STATUS_CAN = "CAN";
    public static AUTO_DEBIT_STATUS_INPAUTH = "INPAUTH";
    public static AUTO_DEBIT_STATUS_FLD = "FLD";

    public static GS_CODE_MAX_DIFF_DAYS = "MAX_DIFF_DAYS";
    //#endregion

}

import {CurrencyMaskInputMode} from 'ngx-currency';

export class CommonConstantX {
    //RefMaster
    public static RefMasterTypeCodeSbePositionMnl = "SBE_POSITION_MNL";

    //CommissionRsvFund Allocations
    public static AllocationFronInsuranceIncomeCode= "INSURANCE_INCOME";

    //Ref Master Type Code
    public static RefMasterTypeCodeOrdStatus = "ORD_STATUS";
    public static RefMasterTypeCodeStatusBpkb = "STATUS_BPKB";

    //LOB
    public static SLB = "SLB";

    //General Setting Code
    public static GSVendorSlbCode = "VENDOR_SLB_CODE";
    public static GSVendorMpfFdCode = "VENDOR_MPFFD_CODE";
    public static RefMasterTypeCodeMouFctrType = 'MOU_FCTR_TYPE';
    public static GSCodePefindoBasicRole = "PEFINDO_BASIC_ROLE";
    public static GsCodePONoNeedToPayBank = "PO_NO_NEED_TO_PAY_BANK_ACC";
    public static GsCodeIsDoDtValidation = "ISDODTVALIDATION";

    //Ref Reason Type Code
    public static RefReasonTypeCodeCessiePreGoLive = "CESSIE_PREGOLIVE";

    //Approval Scheme
    public static SCHM_CODE_CESSIE_PGLV_APV = "CESSIE_PGLV_APV_SCHEME";
    public static SCHM_CODE_CHG_MOU_DLFN_APV = "CHG_MOU_DLFN_APV";
    public static SCHM_CODE_CHG_MOU_FCTR_APV  = "CHG_MOU_FCTR_APV ";
    public static SCHM_CODE_CHG_MOU_EXP_APV = "CHG_MOU_EXP_APV";
    public static SCHM_CODE_CHG_MOU_EXP_DLFN_APV = "CHG_MOU_EXP_DLFN_APV";
    public static SCHM_CODE_CHG_MOU_EXP_FCTR_APV = "CHG_MOU_EXP_FCTR_APV";

    //Approval Type
    public static CESSIE_PRE_GLV_APV_TYPE = "CESSIE_PRE_GLV_APV_TYPE";
    public static GO_LIVE_APV_TYPE_APV_TYPE = "GO_LIVE_APV_TYPE";

    //Approval Category
    public static CESSIE_PRE_GPV_APV_CATEGORY = "CESSIE_PGLV_APV";
    public static CAT_CODE_GO_LIVE_APV = "GO_LIVE_APV";
    public static CAT_CODE_END_DT_GO_LIVE_APV = "END_DATE_GO_LIVE_APV";


    //Add Interest Paid By
    public static AdditionalInterestPaidByCustomer = "CU";

    //Cessie
    public static INIT_CRT_CESSIE_PROCESS_DEFAULT_STAT_NOT_YET_SET = "-";

    //APP ASSET CONDITION
    public static APP_ASSET_CONDITION_CODE_NEW = "NEW";
    public static APP_ASSET_CONDITION_CODE_USED = "USED";

    //Ref Master
    public static REF_MASTER_ASSET_CONDITION_DESCR_USED = "Used";

    //Return Handling
    public static ReturnHandlingAddSurveyVerf = "RTN_ADD_SRVY";

    //Default SlikSecEcoCode
    public static DefaultSlikSecEcoCode = "ECOSLIK_DEFAULT";

    public static CurrencyMaskPrct = { suffix: ' %', thousands: ',', decimal: '.', align: 'right', allowNegative: false, allowZero: true, precision: 6, nullable: false, inputMode: CurrencyMaskInputMode.NATURAL };

    //Insurance
    public static PayPeriodAnnualy = "ANNUALY";

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
    
}

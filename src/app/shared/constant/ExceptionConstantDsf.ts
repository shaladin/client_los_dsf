export class ExceptionConstantDsf {
    public static NOT_ELIGIBLE = "You dont had Access to this page!";
    public static SPV_DPC_NOT_AVAILABLE = "Please Set Supervisor for your Account!";
    public static AGR_PARENT_NOT_AVAILABLE = "All Agreement Parent for this Customer Already had On Going App";
    public static SLC_AGR_PARENT_NOT_AVAILABLE = "Selected Agreement Parent for this Customer Already had On Going App";

    public static AGR_PARENT_AVAILABLE_NOT_INLINE = "All Available Agreement Parent for this Customer are not inline with this App LOB";
    public static SLC_AGR_PARENT_AVAILABLE_NOT_INLINE = "Selected Agreement Parent is not allowed for this Line of Business";
    public static CUST_NOT_HAVE_AGR_PARENT = "Customer must have Agreement Parent";
    public static VALIDATE_REQUESTED_PLAFOND = "Requested Plafond must be Equal or Lower than Max Plafond Master Agreement";
    public static EXCEEDED_FROM_PLAFOND_MASTER = "Loan Object must be Equal or Lower than Max Plafond Master Agreement";
    public static EXCEEDED_FROM_REMAINING_PLAFOND = "Loan Object must be Equal or Lower than Remaining Plafond";
    public static EXCEEDED_FROM_REQUESTED_PLAFOND = "Loan Object must be Equal or Lower than Requested Plafond";

    public static SEARCH_CUSTOMER_VALIDATION = "Please fill Customer Name or Customer No for seacrhing Agreement Parent!";
    public static CHECK_API_LMS_R2_UP = "Connection error, please try again in a minute";

    public static VALIDATE_MIN_PLAFOND = "Max Plafond Master Agreement is Not Yet Sufficient Plafond Limit";
    public static VALIDATE_TENOR_LIMIT = "Minimum Tenor is Not Yet Sufficient";

    public static PLAFOND_USED_GREATER = "Plafond Used Greater Than Plafond Based on Collateral";
}


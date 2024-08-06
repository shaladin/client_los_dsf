import { CustDuplicateXObj } from "./cust-duplicate-x-obj.model";
import { NegCustDuplicateXObj } from "./neg-cust-duplicate-x-obj.model";

export class DupCheckOutputSaveXObj {
    Key: string;
    DuplicateObj: CustDuplicateXObj;
    DuplicateNegativeObj: NegCustDuplicateXObj;
    constructor() {
        this.Key = "";
    }

    public static KeyEditSave = "SAVE";
    public static KeyEditSaveDup = "SAVE_DUP"
    public static KeyEditSaveDupNeg = "SAVE_DUP_NEG"
}
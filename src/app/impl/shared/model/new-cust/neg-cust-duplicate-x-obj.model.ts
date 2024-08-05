import { CustDuplicateXObj } from "./cust-duplicate-x-obj.model";

export class NegCustDuplicateXObj extends CustDuplicateXObj{
    NegativeCustId: number;
    MrNegCustSource: string;
    MrNegCustType: string;
    constructor(){
        super();
    }
}
import { SingleNegCustIndicatorObj } from "./single-neg-cust-indicator-obj.model";

export class NegCustIndicatorObj{
    
    public Customer?: SingleNegCustIndicatorObj = null;
    public Spouse?: SingleNegCustIndicatorObj = null;
    public Shareholder?: SingleNegCustIndicatorObj = null;
    public Guarantor?: SingleNegCustIndicatorObj = null;

    constructor(){
        
    }
}
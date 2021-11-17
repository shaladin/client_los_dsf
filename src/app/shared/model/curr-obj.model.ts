export class CurrObj {
    refCurrId: number;
    currName: string;
    currCode: string;
    roundedAmt: number;
    minRefundAmt: number;
    toleranceAmt: number;
    cofId: number;
    regRptCode: string;
    lbppCode: string;
    isActive: boolean;
    constructor() { this.refCurrId = 0; }
}
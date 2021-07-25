import { RentSchdlOplObj } from "./RentSchdlOpl.Model";

export class OutputCalcFinancialCofObj {
    CofAmt: number;
    CofPrincipalPeriodAmt: number;
    ListRentSchdlOpl: Array<RentSchdlOplObj>;

    constructor() {
        this.CofAmt = 0;
        this.CofPrincipalPeriodAmt = 0;
        this.ListRentSchdlOpl = new Array<RentSchdlOplObj>();
    }
}
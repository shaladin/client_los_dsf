import { AppCommissionDObj } from "./AppCommissionDObj.Model";

export class AppCommissionHObj{
    AppCommissionHId: number;
    AppId: number;
    MrCommissionRecipientTypeCode: string;
    CommissionRecipientRefNo: string;
    MrTaxKindCode: string;
    MrTaxCalcMethodCode: string;
    BankCode: string;
    BankName: string;
    BankBranch: string;
    BankAccNo: string;
    BankAccName: string;
    TotalCommissionAmt: number;
    TotalCommissionAfterTaxAmt: number;
    TotalDisburseAmt: number;
    TotalExpenseAmt: number;
    TaxAmt: number;
    VatAmt: number;
    PenaltyAmt: number;
    TaxpayerNo: string;
    ListappCommissionDObj: Array<AppCommissionDObj>;
    AppCommissionDs: Array<AppCommissionDObj>;
    RowVersion: string;
    ReservedField1: any;
    ReservedField2: any;
    ReservedField3: any;
    ReservedField4: any;
    ReservedField5: any;

    constructor(){
        this.AppCommissionHId = 0;
    }
}
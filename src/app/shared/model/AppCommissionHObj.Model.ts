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
    RowVersion: string;
    ReservedField1: string;
    ReservedField2: string;
    ReservedField3: string;
    ReservedField4: string;
    ReservedField5: string;

    constructor(){
        this.AppCommissionHId = 0;
    }
}
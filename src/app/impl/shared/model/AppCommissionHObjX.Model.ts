import { AppCommissionDObjX } from "./AppCommissionDObjX.Model";
import { AppCommSupplEmpObjX } from "./AppCommSupplEmpObjX.model";

export class AppCommissionHObjX{
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
    RowVersion: string;
    MrIdTypeCode: string;
    ReservedField1: string;
    ReservedField2: string;
    ReservedField3: string;
    ReservedField4: string;
    ReservedField5: string;
    ListappCommissionDObj: Array<AppCommissionDObjX>;
    ListAppCommSupplEmpObj: Array<AppCommSupplEmpObjX>;
    AllocationAmount: number;
    CommissionAmtAfterTax: number;

    constructor(){
        this.AppCommissionHId = 0;
        this.AppId = 0;
        this.MrCommissionRecipientTypeCode = "";
        this.CommissionRecipientRefNo= "";
        this.MrTaxKindCode="";
        this.MrTaxCalcMethodCode="";
        this.BankCode="";
        this.BankName="";
        this.BankBranch="";
        this.BankAccNo="";
        this.BankAccName="";
        this.TotalCommissionAmt=0;
        this.TotalCommissionAfterTaxAmt=0;
        this.TotalDisburseAmt=0;
        this.TotalExpenseAmt=0;
        this.TaxAmt=0;
        this.VatAmt=0;
        this.PenaltyAmt=0;
        this.TaxpayerNo="";
        this.RowVersion="";
        this.ReservedField1="";
        this.ReservedField2="";
        this.ReservedField3="";
        this.ReservedField4="";
        this.ReservedField5="";
        this.ListappCommissionDObj = new Array<AppCommissionDObjX>();
        this.ListAppCommSupplEmpObj = new Array<AppCommSupplEmpObjX>();
        this.AllocationAmount=0;
        this.CommissionAmtAfterTax=0;
    }
}
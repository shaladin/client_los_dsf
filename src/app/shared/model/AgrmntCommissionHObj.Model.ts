import { VendorBankAccObj } from "./VendorBankAcc.Model";

export class AgrmntCommissionHObj {
    AgrmntCommissionHId: number;
    AgrmntId: number;
    MrCommissionRecipientTypeCode: string;
    MrCommissionRecipientTypeCodeDesc: string;
    CommissionRecipientRefNo: string;
    CommissionRecipientRefNoDesc: string;
    CommissionRecipientPositionDesc: string
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
    SupplierName: string;
    RowVersion: string;
    ReservedField1: any;
    ReservedField2: any;
    ReservedField3: any;
    ReservedField4: any;
    ReservedField5: any;
    VendorBankAccObjs: Array<VendorBankAccObj>;
}
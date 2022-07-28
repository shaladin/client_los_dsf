import { VendorBankAccObj } from "app/shared/model/vendor-bank-acc.model";
import { AgreementCommissionDXObj } from "./AgreementCommissionDObjX";

export class AgreementCommissionHXObj {
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
    ListAgrmntCommissionDObj: Array<AgreementCommissionDXObj>;
    AgrmntCommissionDs: Array<AgreementCommissionDXObj>;
    MrIdTypeCode: string;
    SupplierName: string;
    RowVersion: string;
    ReservedField1: string;
    ReservedField2: string;
    ReservedField3: string;
    ReservedField4: string;
    ReservedField5: string;
    VendorBankAccObjs: Array<VendorBankAccObj>;
}

import { AppCustBankStmntObjX } from "./AppCustBankStmntObjX.Model";

export class AppCustBankAccObjX {
  AppCustBankAccId: number;
  AppCustId: number;
  BankCode: string;
  BankName: string;
  BankBranch: string;
  BankAccNo: string;
  BankAccName: string;
  IsBankStmnt: boolean;
  BankBranchRegRptCode: string;
  BalanceAmt: number;
  IsDefault: boolean;
  IsActive: boolean;
  BankInfo: string;
  MrPlafonFromBank: string;
  BegBalanceAmt: number;
  ListAppCustBankAccStmntObjX: Array<AppCustBankStmntObjX>;
  RowVersion: string[];

  constructor() {
    this.AppCustBankAccId = 0;
  }
}

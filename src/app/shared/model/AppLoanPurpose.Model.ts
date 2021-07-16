export class AppLoanPurposeObj{
    AppLoanPurposeId: number;
    AppId: number;
    MrLoanPurposeCode: string;
    MrLoanPurposeDescr: string; 
    IsDisburseToCust: boolean;
    SupplCode: string;
    SupplName: string;
    BudgetPlanAmt: number;
    SelfFinancingAmt: number;
    FinancingAmt: number;
    RowVersion: string;
    constructor() { this.AppLoanPurposeId=0 ,this.RowVersion = ""; }
}
export class LifeInsDObj {
    AppLifeInsDId: number;
    AppLifeInsHId: number;
    RowVersion: string;
    InsuredName : string;
    Age : number;
    MrCustTypeCode : string;
    SeqNo : number;
    BaseRate : number;
    CustRate : number;
    InscoRate : number;
    DiscRate : number;
    DiscRateToInsco: number;
    SumInsured : number;
    IsChecked: boolean;
  constructor() { this.AppLifeInsDId = 0; this.RowVersion = "" }
}

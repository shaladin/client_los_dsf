export class AppFixedObj {
    AppFixedId: number;
    AppId: number;
    MrFirstInstTypeCode: string;
    Tenor: number;
    SupplEffectiveRate: number;
    EffectiveRate: number;
    DownPaymentAmt: number;
    InstAmt: number;
    IsEditableDp: boolean;
    AssetPriceAmt: number;
    GracePeriod: number;
    MrGracePeriodTypeCode: string;
    InscoBranchCode: string;
    InsPackageCode: string;
    InsAdminFee: number;
    IsCoverLifeIns: boolean;
    LifeInsCoverSubject: string;
    LifeInscoBranchCode: string;
    LifeInsPaymentMethod: string;
    RowVersion: string;
  constructor() { this.AppFixedId = 0; this.RowVersion = "" }
}

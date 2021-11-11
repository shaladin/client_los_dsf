export class ResGetAllAssetDataForPOByAssetObj {

    ReturnObject : ResGetAllAssetDataForPOByAsset;

    constructor(){
        this.ReturnObject = new ResGetAllAssetDataForPOByAsset;
    }

}

export class ResGetAllAssetDataForPOByAsset {

    AppAssetListObj : Array<ResAppAssetForPOObj>;
    AppAssetAccListObj : Array<ResAppAssetAccForPoObj>
    AppCustAddrObj : ResAppCustAddrForPOObj;
    AgrmntObj : ResAgrmntForPOObj;
    AgrmntFeeListObj : Array<ResAgrmntFeeForPOObj>;
    AgrmntFinDataObj : ResAgrmntFinDataForPOObj;
    AgrmntSubsidyListObj : Array<ResAgrmntSubsidyObj>;
    VendorObj :  ResVendorForPOObj;
    VendorAddrObj: ResVendorAddrForPOObj;
    VendorBankAccObj : ResVendorBankAccForPOObj;
    PurchaseOrderExpiredDt : Date;

    ProportionalValue : number;
    TotalInsCustAmt : number;
    TotalLifeInsCustAmt : number;
    TotalPurchaseOrderAmt : number;
    DiffRateAmt : number;
    PurchaseOrderHId : number;
    Notes : string;
    RowVersionPO : string;
    
    constructor(){
        this.AppAssetListObj = new Array<ResAppAssetForPOObj>();
        this.PurchaseOrderExpiredDt = new Date();
    }

}

export class ResAppAssetForPOObj {
    
    FullAssetName : string;
    AssetPriceAmt : number;
    DownPaymentAmt : number;
    SerialNo1 : string;
    SerialNo2 : string;
    SerialNo3 : string;
    AssetNotes : string;
    RowVersion : string;

    constructor(){
        this.FullAssetName = "";
        this.AssetPriceAmt = 0;
        this.DownPaymentAmt = 0;
        this.SerialNo1 = "";
        this.SerialNo2 = "";
        this.SerialNo3 = "";
        this.AssetNotes = "";
        this.RowVersion = "";
    }

}

export class ResAppAssetAccForPoObj {
    AssetAccessoryName : string;
    AccessoryPriceAmt : number;
    DownPaymentAmt : number;
    AccessoryNotes : string;

    constructor(){
        this.AssetAccessoryName = "";
        this.AccessoryPriceAmt = 0;
        this.DownPaymentAmt = 0;
        this.AccessoryNotes = "";
    }
}

export class ResAppCustAddrForPOObj {

    Addr : string;
    AreaCode1 : string;
    AreaCode2 : string;
    AreaCode3 : string;
    AreaCode4 : string;
    City : string;
    Zipcode : string;
    RowVersion : string;

    constructor(){
        this.Addr = "";
        this.AreaCode1 = "";
        this.AreaCode2 = "";
        this.AreaCode3 = "";
        this.AreaCode4 = "";
        this.City = "";
        this.Zipcode = "";
        this.RowVersion = "";
    }

}

export class ResVendorForPOObj {

    VendorName : string;

    constructor(){
        this.VendorName = "";
    }

}

export class ResVendorAddrForPOObj {

    Addr : string;

    constructor(){
        this.Addr = "";
    }
}

export class ResVendorBankAccForPOObj {

    BankName : string;
    BankCode : string;
    BankAccountNo : string;
    BankAccountName : string;

    constructor(){
        this.BankName = "";
        this.BankCode = "";
        this.BankAccountNo = "";
        this.BankAccountName = "";
    }

}

export class ResAgrmntForPOObj {

    CustName : string;
    MrFirstInstTypeCode : string;
    RowVersion : string;

    constructor(){
        this.CustName = "";
        this.MrFirstInstTypeCode = "";
        this.RowVersion = "";
    }

}

export class ResAgrmntFeeForPOObj {

    FeeName : string;
    AppFeeAmt : number;
    MrFeeTypeCode : string;

    constructor(){
        this.FeeName = "";
        this.AppFeeAmt = 0;
        this.MrFeeTypeCode = "";
    }

}

export class ResAgrmntFinDataForPOObj {

    AgrmntFinDataId : number;
    AgrmntId : number;
    MrInstSchemeCode : string;
    TotalAssetPriceAmt : number;
    TotalInterestAmt : number;
    GrossYieldPrcnt : number;
    StdGrossYieldPrcnt : number;
    TdpPaidCoyAmt : number;
    NtfAmt : number;
    InsCptlzAmt : number;
    LifeInsCptlzAmt : number;
    LcInstAdminFeeAmt : number;
    InstAmt : number;
    BalloonValueAmt : number;
    DiffRateAmt : number;
    MrInterestTypeCode : string;
    EffectiveRatePrcnt : number;
    FlatRatePrcnt : number;
    SupplEffectiveRatePrcnt : number;
    SupplFlatRatePrcnt : number;
    MrGracePeriodTypeCode : string;
    GracePeriod : number;
    DownPaymentNettAmt : number;
    DownPaymentGrossAmt : number;
    TotalDownPaymentNettAmt : number;
    TotalDownPaymentGrossAmt : number;
    Dsr : number;
    Ltv : number;
    ResidualValueAmt : number;
    TotalFeeAmt : number;
    TotalFeeCptlzAmt : number;
    RoundingAmt : number;
    CummulativeTenor : number;
    MaxAllocatedRefundAmt : number;
    CommissionAllocatedAmt : number;
    ReservedFundAllocatedAmt : number;
    TotalInsCustAmt : number;
    TotalInsInscoAmt : number;
    TotalLifeInsCustAmt : number;
    TotalLifeInsInscoAmt : number;
    RowVersion : string;

    constructor(){
        this.AgrmntFinDataId = 0;
        this.AgrmntId = 0;
        this.MrInstSchemeCode = "";
        this.TotalAssetPriceAmt = 0;
        this.TotalInterestAmt = 0;
        this.GrossYieldPrcnt = 0;
        this.StdGrossYieldPrcnt = 0;
        this.TdpPaidCoyAmt = 0;
        this.NtfAmt = 0;
        this.InsCptlzAmt = 0;
        this.LifeInsCptlzAmt = 0;
        this.LcInstAdminFeeAmt = 0;
        this.InstAmt = 0;
        this.BalloonValueAmt = 0;
        this.DiffRateAmt = 0;
        this.MrInterestTypeCode = "";
        this.EffectiveRatePrcnt = 0;
        this.FlatRatePrcnt = 0;
        this.SupplEffectiveRatePrcnt = 0;
        this.SupplFlatRatePrcnt = 0;
        this.MrGracePeriodTypeCode = "";
        this.GracePeriod = 0;
        this.DownPaymentNettAmt = 0;
        this.DownPaymentGrossAmt = 0;
        this.TotalDownPaymentNettAmt = 0;
        this.TotalDownPaymentGrossAmt = 0;
        this.Dsr = 0;
        this.Ltv = 0;
        this.ResidualValueAmt = 0;
        this.TotalFeeAmt = 0;
        this.TotalFeeCptlzAmt = 0;
        this.RoundingAmt = 0;
        this.CummulativeTenor = 0;
        this.MaxAllocatedRefundAmt = 0;
        this.CommissionAllocatedAmt = 0;
        this.ReservedFundAllocatedAmt = 0;
        this.TotalInsCustAmt = 0;
        this.TotalInsInscoAmt = 0;
        this.TotalLifeInsCustAmt = 0;
        this.TotalLifeInsInscoAmt = 0;
        this.RowVersion = "";
    }

}

export class ResAgrmntSubsidyObj {

    MrSubdAllocCode : string;
    MrSubdSourceCode : string;
    SubsidyAmt : number;
    RowVersion : string;

    constructor(){
        this.MrSubdAllocCode = "";
        this.MrSubdSourceCode = "";
        this.SubsidyAmt = 0;
        this.RowVersion = "";
    }

}
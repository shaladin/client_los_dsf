import { MouCustCollateralAttrObj } from "./MouCustCollateralAttrObj.Model";

export class MouCustCollateralObj{
    MouCustCollateralId: number;
    MouCustId: number;
    CollateralNo: string;
    CollateralSeqNo: number;
    AssetTypeCode: string;
    FullAssetCode: string;
    FullAssetName: string;
    AssetCategoryCode: string;
    MrCollateralConditionCode: string;
    MrCollateralUsageCode: string;
    CollateralStat: string;
    SerialNo1: string;
    SerialNo2: string;
    SerialNo3: string;
    SerialNo4: string;
    SerialNo5: string;
    CollateralValueAmt: number;
    CollateralPrcnt: number;
    CollateralPortionAmt: number;
    AssetTaxDate: Date;
    CollateralNotes: string;
    ManufacturingYear: number;
    RemainingCollateralPrcnt: number;
    RsvField1: string;
    RsvField2: string;
    RsvField3: string;
    RsvField4: string;
    RsvField5: string;
    ListCollateralId: number[];
    RowVersion: string;
    CustNo: string;
    CustName: string;
    OwnerMobilePhnNo: string;
}
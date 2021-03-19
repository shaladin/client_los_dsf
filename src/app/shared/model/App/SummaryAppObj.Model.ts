import { AppCustObj } from "../AppCustObj.Model";
import { AppCustPersonalObj } from "../AppCustPersonalObj.Model";
import { AppCustAddrObj } from "../AppCustAddrObj.Model";
import { AppCustPersonalJobDataObj } from "../AppCustPersonalJobDataObj.Model";
import { AppGuarantorObj } from "../AppGuarantorObj.Model";
import { AppObj } from "./App.Model";
import { AppAssetObj } from "../AppAssetObj.Model";
import { AppFinDataObj } from "../AppFinData/AppFinData.Model";
import { AssetTypeSerialNoLabelObj } from "../SerialNo/AssetTypeSerialNoLabelObj.Model";
import { AppCollateralObj } from "../AppCollateralObj.Model";
import { AppCustCompanyObj } from "../AppCustCompanyObj.Model";


export class SummaryAppObj{
    AppObj: AppObj;
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    AppAssetObjs: Array<AppAssetObj>;
    AppCollateralObjs: Array<AppCollateralObj>;
    AppFinDataObj: AppFinDataObj;
    AppCustGuarantorObjs: Array<AppCustObj>;
    AssetTypeSerialNoLabelCustomObjs: Array<AssetTypeSerialNoLabelObj>;
    MrNegCustTypeCode: string;
    NegCustTypeName: string;
    NegCustColor: string;
    NegCustGrade: string;
    SpouseName: string;
    SalesDealerName: string;
    DealerName: string;
    TotalPrincipalAmt: number;
    TotalIncomeAmt: number;
    TotalExpenseAmt: number;
    CustExposureAmt: number;
    CustGrpExposureAmt: number;
    ObligorExposureAmt: number;
    OsArAgrmntAmt: number;
    AppRejectCount: number;
    AppInProcessCount: number;

    constructor(){
        this.AppObj = new AppObj();
        this.AppCustObj = new AppCustObj();
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.AppAssetObjs = new Array<AppAssetObj>();
        this.AppCollateralObjs = new Array<AppCollateralObj>();
        this.AppFinDataObj = new AppFinDataObj();
        this.AppCustGuarantorObjs = new Array<AppCustObj>();
        this.AssetTypeSerialNoLabelCustomObjs = new Array<AssetTypeSerialNoLabelObj>();
    }
}
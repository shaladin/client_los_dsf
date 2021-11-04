import { AppCustObj } from "../app-cust-obj.model";
import { AppCustPersonalObj } from "../app-cust-personal-obj.model";
import { AppCustAddrObj } from "../app-cust-addr-obj.model";
import { AppCustPersonalJobDataObj } from "../app-cust-personal-job-data-obj.model";
import { AppGuarantorObj } from "../app-guarantor-obj.model";
import { AppObj } from "./apps.model";
import { AppAssetObj } from "../app-asset-obj.model";
import { AppFinDataObj } from "../app-fin-data/app-fin-data.model";
import { AssetTypeSerialNoLabelObj } from "../serial-no/asset-type-serial-no-label-obj.model";
import { AppCollateralObj } from "../app-collateral-obj.model";
import { AppCustCompanyObj } from "../app-cust-company-obj.model";


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
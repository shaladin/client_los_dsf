import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { AppAssetCollateralForInsuranceObj } from 'app/shared/model/app-asset-collateral-for-insurance.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { InputInsuranceObj } from 'app/shared/model/input-insurance-obj.model';
import { InsuranceDataObj } from 'app/shared/model/insurance-data-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { ReqAppCollateralForCopyInsuranceCustomObj } from 'app/shared/model/request/app-collateral/req-collateral-for-copy-insurance-obj.model';
import { ReqCopyInsuranceCustomObj } from 'app/shared/model/request/app-ins/req-copy-insurance-custom-obj.model';
import { ResultCalcInsObj } from 'app/shared/model/result-calc-ins-obj.model';
import { ResultInsRateRuleObj } from 'app/shared/model/result-ins-rate-rule-obj.model';
import { ResultSubsidySchmRuleObj } from 'app/shared/model/subsidy-schm/result-subsidy-schm-rule-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-uc-insurance-x-dsf',
  templateUrl: './uc-insurance-x-dsf.component.html'
})
export class UcInsuranceXDsfComponent implements OnInit {

  @Input() inputInsuranceObj: InputInsuranceObj;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  // Insurance Data
  AppAssetId: number = 0;
  AppCollateralId: number = 0;
  appInsObjId: number = 0;
  totalAssetPriceAmt: number;
  totalAssetInclAccessoryPriceAmt: number = 0;
  InsSeqNo: number = 0;
  defaultInsAssetRegion: string;
  IsMultiAsset: string = "true";
  BizTemplateCode: string = "";

  appObj: NapAppModel = new NapAppModel();
  appAssetObj: AppAssetObj = new AppAssetObj();
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: AppFinDataObj;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  appInsMainCvgObj: Array<AppInsMainCvgObj>;
  appCollateralObj: AppCollateralObj;
  appCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  ruleObj: ResultInsRateRuleObj;
  subsidyRuleObj: ResultSubsidySchmRuleObj;
  calcInsObj: ResultCalcInsObj;
  saveObj: InsuranceDataObj;

  minInsLength: number = 1;
  maxInsLength: number = 9999;

  insuredByObj: Array<KeyValueObj>;
  inscoBranchObj: Array<KeyValueObj>;
  paidByObj: Array<KeyValueObj>;
  insMainCvgTypeObj: Array<KeyValueObj>;
  insAddCvgTypeObj: Array<KeyValueObj>;
  insAddCvgTypeRuleObj: Array<KeyValueObj>;
  groupedAddCvgType: Array<string>;
  insAssetCoverPeriodObj: Array<KeyValueObj>;
  insAssetRegionObj: Array<KeyValueObj>;
  payPeriodToInscoObj: Array<KeyValueObj>;
  defaultInsMainCvgType: string;
  listDataCollateral: Array<any> = new Array();
  listDataInsuranceForCopy: Array<any> = new Array();
  selectedCollateral: any = "";
  selectedInsuranceForCopy: any = "";

  existingListAppColl: Array<AppCollateralObj> = new Array<AppCollateralObj>();

  showGenerate: boolean = false;
  isGenerate: boolean = false;
  isCalculate: boolean = false;
  businessDt: Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
  defInsPaidBy: string = CommonConstant.InsPaidByCustomer;
  adminFeeLock: boolean = false;
  stampdutyFeeLock: boolean = false;
  paidByBhv: Array<{ PaidByYearNo: number, PaidBy: string, PaidByBhv: string }>;
  isYearlyCapitalized: boolean = false;
  groupAddCvrSumInsuredDropDown: Object = new Object();
  isUsingSeatCount: boolean = false;
  AddCvgNeedSeatCount: Array<string> = [CommonConstant.MrAddCvgTypeCodePap];
  isDetail: boolean = false;
  isUcInsReady: boolean = false;

  PageState: string = 'Paging';
  listAppAssetObj: Array<AppAssetCollateralForInsuranceObj>;
  listAppCollateralObj: Array<AppAssetCollateralForInsuranceObj>;
  gridAssetDataObj: InputGridObj = new InputGridObj();
  gridAppCollateralObj: InputGridObj = new InputGridObj();

  InsCpltzAmt: number = 0;
  InsDiscAmt: number = 0;
  TotalPremiumToCust: number = 0;
  PaidAmtByCust: number = 0;
  textTitle: string;
  ManufYearDiff: number;
  RuleRateCvgName: string;
  ListRuleNotComplete: Array<{ index: number, AddCvg: string }> = new Array();
  LoadingFeeCountType: string
  InscoHoCode: string;
  DefaultLoadingFeeYear: number;
  isFromDB: boolean = false;
  readonly EditInsurance = "EditInsurance";
  readonly DefaultPremiumType = CommonConstant.PremiumTypeAmt;
  RoundedAmt: number;
  ListYear: Array<number> = new Array();
  isApplyToAll: boolean;

  AppInsForm = this.fb.group({
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, 
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.appObj.AppId = params["AppId"];
    })
  }

  async ngOnInit() {
    // Self Custom Changes CR Runner KTB 398912
    this.gridAssetDataObj.pagingJson = "./assets/dsf/ucgridview/gridAssetDataView.json";
    // End Self Custom Changes CR Runner KTB 398912
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateralInsurance.json";
    await this.BindMultiInsGridData();
  }

  CancelHandler() {
    this.outputCancel.emit();
  }

  CopyInsuranceHandler() {
    if (this.selectedCollateral == "") {
      this.toastr.warningMessage("Please Choose Collateral First");
      return;
    }

    if (this.selectedInsuranceForCopy == "") {
      this.toastr.warningMessage("Please Choose Insurance Data to Copy");
      return;
    }

    let reqObj: ReqCopyInsuranceCustomObj = new ReqCopyInsuranceCustomObj();
    let splittedCollateral: Array<any> = this.selectedCollateral.split(";");
    let splittedInsurance: Array<any> = this.selectedInsuranceForCopy.split(";");
    reqObj = this.setCopyInsuranceData(reqObj, splittedCollateral, splittedInsurance);

    this.http.post(URLConstant.CopyInsuranceData, reqObj).subscribe(
      (response) => {
        this.selectedInsuranceForCopy = "";
        this.selectedCollateral = "";
        if(this.inputInsuranceObj.IsMultiAsset) {
          this.BindMultiInsGridData();
        }
        this.toastr.successMessage(response["message"]);
      }
    )
  }
  
  setCopyInsuranceData(reqObj: ReqCopyInsuranceCustomObj, splittedCollateral: Array<any>, splittedInsurance: Array<any>) {
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.AppId = this.inputInsuranceObj.AppId;
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.FullAssetCode = splittedCollateral[0];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.ManufacturingYear = splittedCollateral[1];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.MrCollateralConditionCode = splittedCollateral[2];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.MrCollateralUsageCode = splittedCollateral[3];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.CollateralValueAmt = +splittedCollateral[4];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.TotalAccessoryPriceAmt = +splittedCollateral[5];

    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InscoBranchCode = splittedInsurance[0];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InsLength = +splittedInsurance[1];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InsAssetPaidBy = splittedInsurance[2];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InsAssetCoveredBy = splittedInsurance[3];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.TotalInsCustAmt = +splittedInsurance[4];

    return reqObj;
  }

  async BindMultiInsGridData() {
    this.isUcInsReady = false;
    let appObj = { Id: this.inputInsuranceObj.AppId }
    await this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.BizTemplateCode = response["BizTemplateCode"];
        this.textTitle = "Collateral";
        this.appObj.OriOfficeCode = response["OriOfficeCode"];
        this.appObj.ProdOfferingCode = response["ProdOfferingCode"];
        this.appObj.ProdOfferingVersion = response["ProdOfferingVersion"];
      });

    if(this.IsMultiAsset){
      this.appAssetObj.Id = this.inputInsuranceObj.AppId;
      await this.http.post(URLConstant.GetAppAssetListForInsuranceByAppId, this.appAssetObj).subscribe(
        (response) => {
          this.listAppAssetObj = response[CommonConstant.ReturnObj];
  
          let DetailForGridAsset = {
            Data: response[CommonConstant.ReturnObj],
            Count: "0"
          }
          this.gridAssetDataObj.resultData = DetailForGridAsset;
        });
  
      await this.http.post(URLConstant.GetAppCollateralListForInsuranceByAppId, this.appAssetObj).subscribe(
        (response) => {
          this.listAppCollateralObj = response[CommonConstant.ReturnObj];
  
          let DetailForGridCollateral = {
            Data: response[CommonConstant.ReturnObj],
            Count: "0"
          }
          this.gridAppCollateralObj.resultData = DetailForGridCollateral;
          this.isUcInsReady = true;
  
          this.PaidAmtByCust = 0;
          this.InsCpltzAmt = 0;
          this.TotalPremiumToCust = 0;
          this.InsDiscAmt = 0;
  
          if (this.listAppCollateralObj[0].PaidAmtByCust != null)
            this.PaidAmtByCust = this.listAppCollateralObj[0].PaidAmtByCust;
  
          if (this.listAppCollateralObj[0].InsCpltzAmt != null)
            this.InsCpltzAmt += this.listAppCollateralObj[0].InsCpltzAmt;
  
          if (this.listAppCollateralObj[0].InsDiscAmt != null)
            this.InsDiscAmt += this.listAppCollateralObj[0].InsDiscAmt;
  
          if (this.listAppCollateralObj[0].TotalCustPremiAmt != null)
            this.TotalPremiumToCust = this.listAppCollateralObj[0].TotalCustPremiAmt;
        });
    
        await this.http.post(URLConstant.GetListAppCollateralForCopyInsuranceByAppId, this.appAssetObj).toPromise().then(
          (response) => {
            this.listDataCollateral = response[CommonConstant.ReturnObj];
          }
        );
    }
  }

  async GetInsuranceDDLForCopy() {
    this.selectedInsuranceForCopy = "";
    if (this.selectedCollateral == "") {
      this.listDataInsuranceForCopy = null;
      return;
    }

    let splitted = this.selectedCollateral.split(";");

    if (splitted.length == 1) {
      this.toastr.warningMessage(ExceptionConstant.ASSET_DATA_NOT_COMPLETE);
      return;
    }

    let reqObj: ReqAppCollateralForCopyInsuranceCustomObj = new ReqAppCollateralForCopyInsuranceCustomObj();
    reqObj.AppId = this.inputInsuranceObj.AppId;
    reqObj.FullAssetCode = splitted[0];
    reqObj.ManufacturingYear = splitted[1];
    reqObj.MrCollateralConditionCode = splitted[2];
    reqObj.MrCollateralUsageCode = splitted[3];
    reqObj.CollateralValueAmt = +splitted[4];
    reqObj.TotalAccessoryPriceAmt = +splitted[5];

    await this.http.post(URLConstant.GetListInsuranceDataForCopyInsuranceByAppId, reqObj).toPromise().then(
      (response) => {
        this.listDataInsuranceForCopy = response[CommonConstant.ReturnObj];
        if (this.listDataInsuranceForCopy.length > 0) this.selectedInsuranceForCopy = this.listDataInsuranceForCopy[0].Code;
      }
    );
  }
  
  event(e) {
    this.PageState = 'EditAsset';
  }

  getValue(e) {
    this.PageState = 'Paging';
  }

  SubmitForm() {
    this.appAssetObj.Id = this.inputInsuranceObj.AppId;
    this.http.post(URLConstant.GetAppCollateralListForInsuranceByAppId, this.appAssetObj).subscribe(
      (response) => {
        let isValid = true;
        let validateObj = response[CommonConstant.ReturnObj];
        for (let i = 0; i < validateObj.length; i++) {
          if (validateObj[i].AppInsObjId == 0)
            isValid = false;
        }
        if (isValid)
          this.outputTab.emit({
            Action : "SaveContinue"
          });
        else
          this.toastr.warningMessage("Please Complete Insurance Data on All Collateral.");
      });
  }

  SaveForm(saveObj: InsuranceDataObj) {
    let obj = {
      Action : "SaveDetail",
      InsuranceData : saveObj
    }
    this.outputTab.emit(obj);
  }

  Cancel() {
    this.BindMultiInsGridData();
    this.PageState = 'Paging';
    this.isDetail = false;
    this.isUcInsReady = false;
    this.falseValue();
    this.selectedInsuranceForCopy = "";
    this.listDataInsuranceForCopy = null;
    this.selectedCollateral = "";
  }

  falseValue() {
    this.isGenerate = false;
    this.isCalculate = false;
    this.showGenerate = false;
  }

  OpenDetail(event) {
    this.AppCollateralId = event.AppCollateralId;
    this.AppAssetId = event.AppAssetId;
    if (this.AppAssetId == null || this.AppAssetId == undefined) this.AppAssetId = 0;

    this.appInsObjId = event.AppInsObjId;
    this.InsSeqNo = event.InsSeqNo;
    this.isDetail = true;
    this.PageState = this.EditInsurance;
  }

}

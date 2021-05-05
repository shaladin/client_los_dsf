import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { String } from 'typescript-string-operations';
import { ResThirdPartyRsltHObj } from 'app/shared/model/Response/ThirdPartyResult/ResThirdPartyRsltHObj.model';

@Component({
  selector: 'app-asset-data-paging',
  templateUrl: './asset-data-paging.component.html'
})
export class AssetDataPagingComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  IdCust: any;
  appAssetObj: any;
  listDataAsset: Array<any> = new Array();
  listAppAssetObj: Array<AppAssetObj> = new Array();
  appCollateralObj: any;
  listAppCollateralObj: Array<AppCollateralObj> = new Array();
  gridAssetDataObj: any;
  gridAppCollateralObj: any;
  AppAssetId: number;
  AppCollateralId: number;
  editAsset: string;
  editColl: string;
  selectedAsset: any;
  units: number = 0;
  appObj: any;
  generalSettingObj: GeneralSettingObj;
  IntegratorCheckBySystemGsValue: string = "1";
  IsUseDigitalization: string;
  LastRequestedDate: any;
  IsCalledIntegrator: boolean = false;
  thirdPartyRsltHId: any;
  mouCustId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["IdCust"] != null) {
        this.IdCust = params["IdCust"];
      }
    });
  }

  async GetThirdPartyResultH() {
    if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
      this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
        (response) => {
          this.appObj = response;
          if (response['MouCustId'] != null) {
            this.mouCustId = response['MouCustId'];
          }
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, { TrxNo: this.appObj["AppNo"], TrxTypeCode: "APP", FraudCheckType: "ASSET" }).toPromise().then(
            (response : ResThirdPartyRsltHObj) => {
              if (response.ThirdPartyRsltHId != null) {
                this.LastRequestedDate = response.ReqDt;
                this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
              }
            }
          );
        }
      );
    }
  }

  HitAPI() {
    console.log(this.gridAssetDataObj.resultData.Data);
    let assetData = this.gridAssetDataObj.resultData.Data;
    if (assetData.length != 0) {
      for (let i = 0; i < assetData.length; i++) {
        if (assetData[i]["SerialNo1"] == '') {
          this.toastr.warningMessage("Please Input Chassis No in asset name " + assetData[i].FullAssetName + ".");
          return;
        }
      }
      this.IsCalledIntegrator = true;
      this.toastr.successMessage("Submit with integrator.");
    }
    else {
      this.toastr.warningMessage("Must have atleast 1 asset.");
    }
  }

  addAsset() {
    this.outputValue.emit({ mode: 'addAsset' });
  }

  addColl() {
    this.outputValue.emit({ mode: 'addColl' });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  async GetGS() {
    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.ListGsCode.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.ListGsCode.push(CommonConstant.GSCodeIsUseDigitalization);

    await this.http.post(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        var returnGeneralSettingObj = response;

        var gsNeedCheckBySystem = returnGeneralSettingObj["ResponseGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = returnGeneralSettingObj["ResponseGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

        if (gsNeedCheckBySystem != undefined) {
          this.IntegratorCheckBySystemGsValue = gsNeedCheckBySystem.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if (gsUseDigitalization != undefined) {
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        this.GetThirdPartyResultH();
      }
    );
  }

  event(ev) {
    if (ev.Key == "edit") {
      this.AppAssetId = ev.RowObj.AppAssetId;
      this.editAsset = ev.RowObj.editAsset;
      this.outputValue.emit({ mode: 'editAsset', AppAssetId: this.AppAssetId });
    }

    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        var appAssetObj = new AppAssetObj();
        appAssetObj.AppAssetId = ev.RowObj.AppAssetId;
        appAssetObj.AppId = ev.RowObj.AppId;
        this.http.post(URLConstant.DeleteAppAsset, appAssetObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.listAppAssetObj = response["ReturnAsset"];

            var DetailForGridAsset = {
              Data: response["ReturnAsset"],
              Count: "0"
            }

            this.gridAssetDataObj.resultData = DetailForGridAsset;
            this.IsCalledIntegrator = false;
            this.getGridCollateral();
          }
        );
      }
    }
  }

  eventColl(ev) {
    if (ev.Key == "edit") {
      this.AppCollateralId = ev.RowObj.AppCollateralId;
      this.editColl = ev.RowObj.editColl;
      this.AppAssetId = ev.RowObj.AppAssetId;
      this.outputValue.emit({ mode: 'editColl', AppCollateralId: this.AppCollateralId });
    }

    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        var collateralObj = new AppCollateralObj();
        collateralObj.AppCollateralId = ev.RowObj.AppCollateralId;
        collateralObj.AppId = this.AppId;
        this.http.post(URLConstant.DeleteAppCollateral, collateralObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.listAppCollateralObj = response[CommonConstant.ReturnObj];

            var DetailForGridCollateral = {
              Data: response[CommonConstant.ReturnObj],
              Count: "0"
            }

            this.gridAppCollateralObj.resultData = DetailForGridCollateral;
          }
        );
      }
    }
  }

  CopyAsset() {
    if (this.units == 0) {
      this.toastr.warningMessage("Unit cannot be 0.");
    }
    else {
      var splitted = this.selectedAsset.split(";");

      this.http.post(URLConstant.CopyAppAsset, {
        AppId: this.AppId,
        Code: this.selectedAsset,
        count: this.units,
        FullAssetCode: splitted[0],
        ManufacturingYear: splitted[1],
        Color: splitted[2],
        MrAssetConditionCode: splitted[3],
        AssetPriceAmt: +splitted[4]
      }).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.ngOnInit();
        }
      );
    }
  }

  getListDataForDDLCopy() {
    var appAssetObj = { Id: this.AppId };
    this.http.post(URLConstant.GetListAppAssetForCopyByAppId, appAssetObj).subscribe(
      (response) => {
        this.listDataAsset = response[CommonConstant.ReturnObj];
        if (this.listDataAsset.length > 0) this.selectedAsset = this.listDataAsset[0].Code;
      }
    );
  }

  getListDataAsset() {
    var appAssetObj = { Id: this.AppId };
    this.http.post(URLConstant.GetAppAssetListByAppId, appAssetObj).subscribe(
      (response) => {
        this.listAppAssetObj = response[CommonConstant.ReturnObj];

        var DetailForGridAsset = {
          Data: response[CommonConstant.ReturnObj],
          Count: "0"
        }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
        this.getListDataForDDLCopy();
      }
    );
  }

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetData.json";
    this.gridAssetDataObj.deleteUrl = URLConstant.DeleteAppAsset;

    this.appAssetObj = new AppAssetObj();
    // this.appAssetObj.AppAssetId = "-";
    this.appAssetObj.AppId = this.AppId;
    this.getListDataAsset();


    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateral.json";
    this.gridAppCollateralObj.deleteUrl = URLConstant.DeleteAppCollateral;

    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppId = this.AppId;
    this.appCollateralObj.Id = this.AppId;
    this.http.post(URLConstant.GetListAdditionalCollateralByAppId, this.appCollateralObj).subscribe(
      (response) => {
        this.listAppCollateralObj = response[CommonConstant.ReturnObj];

        var DetailForGridCollateral = {
          Data: response[CommonConstant.ReturnObj],
          Count: "0"
        }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;
      });
    this.GetGS();
  }

  getGridCollateral() {
    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateral.json";
    this.gridAppCollateralObj.deleteUrl = URLConstant.DeleteAppCollateral;

    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppId = this.AppId;
    this.appCollateralObj.Id = this.AppId;
    this.http.post(URLConstant.GetListAdditionalCollateralByAppId, this.appCollateralObj).subscribe(
      (response) => {
        this.listAppCollateralObj = response[CommonConstant.ReturnObj];

        var DetailForGridCollateral = {
          Data: response[CommonConstant.ReturnObj],
          Count: "0"
        }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;
      }
    );
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

  next() {
    if (this.gridAssetDataObj.resultData.Data.length < 1) {
      this.toastr.warningMessage(ExceptionConstant.MIN_1_ASSET);
      return;
    }
    if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {

      if (!this.IsCalledIntegrator) {
        if (confirm("Submit without Integrator ? ")) {
          this.outputValue.emit({ mode: 'submit' });
        }
      }
      else {
        this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset, { AppId: this.AppId }).toPromise().then(
          (response) => {
            this.toastr.successMessage("Success !");
            this.outputValue.emit({ mode: 'submit' });
          }
        );
      }
    }
    else {
      this.outputValue.emit({ mode: 'submit' });
    }
  }
}

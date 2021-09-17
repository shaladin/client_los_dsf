import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { String } from 'typescript-string-operations';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { GenericListByCodeObj } from 'app/shared/model/Generic/GenericListByCodeObj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/Response/GeneralSetting/ResGeneralSettingObj.model';
import { ResThirdPartyRsltHObj } from 'app/shared/model/Response/ThirdPartyResult/ResThirdPartyRsltHObj.model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { ReqCopyAssetObj } from 'app/shared/model/Request/AppAsset/ReqCopyAssetObj.model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ProdOfferingDObj } from 'app/shared/model/Product/ProdOfferingDObj.model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';
import { SerialNoObj } from 'app/shared/model/SerialNo/SerialNoObj.Model';

@Component({
  selector: 'app-asset-data-paging-x',
  templateUrl: './asset-data-paging-x.component.html'
})
export class AssetDataPagingXComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Input() BizTemplateCode: string;
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
  generalSettingObj: GenericListByCodeObj;
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
            (response: ResThirdPartyRsltHObj) => {
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
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);

    await this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        var returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
        returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];

        var gsNeedCheckBySystem = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

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
            this.getListDataAsset();
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
      this.toastr.warningMessage(ExceptionConstant.UNIT_CANT_BE_ZERO);
    }
    else {
      let splitted = this.selectedAsset.split(";");

      if (splitted.length == 1) {
        this.toastr.warningMessage(ExceptionConstant.ASSET_DATA_NOT_COMPLETE);
        return;
      }

      let reqCopyAssetObj: ReqCopyAssetObj = new ReqCopyAssetObj();
      reqCopyAssetObj.AppId = this.AppId;
      reqCopyAssetObj.Code = this.selectedAsset;
      reqCopyAssetObj.count = this.units;
      reqCopyAssetObj.FullAssetCode = splitted[0];
      reqCopyAssetObj.ManufacturingYear = splitted[1];
      reqCopyAssetObj.Color = splitted[2];
      reqCopyAssetObj.MrAssetConditionCode = splitted[3];
      reqCopyAssetObj.AssetPriceAmt = +splitted[4];
      reqCopyAssetObj.MrAssetUsageCode = splitted[5];
      reqCopyAssetObj.TotalAccessoryPriceAmt = +splitted[6];

      this.http.post(URLConstant.CopyAppAsset, reqCopyAssetObj).subscribe(
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
    this.GetListAssetSerialNo();


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

  SerialNoList: Array<SerialNoObj> = new Array();
  GetListAssetSerialNo() {
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response: AppObj) => {
        this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETTYPE", ProdOfferingVersion: response.ProdOfferingVersion }).toPromise().then(
          (response2: ProdOfferingDObj) => {
            this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: response2.CompntValue }).subscribe(
              (response3: GenericListObj) => {
                this.SerialNoList = response3[CommonConstant.ReturnObj];
              })
          }
        )
      }
    );
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

  checkValidityAssetUsed() {
    let listAsset: Array<AppAssetObj> = this.gridAssetDataObj.resultData.Data;
    let flag: boolean = false;
    for (let index = 0; index < listAsset.length; index++) {
      const element = listAsset[index];
      if (element.MrAssetConditionCode == CommonConstant.AssetConditionUsed) {
        for (let index = 0; index < this.SerialNoList.length; index++) {
          if (!element["SerialNo" + (index + 1)]) {
            flag = true;
            this.toastr.warningMessage(element.FullAssetName + "\'s data not complete");
            break;
          }
        }
      }
    }
    return flag;
  }

  next() {
    if (this.gridAssetDataObj.resultData.Data.length < 1) {
      this.toastr.warningMessage(ExceptionConstant.MIN_1_ASSET);
      return;
    }
    else {
      for (let i = 0; i < this.gridAssetDataObj.resultData.Data.length; i++) {
        if (this.gridAssetDataObj.resultData.Data[i].SupplCode == null || this.gridAssetDataObj.resultData.Data[i].SupplName == null || this.gridAssetDataObj.resultData.Data[i].SupplCode == "" || this.gridAssetDataObj.resultData.Data[i].SupplName == "" || this.gridAssetDataObj.resultData.Data[i].DownPaymentPrcnt == 0 || this.gridAssetDataObj.resultData.Data[i].DownPaymentAmt == 0 || this.gridAssetDataObj.resultData.Data[i].ManufacturingYear == null) {
          this.toastr.warningMessage(ExceptionConstant.ASSET_DATA_NOT_COMPLETE + ' (Asset No. ' + (i + 1) + ')');
          return;
        }
      }
    }
    // if (this.checkValidityAssetUsed()) return;
      
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

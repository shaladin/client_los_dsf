import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { String } from 'typescript-string-operations';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ResThirdPartyRsltHObj } from 'app/shared/model/response/third-party-result/res-third-party-rslt-h-obj.model';
import { ResListGeneralSettingObj, ResGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { ReqCopyAssetObj } from 'app/shared/model/request/app-asset/req-copy-asset-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { SerialNoObj } from 'app/shared/model/serial-no/serial-no-obj.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { ResAssetTypeObj } from 'app/shared/model/app-asset-type/app-asset-type-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { CopyAppAssetDsfObj } from 'app/dsf/model/copy-app-asset-dsf-obj.Model';

@Component({
  selector: 'app-asset-data-paging-x-dsf',
  templateUrl: './asset-data-paging-x-dsf.component.html'
})
export class AssetDataPagingXDsfComponent implements OnInit {
  @Input() AppId: number;
  @Input() BizTemplateCode: string = "-";
  @Input() showCancel: boolean = true;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  IdCust: any;
  appAssetObj: any;
  listDataAsset: Array<any> = new Array();
  listAppAssetObj: Array<AppAssetObj> = new Array();
  appCollateralObj: any;
  listAppCollateralObj: Array<AppCollateralObj> = new Array();
  gridAssetDataObj: InputGridObj;
  gridAppCollateralObj: InputGridObj;
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
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsSvcExist: boolean = false;
  LastRequestedDate: any;
  IsCalledIntegrator: boolean = false;
  thirdPartyRsltHId: any;
  mouCustId: number = 0;
  listAssetIdtoDelete: Array<number> = new Array<number>();

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
    if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0" && this.IsSvcExist) {
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
    this.outputValue.emit({ mode: CommonConstant.ModeAddColl });
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
          this.getDigitalizationSvcType();
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }
      }
    );
  }

  event(ev) {
    if (ev.Key == "edit") {
      this.AppAssetId = ev.RowObj.AppAssetId;
      this.editAsset = ev.RowObj.editAsset;
      this.outputValue.emit({ mode: 'editAsset', AppAssetId: this.AppAssetId });
    }

    else if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        var appAssetObj = new AppAssetObj();
        appAssetObj.AppAssetId = ev.RowObj.AppAssetId;
        appAssetObj.AppId = ev.RowObj.AppId;
        this.http.post(URLConstant.DeleteAppAsset, appAssetObj).subscribe(
          (response) => {
            // Self Custom Changes CR Runner KTB 398912
            this.http.post(URLConstantDsf.DeleteAppAssetDsf, appAssetObj).subscribe(
              (response2) => {

              }
            );
            // End Self Custom Changes CR Runner KTB 398912
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
      this.outputValue.emit({ mode: CommonConstant.ModeEditColl, AppCollateralId: this.AppCollateralId });
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
          // Self Custom Changes CR Runner KTB 398912
          if( splitted[7] != "")
          {
            let reqAppAssetDsfObj: CopyAppAssetDsfObj = new CopyAppAssetDsfObj();
            reqAppAssetDsfObj.AppId= this.AppId;
            reqAppAssetDsfObj.RunnerActivation = splitted[7];
            reqAppAssetDsfObj.count = this.units;

            this.http.post(URLConstantDsf.CopyAppAssetDsf, reqAppAssetDsfObj).subscribe(
              (response2) => {});
          }
          // End Self Custom Changes CR Runner KTB 398912
          this.toastr.successMessage(response["message"]);
          this.ngOnInit();
        }
      );
    }
  }

  getListDataForDDLCopy() {
    var appAssetObj = { Id: this.AppId };
    // Self Custom Changes CR Runner KTB 398912
    this.http.post(URLConstantDsf.GetListAppAssetForCopyByAppIdDsf, appAssetObj).subscribe(
    // End Self Custom Changes CR Runner KTB 398912
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
        this.listAssetIdtoDelete = new Array<number>();
        this.getListDataForDDLCopy();
      }
    );
  }

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetDataWithDelete.json";
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

  async checkValidityCollateralDoc() {

    let reqObj = {
      Id: this.AppId
    }

    await this.http.post(URLConstantX.ValidateAppCollateralDocByAppId, reqObj).toPromise().then(
      (response) => {
        if (response["StatusCode"] != "200") return;
      }
    );

  }

  async checkValidityAssetUsed() {
    let listAsset: Array<AppAssetObj> = this.gridAssetDataObj.resultData.Data;
    let flag: boolean = false;
    let ListAssetTypeObj = new ResAssetTypeObj();

    let reqListAssetTypeCodes = new GenericListByCodeObj();
    for (let index = 0; index < listAsset.length; index++) {
      const element = listAsset[index];
      if (element.AssetTypeCode != null) {
        reqListAssetTypeCodes.Codes.push(element.AssetTypeCode);
      }
    }

    await this.http.post<ResAssetTypeObj>(URLConstant.GetListAssetTypeByListAssetTypeCodes, reqListAssetTypeCodes).toPromise().then(
      (response: ResAssetTypeObj) => {
        ListAssetTypeObj = response;
      }
    );

    for (let i = 0; i < listAsset.length; i++) {
      const element = listAsset[i];
      if (element.MrAssetConditionCode == CommonConstant.AssetConditionUsed) {
        for(let j = 0; j< ListAssetTypeObj.resAssetTypeObjs.length; j++){
          let AssetType = ListAssetTypeObj.resAssetTypeObjs[j];
          if(element.AssetTypeCode == AssetType.AssetTypeCode){
            for (let k = 0; k < this.SerialNoList.length; k++) {
              if (!element["SerialNo" + (k + 1)] && AssetType["IsMndtrySerialNo" + (k + 1)] == true) {
                flag = true;
                this.toastr.warningMessage(element.FullAssetName + "\'s data not complete");
                break;
              }
            }
          }
        }
      }
    }
    return flag;
  }



  async next() {
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
    // if (await this.checkValidityAssetUsed()) return;

    await this.checkValidityCollateralDoc();
    // region: additional validation transaction leasseback
    let isAlreadyHasAsset: boolean = false;
    let allAssetName: string[] = []
    let allAssetAttributePlatColor: string[] = []
    let platColorRequestObj = {
      Id: this.AppId
    }
    await this.http.post(URLConstant.GetListAllAssetDataByAppId, platColorRequestObj).toPromise().then((res: any) =>{
      if(res['ReturnObject'] !== null && res['ReturnObject'].length > 0){
        isAlreadyHasAsset = true;
        if(res['ReturnObject'].length > 0){
          for (let i = 0; i < res['ReturnObject'].length; i++) {
            // ASSET NAMES
            if(res['ReturnObject'][i].ResponseAppAssetObj){
              let fullAssetName = '';
              if(res['ReturnObject'][i].ResponseAppAssetObj.FullAssetName !== null){
                fullAssetName = res['ReturnObject'][i].ResponseAppAssetObj.FullAssetName
              }
              allAssetName.push(fullAssetName);
            }
            // ASSET ATTRIBUTES
            const attributes: any[] = res['ReturnObject'][i].ResponseAppAssetAttrObjs
            if(attributes.length > 0){
              for (let x = 0; x < attributes.length; x++) {
                if(attributes[x].AssetAttrCode === CommonConstantX.APP_ASSET_ATTRIBUTE_PLAT_COLOR){
                  allAssetAttributePlatColor.push(attributes[x].AttrValue)
                }
              }
            }
          }
        }
      }
    });
    if(isAlreadyHasAsset){
      let purposeOfFinancing = '';
      const prodOffferingPOFRequestObj = {
        ProdOfferingCode: this.appObj.ProdOfferingCode,
        ProdOfferingVersion: this.appObj.ProdOfferingVersion,
        RefProdCompntCode: CommonConstant.RefProdCompntCodePurposeOfFinancing
      }
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, prodOffferingPOFRequestObj).toPromise().then((res) =>{
        const componentValue = res['CompntValue']
        if(componentValue !== null){
          purposeOfFinancing = componentValue
        }
      });

      let wayOfFinancing = '';
      const prodOffferingWOFRequestObj = {
        ProdOfferingCode: this.appObj.ProdOfferingCode,
        ProdOfferingVersion: this.appObj.ProdOfferingVersion,
        RefProdCompntCode: CommonConstant.RefProdCompntCodeWayOfFinancing
      }
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, prodOffferingWOFRequestObj).toPromise().then((res) =>{
        const componentValue = res['CompntValue']
        if(componentValue !== null){
          wayOfFinancing = componentValue
        }
      });
      const errorMessages: string[] = await this.CheckValidationTransactionLeasseback(this.appObj.Tenor, purposeOfFinancing, wayOfFinancing, allAssetAttributePlatColor, allAssetName)
      if(errorMessages.length > 0){
        for (let i = 0; i < errorMessages.length; i++) {
          this.toastr.warningMessage(errorMessages[i]);
        }
        return;
      }
    }
    // endregion: additional validation transaction leasseback

    let checkAppNumOfAssetObj = { Id: this.AppId };
    await this.http.post(URLConstant.UpdateAppNumOfAsset, checkAppNumOfAssetObj).toPromise().then(
      (response) => {
      }
    );

    this.outputValue.emit({ mode: 'submit' });
  }

  async CheckValidationTransactionLeasseback(tenor: number, purposeOfFinancing: string, wayOfFinancing: string, allAssetAttributePlatColor: string[], allAssetName: string[]){
    // get GS Tenor
    let errorMessages: string[] = [];
    let arrMinTenorAssetFL: any[]
    const minTenorAssetFLRequestObj = {
      Code: CommonConstantX.GsCodeMinTenorAssetFL
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, minTenorAssetFLRequestObj).toPromise().then((res) =>{
      const GsValue = res['GsValue']
      if(GsValue !== null){
        let tempArr: any[] = GsValue.split(";")
        if(tempArr.length > 0){
          for (let i = 0; i < tempArr.length; i++) {
            tempArr[i] = tempArr[i].split(":")
          }
        }
        arrMinTenorAssetFL = tempArr
      }
    });
    
    // get GS Tenor
    let arrMapPofWofFL: string[] = [];
    const MapPofWofFLRequestObj = {
      Code: CommonConstantX.GsCodeMapPofWofFL
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, MapPofWofFLRequestObj).toPromise().then((res) =>{
      const GsValue = res['GsValue']
      if(GsValue !== null){
        arrMapPofWofFL = GsValue.split(";")
      }
    });
    const mapPofWof = purposeOfFinancing+":"+wayOfFinancing
    if(arrMapPofWofFL.length > 0){
      for (let i = 0; i < arrMapPofWofFL.length; i++) {
        if(mapPofWof === arrMapPofWofFL[i]){
          if(allAssetAttributePlatColor.length > 0){
            for (let x = 0; x < allAssetAttributePlatColor.length; x++) {
              const assetName = allAssetName[x]
              const attrPlatColor = allAssetAttributePlatColor[x]
              for (let gsIdx = 0; gsIdx < arrMinTenorAssetFL.length; gsIdx++) {
                const gsPlatColor = arrMinTenorAssetFL[gsIdx][0];
                const gsTenorMonth = arrMinTenorAssetFL[gsIdx][1];
                if(attrPlatColor === gsPlatColor && tenor < gsTenorMonth){
                  let messageColor = 'Yellow';
                  if(attrPlatColor === 'BLACK' || attrPlatColor === 'WHITE'){
                    messageColor = 'Black/White'
                  }
                  errorMessages.push(`Plat Color ${messageColor} must have minimum tenor of ${gsTenorMonth} for asset ${assetName}`)
                }
              }
            }
          }
          break;  // to stop POF and WOF Validation loop
        }
      }
    }
    return errorMessages
  }

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapAsset, { TrxNo: this.BizTemplateCode}).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

      var svcType = listSvcType.find(x => x == refSvcType);

      if(svcType != null){
        this.IsSvcExist = true;
      }
      this.GetThirdPartyResultH();
    }
  }
  
  getIds(ev) {
    console.log(ev);
    for (let i = 0; i < ev.length; i++) {
      if (ev[i].isActive != true) {
        let index = this.listAssetIdtoDelete.findIndex(f=>f == ev[i].AppAssetId)
        if(index != -1){
          this.listAssetIdtoDelete.splice(index,1);
        }
      }
      else{
        let index = this.listAssetIdtoDelete.findIndex(f=>f == ev[i].AppAssetId)
        if(index == -1){
          this.listAssetIdtoDelete.push(ev[i].AppAssetId);
        }
      }
    }
    console.log(this.listAssetIdtoDelete);
  }
  deleteListAsset(){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      let appAssetObj = new AppAssetObj();
      appAssetObj.AppAssetIds = this.listAssetIdtoDelete;
      appAssetObj.AppId = this.AppId;
      this.http.post(URLConstant.DeleteListAppAsset, appAssetObj).subscribe(
        (response) => {
          // Self Custom Changes CR Runner KTB 398912
          this.http.post(URLConstantDsf.DeleteListAppAssetDsf, appAssetObj).subscribe(
            (response2) => {}
          );
          // End Self Custom Changes CR Runner KTB 398912
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

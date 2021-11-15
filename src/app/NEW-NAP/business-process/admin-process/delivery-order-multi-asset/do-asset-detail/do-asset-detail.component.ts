import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { AssetTypeSerialNoLabelCustomObj } from 'app/shared/model/asset-type-serial-no-label-custom-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { environment } from 'environments/environment';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppAssetAttrCustomObj } from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { String } from 'typescript-string-operations';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { ReqAppAssetAttrObj } from 'app/shared/model/app-asset-attr-obj.model';
import { ReqAppCollateralAttrObj } from 'app/shared/model/app-collateral-attr-obj.model';
import { ReqAssetDataObj } from 'app/shared/model/all-asset-data-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';

@Component({
  selector: 'app-do-asset-detail',
  templateUrl: './do-asset-detail.component.html',
  styles: []
})
export class DoAssetDetailComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  listItem: FormArray;
  SerialNoList: Array<AssetTypeSerialNoLabelCustomObj>;
  InputLookupCityIssuerObj : InputLookupObj = new InputLookupObj();
  AppAssetAttrObj: any;
  AppAssetTypeCode: string;
  isDiffWithRefAttr: boolean;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  ListAttrAnswer = [];
  isAssetAttrReady: boolean = false;
  generalSettingObj: GenericListByCodeObj;
  IntegratorCheckBySystemGsValue: string = "1";
  IsUseDigitalization: string;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsSvcExist: boolean = false;
  AppObj: AppObj = new AppObj();
  indexChassis: number = 0;
  IsIntegrator: boolean = false;
  reqAssetDataObj: ReqAssetDataObj;
  datePipe = new DatePipe("en-US");
  IsReady2: boolean = false;
  isUsed : boolean = false;

  DOAssetDetail = this.fb.group({
    AppAssetId: [0, [Validators.required]],
    AppId: [0, [Validators.required]],
    AgrmntId: [0, [Validators.required]],
    AssetSeqNo: [''],
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrAssetUsageCode: [''],
    AssetStat: [''],
    AssetPriceAmt: [''],
    DownPaymentAmt: [''],
    AssetTypeCode: [''],
    AssetCategoryCode: [''],
    AssetTaxDt: [''],
    SupplCode: [''],
    SupplName: [''],
    IsCollateral: [''],
    IsInsurance: [''],
    AssetNotes: [''],
    TempRegisLettNo: ['', [Validators.required]],
    TempRegisLettDt: ['', [Validators.required]],
    Color: [''],
    TaxCityIssuer: [''],
    TaxIssueDt: [''],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(new Date().getFullYear())]],
    IsEditableDp: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: [''],
    RowVersion: [''],
    DOAssetDocList: this.fb.array([]),
    listItem: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([])
  });

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    public activeModalAsset: NgbActiveModal,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ){}

  async ngOnInit() {
    this.listItem = this.DOAssetDetail.get('listItem') as FormArray;
    this.initCityLookupIssuerLookup();
    
    var reqAppAsset = { AppAssetId: this.AppAssetId, AppId: this.AppId};
    await this.httpClient.post(URLConstant.GetAppAssetForDOMultiAsset, reqAppAsset).toPromise().then(
      async (response) => {
        console.log(response);
        var appAsset = response["AppAssetObj"];
        this.AppAssetTypeCode = appAsset.AssetTypeCode;
        var appCollateral = response["AppCollateralDoc"];
        appAsset.TempRegisLettDt = this.datePipe.transform(appAsset.TempRegisLettDt, "yyyy-MM-dd");
        appAsset.TaxIssueDt = this.datePipe.transform(appAsset.TaxIssueDt, "yyyy-MM-dd");
        
        this.InputLookupCityIssuerObj.nameSelect = appAsset.TaxCityIssuer;
        this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: appAsset.TaxCityIssuer };

        if(appAsset.MrAssetConditionCode == "USED") { 
          this.isUsed = true;
          this.InputLookupCityIssuerObj.isRequired = true;
        }
        
        await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: appAsset.AssetTypeCode }).toPromise().then(
          (response: GenericListObj) => {
            while (this.listItem.length) {
              this.listItem.removeAt(0);
            }

            this.SerialNoList = response.ReturnObject;
            for (let i = 0; i < this.SerialNoList.length; i++) {
              let eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: [''],
                IsMandatory: [this.SerialNoList[i].IsMandatory]
              }) as FormGroup;
              this.listItem.push(eachDataDetail);
            }

            for (let i = 0; i < this.listItem.length; i++) {
              if (this.listItem.controls[i]['controls']['IsMandatory'].value == true) {
                this.listItem.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                this.listItem.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }
            }

            if (appAsset != undefined || appAsset != null) {
              for (let i = 0; i < this.listItem.length; i++) {
                if (this.listItem.controls[i] != null) {
                  this.listItem.controls[i]['controls']['SerialNoValue'].value = appAsset["SerialNo" + (i + 1)];
                  if (this.listItem.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No"){
                    this.indexChassis = i;
                  }
                }
              }
            }
        });
          
        this.DOAssetDetail.patchValue({
          ...appAsset
        });

        this.GenerataAppAssetAttr(false);
        await this.GetAppData();

        // jika first input, ambil isian collateral doc by type
        if(!appCollateral || appCollateral.length <= 0) 
          this.GenerateDefaultAssetDocs(appAsset.AssetTypeCode);
        else
          this.GenerateAppCollateralDocs(appCollateral);
      }
    );
    

    console.log(this.DOAssetDetail.controls);
    await this.GetGS();
    this.InputLookupCityIssuerObj.isReady = true;
  }

  lookupReady(){
    this.IsReady2 = true;
  }

  GenerateDefaultAssetDocs(AssetTypeCode: string)
  {
    var assetDocs = [];
    var assetDocListobj = { Code: AssetTypeCode }
    this.http.post(URLConstant.GetRefAssetDocList, assetDocListobj).subscribe(
      (response) => {
        if (response[CommonConstant.ReturnObj].length > 0)
        {
          response[CommonConstant.ReturnObj].forEach(RefAssetDoc => {
            assetDocs.push({
              AppCollateralDocId: 0,
              AppCollateralId: 0,
              DocCode: RefAssetDoc.AssetDocCode,
              DocNo: null,
              DocName: RefAssetDoc.AssetDocName,
              IsReceived: false,
              ExpiredDt: null,
              DocNotes: RefAssetDoc.DocNotes,
              IsValueNeeded: RefAssetDoc.IsValueNeeded,
              IsMandatoryNew: RefAssetDoc.IsMandatoryNew,
              IsMandatoryUsed: RefAssetDoc.IsMandatoryUsed,
              MrCollateralConditionCode: CommonConstant.AssetConditionUsed,
            })    
          });
          this.GenerateAppCollateralDocs(assetDocs);
        }
      }
    );
    return assetDocs;
  }

  GenerateAppCollateralDocs(appCollateralDocs)
  {
    var formArray = this.DOAssetDetail.get('DOAssetDocList') as FormArray;
    for (const item of appCollateralDocs) {
      var isMandatory = false;
      if(item.MrCollateralConditionCode == CommonConstant.AssetConditionNew){
        if(item.IsMandatoryNew == true){
          isMandatory = true;
        }
      }
      else{
        if(item.IsMandatoryUsed == true){
          isMandatory = true;
        }
      }
      var formGroup = this.fb.group({
        AppCollateralDocId: [item.AppCollateralDocId],
        AppCollateralId: [item.AppCollateralId],
        DocCode: [item.DocCode],
        DocName: [item.DocName],
        DocNo: [item.DocNo, isMandatory ? [Validators.required] : []],
        IsReceived: [item.IsReceived],
        ExpiredDt: [item.ExpiredDt == null ? "" : this.datePipe.transform(item.ExpiredDt, "yyyy-MM-dd") ],
        DocNotes: [item.DocNotes],
        IsValueNeeded: [item.IsValueNeeded],
        IsMandatoryNew: [item.IsMandatoryNew],
        IsMandatoryUsed: [item.IsMandatoryUsed],
        MrCollateralConditionCode: [item.MrCollateralConditionCode]
      });
      formArray.push(formGroup);
    }
  }

  Save(){
    this.reqAssetDataObj = new ReqAssetDataObj();
    var formData = this.DOAssetDetail.value;

    this.setAsset(formData);
    this.setCollateralDoc(formData);
    this.setAssetAttr();

    this.httpClient.post(URLConstant.EditAppAssetDOMultiAsset, this.reqAssetDataObj).subscribe(
    (response) => {
      this.activeModalAsset.close(response);
    });
  }

  setAsset(formData){
    this.reqAssetDataObj.AppAssetObj = new AppAssetObj();
    this.reqAssetDataObj.AppAssetObj.AppAssetId = formData.AppAssetId;
    this.reqAssetDataObj.AppAssetObj.AppId = formData.AppId;
    this.reqAssetDataObj.AppAssetObj.AgrmntId = formData.AgrmntId;
    this.reqAssetDataObj.AppAssetObj.AssetSeqNo = formData.AssetSeqNo;
    this.reqAssetDataObj.AppAssetObj.FullAssetCode = formData.FullAssetCode;
    this.reqAssetDataObj.AppAssetObj.FullAssetName = formData.FullAssetName;
    this.reqAssetDataObj.AppAssetObj.MrAssetConditionCode = formData.MrAssetConditionCode;
    this.reqAssetDataObj.AppAssetObj.MrAssetUsageCode = formData.MrAssetUsageCode;
    this.reqAssetDataObj.AppAssetObj.AssetStat = formData.AssetStat;
    this.reqAssetDataObj.AppAssetObj.AssetPriceAmt = formData.AssetPriceAmt;
    this.reqAssetDataObj.AppAssetObj.DownPaymentAmt = formData.DownPaymentAmt;
    this.reqAssetDataObj.AppAssetObj.AssetTypeCode = formData.AssetTypeCode;
    this.reqAssetDataObj.AppAssetObj.AssetCategoryCode = formData.AssetCategoryCode;
    this.reqAssetDataObj.AppAssetObj.AssetTaxDt = formData.AssetTaxDt;
    this.reqAssetDataObj.AppAssetObj.SupplCode = formData.SupplCode;
    this.reqAssetDataObj.AppAssetObj.SupplName = formData.SupplName;
    this.reqAssetDataObj.AppAssetObj.IsCollateral = formData.IsCollateral;
    this.reqAssetDataObj.AppAssetObj.IsInsurance = formData.IsInsurance;
    this.reqAssetDataObj.AppAssetObj.AssetNotes = formData.AssetNotes;
    this.reqAssetDataObj.AppAssetObj.TempRegisLettNo = formData.TempRegisLettNo;
    this.reqAssetDataObj.AppAssetObj.TempRegisLettDt = formData.TempRegisLettDt;
    this.reqAssetDataObj.AppAssetObj.Color = formData.Color;
    this.reqAssetDataObj.AppAssetObj.TaxCityIssuer = formData.TaxCityIssuer;
    this.reqAssetDataObj.AppAssetObj.TaxIssueDt = formData.TaxIssueDt;
    this.reqAssetDataObj.AppAssetObj.ManufacturingYear = formData.ManufacturingYear;
    this.reqAssetDataObj.AppAssetObj.IsEditableDp = formData.IsEditableDp;
    this.reqAssetDataObj.AppAssetObj.RowVersion = formData.RowVersion;

    for (var i = 0; i < this.listItem.length; i++) {
      if (this.listItem.controls[i] != null) {
        this.reqAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.listItem.controls[i]["controls"]["SerialNoValue"].value;
      }
    }
  }

  setCollateralDoc(formData){
    this.reqAssetDataObj.AppCollateralDocObj = [...formData.DOAssetDocList];
  }

  setAssetAttr(){
    this.reqAssetDataObj.AppAssetAttrObj = new Array<ReqAppAssetAttrObj>();

    if (this.AppAssetAttrObj != null) {
      for (let i = 0; i < this.DOAssetDetail.controls["AppAssetAttrObjs"].value.length; i++) {
        let appAssetAttrObj = new ReqAppAssetAttrObj();
        let appCollAttrcObj = new ReqAppCollateralAttrObj();
        appAssetAttrObj.AssetAttrName = this.DOAssetDetail.controls["AppAssetAttrObjs"].value[i].AssetAttrName;
        appAssetAttrObj.AssetAttrCode = this.DOAssetDetail.controls["AppAssetAttrObjs"].value[i].AssetAttrCode;
        appAssetAttrObj.AttrValue = this.DOAssetDetail.controls["AppAssetAttrObjs"].value[i].AttrValue;

        appCollAttrcObj.CollateralAttrName = appAssetAttrObj.AssetAttrName;
        appCollAttrcObj.CollateralAttrCode = appAssetAttrObj.AssetAttrCode;
        appCollAttrcObj.AttrValue = appAssetAttrObj.AttrValue;

        this.reqAssetDataObj.AppAssetAttrObj.push(appAssetAttrObj);
        this.reqAssetDataObj.AppCollateralAttrObj.push(appCollAttrcObj);
      }
    }
  }

  initCityLookupIssuerLookup(){
    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.isRequired = false;
    let disCrit = new Array();
    let critDisObj = new CriteriaObj();
    critDisObj.DataType = 'text';
    critDisObj.restriction = AdInsConstant.RestrictionEq;
    critDisObj.propName = 'TYPE';
    critDisObj.value = 'DIS';
    disCrit.push(critDisObj);
    this.InputLookupCityIssuerObj.addCritInput = disCrit;
    this.InputLookupCityIssuerObj.isReady = true;
  }

  SetBpkbCity(event) {
    this.DOAssetDetail.patchValue({
      TaxCityIssuer: event.DistrictCode,
    });
  }

  GenerataAppAssetAttr(isRefresh: boolean) {
    let GenObj =
    {
      AppAssetId: this.AppAssetId,
      AssetTypeCode: this.AppAssetTypeCode,
      AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
      IsRefresh: isRefresh
    };
    this.http.post(URLConstant.GenerateAppAssetAttr, GenObj).subscribe(
      (response) => {
        this.AppAssetAttrObj = response['ResponseAppAssetAttrObjs'];
        if (response['IsDiffWithRefAttr']) {
          this.isDiffWithRefAttr = true;
          this.toastr.warningMessage(ExceptionConstant.REF_ATTR_CHANGE);
        }

        this.GenerateAppAssetAttrForm();
      });
  }

  GenerateAppAssetAttrForm() {
    if (this.AppAssetAttrObj != null) {
      this.appAssetAttrObjs = new Array<AppAssetAttrCustomObj>();
      for (let i = 0; i < this.AppAssetAttrObj.length; i++) {
        this.ListAttrAnswer.push([]);
        let appAssetAttrObj = new AppAssetAttrCustomObj();
        appAssetAttrObj.AssetAttrCode = this.AppAssetAttrObj[i].AttrCode;
        appAssetAttrObj.AssetAttrName = this.AppAssetAttrObj[i].AttrName;
        appAssetAttrObj.AttrValue = this.AppAssetAttrObj[i].AttrValue;
        appAssetAttrObj.AttrInputType = this.AppAssetAttrObj[i].AttrInputType;
        appAssetAttrObj.AttrLength = this.AppAssetAttrObj[i].AttrLength;
        if (this.AppAssetAttrObj[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.AppAssetAttrObj[i].AttrQuestionValue);
          if (appAssetAttrObj.AttrValue == null) {
            appAssetAttrObj.AttrValue = this.AppAssetAttrObj[i].AttrQuestionValue[0]
          }
        }
        else {
          this.ListAttrAnswer[i].push("");
        }
        this.appAssetAttrObjs.push(appAssetAttrObj);

      }
      let listAppAssetAttrs = this.DOAssetDetail.controls["AppAssetAttrObjs"] as FormArray;
      while (listAppAssetAttrs.length !== 0) {
        listAppAssetAttrs.removeAt(0);
      }
      for (let j = 0; j < this.appAssetAttrObjs.length; j++) {
        listAppAssetAttrs.push(this.addGroupAppAssetAttr(this.appAssetAttrObjs[j], j));
      }
      this.isAssetAttrReady = true;
    }
  }

  addGroupAppAssetAttr(appAssetAttrObj: AppAssetAttrCustomObj, i: number) {
    let ListValidator: Array<ValidatorFn> = this.setValidators(appAssetAttrObj);

    return this.setFbGroupAssetAttribute(appAssetAttrObj, i, ListValidator);
  }
  
  private setFbGroupAssetAttribute(appAssetAttrObj: AppAssetAttrCustomObj, i: number, ListValidator: Array<ValidatorFn>) {
    let tempFB = this.fb.group({
      No: [i],
      AssetAttrCode: [appAssetAttrObj.AssetAttrCode],
      AssetAttrName: [appAssetAttrObj.AssetAttrName],
      AttrInputType: [appAssetAttrObj.AttrInputType],
      AttrValue: [appAssetAttrObj.AttrValue]
    });
    if (ListValidator.length > 0) {
      tempFB.get("AttrValue").setValidators(ListValidator);
    }
    return tempFB;
  }

  private setValidators(appAssetAttrObjs: AppAssetAttrCustomObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (appAssetAttrObjs.AttrLength != null && appAssetAttrObjs.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(appAssetAttrObjs.AttrLength));
    }

    return ListValidator;
  }

  refreshAttr() {
    this.isAssetAttrReady = false;
    this.GenerataAppAssetAttr(true);
  }

  async GetAppData() {
    await this.http.post<AppObj>(URLConstant.GetAppById, {Id: this.AppId}).toPromise().then(
      (response) => {
        this.AppObj = response;
      }
    );
  }

  //For Fraud Checking
  async GetGS(){
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization); 

    await this.http.post(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        let returnGeneralSettingObj = response;

        let gsNeedCheckBySystem = returnGeneralSettingObj["ResGetListGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        let gsUseDigitalization = returnGeneralSettingObj["ResGetListGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
        
        if(gsNeedCheckBySystem != undefined){
          this.IntegratorCheckBySystemGsValue = gsNeedCheckBySystem.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if(gsUseDigitalization != undefined){
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
          this.getDigitalizationSvcType();
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }        
      }
    );
  }
  
  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapAsset, { TrxNo: this.AppObj.BizTemplateCode }).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

      var svcType = listSvcType.find(x => x == refSvcType);

      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
  }

  HitAPI() {
    if (this.listItem.controls[this.indexChassis]['controls']['SerialNoValue'].value == '') {
      this.toastr.warningMessage("Please Input Chassis No !");
    }
    else {
      this.toastr.successMessage("Submit with Integrator");
      this.IsIntegrator = true;
    }
  }

}

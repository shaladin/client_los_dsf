import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { MouCustCollateralObj } from 'app/shared/model/MouCustCollateralObj.Model';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/MouCustCollateralRegistrationObj.Model';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { MouCustObjForAddTrxData } from 'app/shared/model/MouCustObjForAddTrxData.Model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/ThirdPartyResultHForFraudChckObj.Model';
import { String } from 'typescript-string-operations';
import { GenericListByCodeObj } from 'app/shared/model/Generic/GenericListByCodeObj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/Response/GeneralSetting/ResGeneralSettingObj.model';
import { ResThirdPartyRsltHObj } from 'app/shared/model/Response/ThirdPartyResult/ResThirdPartyRsltHObj.model';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { ListMouCustCollateralDocObj } from 'app/shared/model/ListMouCustCollateralDocObj.Model';
import { MouCustCollateralDocObj } from 'app/shared/model/MouCustCollateralDocObj.Model';
import { formatDate } from '@angular/common';
import { RegexService } from 'app/shared/services/regex.services';
import { AssetTypeSerialNoLabelObj } from 'app/shared/model/SerialNo/AssetTypeSerialNoLabelObj.Model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

@Component({
  selector: 'app-mou-request-addcoll',
  templateUrl: './mou-request-addcoll.component.html',
  providers: [NGXToastrService]
})

export class MouRequestAddcollComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() MouType: string;
  @Output() ResponseMouAddColl: EventEmitter<any> = new EventEmitter();
  @Output() modeDetail: EventEmitter<any> = new EventEmitter();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;
  private ucLookupCollateral: UclookupgenericComponent;
  IsCalledIntegrator: boolean = false;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  latestReqDtCheckIntegrator: Date;
  generalSettingObj: GenericListByCodeObj;
  returnGeneralSettingObj: Array<ResGeneralSettingObj>;
  isNeedCheckBySystem: string;
  isUseDigitalization: string;
  thirdPartyRsltHId: number = 0; 
  controlNameIdNo: string = 'OwnerIdNo';
  resultPattern: Array<KeyValueObj>;
  customPattern: CustomPatternObj[];
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();

  @ViewChild('LookupCollateral') set content(content: UclookupgenericComponent) {
    if (content) { 
      this.ucLookupCollateral = content;
    }
  }

  listSelectedId: Array<number> = new Array<number>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();

  mouCustCollateralObj: MouCustCollateralObj;
  mouCustCollateralRegistrationObj: MouCustCollateralRegistrationObj;
  OwnerRelationshipObj: Array<KeyValueObj>;

  listCollateralData: Array<MouCustCollateralObj>;
  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;

  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;

  locationAddrObj: AddrObj;
  inputFieldLocationObj: InputFieldObj;

  CountExisting: number = 0;

  collateralObj: MouCustCollateralObj;
  collateralRegistrationObj: MouCustCollateralRegistrationObj;
  listCollExisting: Array<string> = new Array<string>();

  listMouCustCollateralDocObj: ListMouCustCollateralDocObj = new ListMouCustCollateralDocObj();
  mouCustCollateralDoc: MouCustCollateralDocObj = new MouCustCollateralDocObj();

  copyToLocationObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
  ];

  CollTypeList: Array<KeyValueObj> = new Array();
  CollateralPortionTypeObj: Array<KeyValueObj> = new Array();
  IdTypeList: Array<KeyValueObj>;
  type: string;
  SerialNoList: Array<AssetTypeSerialNoLabelObj>;
  items: FormArray;
  isUsed: boolean = true;
  custNo: string;
  mouCustObj: MouCustObj = new MouCustObj();
  returnMouCust: MouCustObj = new MouCustObj();
  collateralUsedPrcnt: number;
  maxPrcnt: number = 100;
  isEdit: boolean = false;
  AddCollDataForm = this.fb.group({
  })

  AddCollForm = this.fb.group({
    MouCustCollateralId: [''],
    MouCustCollateralRegistrationId: [''],
    CopyFromLegal: [''],
    AssetTypeCode: ['', [Validators.required]],
    CollateralValueAmt: [0, [Validators.required]],
    CollateralPrcnt: [0, [Validators.required, Validators.min(0), Validators.max(this.maxPrcnt)]],
    FullAssetCode: [''],
    AssetCategoryCode: [''],
    OwnerName: ['', [Validators.required]],
    OwnerRelationship: ['', [Validators.required]],
    OwnerIdNo: ['', [Validators.required]],
    MrIdType: ['', [Validators.required]],
    Notes: [''],
    RowVersionCollateral: [''],
    RowVersionCollateralRegistration: [''],
    items: this.fb.array([]),
    MrCollateralConditionCode: [''],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    CollateralPortionAmt: [0, Validators.required],
    CollateralPortionType: [''],
    ListDoc: this.fb.array([])
  })
  inputAddressObjForLegalAddr: InputAddressObj;
  inputAddressObjForLocAddr: InputAddressObj;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private regexService: RegexService) { this.type = 'Paging'; }

  async ngOnInit() {
    this.customPattern = new Array<CustomPatternObj>();
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.showPhn1 = false;
    this.inputAddressObjForLegalAddr.showPhn2 = false;
    this.inputAddressObjForLegalAddr.showPhn3 = false;
    this.inputAddressObjForLegalAddr.showFax = false;

    this.inputAddressObjForLocAddr = new InputAddressObj();
    this.inputAddressObjForLocAddr.showSubsection = false;
    this.inputAddressObjForLocAddr.showPhn1 = false;
    this.inputAddressObjForLocAddr.showPhn2 = false;
    this.inputAddressObjForLocAddr.showPhn3 = false;
    this.inputAddressObjForLocAddr.showFax = false;

    this.items = this.AddCollForm.get('items') as FormArray;
    this.bindUcLookup()
    this.initAddrObj();
    await this.getInitPattern();
    this.bindMouData();
    this.bindUcAddToTempData();
    this.tempPagingObj.isReady = true;
    this.GetGS();
    this.validateIfAddExisting();
  }

  bindUcAddToTempData() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = 'text';
    addCritCustNo.propName = 'CU.CUST_NO';
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  bindMouData() {
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.mouCustObj.PlafondType = response["PlafondType"];
        this.returnMouCust = response;
        this.custNo = this.returnMouCust.CustNo;
        this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
        this.thirdPartyObj.TrxTypeCode = CommonConstant.MOU_TRX_TYPE_CODE;
        this.thirdPartyObj.TrxNo = this.returnMouCust["MouCustNo"];
        this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_ASSET;
        if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response: ResThirdPartyRsltHObj) => {
              if (response != null) {
                this.latestReqDtCheckIntegrator = response.ReqDt;
                this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
              }
            });
        }
      });
      
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship}).subscribe(
      (response) => {
        this.OwnerRelationshipObj = response[CommonConstant.ReturnObj];
        if (this.OwnerRelationshipObj.length > 0) {
          this.AddCollForm.patchValue({
            OwnerRelationship: this.OwnerRelationshipObj[0].Key,
            CopyFromLegal: this.copyToLocationObj[0].Key
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodePaymentType }).subscribe(
      (response) => {
        this.CollateralPortionTypeObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          CollateralPortionType: this.CollateralPortionTypeObj[0].Key
        });
        this.CollateralPortionTypeChange();
      })

    this.http.post(URLConstant.GetMouCustCollateralByMouCustId, { Id: this.MouCustId }).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })

    var assetObj = {};
    this.http.post(URLConstant.GetListAssetTypeByCode, assetObj).subscribe(
      (response) => {      
        this.CollTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          AssetTypeCode: this.CollTypeList[0].Key
        });
        this.onItemChange(this.CollTypeList[0].Key);
      })

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode,  { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          MrIdType: this.IdTypeList[0].Key
        });
        this.setValidatorPattern(this.IdTypeList[0].Key);
      })

  }

  CollateralPortionTypeChange() {
    if (this.AddCollForm.controls.CollateralPortionType.value == CommonConstant.PaymentTypeAmt) {
      this.AddCollForm.controls["CollateralPortionAmt"].enable();
      this.AddCollForm.controls["CollateralPrcnt"].disable();
      this.AddCollForm.controls["CollateralPortionAmt"].setValidators([Validators.required, Validators.min(0)]);
      this.AddCollForm.controls["CollateralPortionAmt"].updateValueAndValidity();
    }
    else {
      this.AddCollForm.controls["CollateralPrcnt"].enable();
      this.AddCollForm.controls["CollateralPortionAmt"].disable();
      this.AddCollForm.controls["CollateralPrcnt"].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.AddCollForm.controls["CollateralPrcnt"].updateValueAndValidity();
    }
  }

  UpdateValueCollateralPortionAmt() {
    var CollateralPortionAmt = this.AddCollForm.controls.CollateralValueAmt.value * this.AddCollForm.controls.CollateralPrcnt.value / 100;
    if (this.AddCollForm.controls.CollateralPrcnt.value > 100) {
      this.toastr.warningMessage("Collateral Percentage exceeded 100 !");
      this.AddCollForm.patchValue({
        CollateralPortionAmt: 0,
        CollateralPrcnt: 0
      });
    }
    else {
      this.AddCollForm.patchValue({
        CollateralPortionAmt: CollateralPortionAmt
      });
    }
  }

  UpdateValueCollateralPrcnt() {
    var CollateralPrcnt = this.AddCollForm.controls.CollateralPortionAmt.value / this.AddCollForm.controls.CollateralValueAmt.value * 100;
    if (this.AddCollForm.controls.CollateralPortionAmt.value > this.AddCollForm.controls.CollateralValueAmt.value) {
      this.toastr.warningMessage("Collateral Portion Amount exceeded Collateral Value Amount !");
      this.AddCollForm.patchValue({
        CollateralPortionAmt: 0,
        CollateralPrcnt: 0
      });
    }
    else {
      this.AddCollForm.patchValue({
        CollateralPrcnt: CollateralPrcnt
      });
    }
  }

  bindUcLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.isReady = true;
  }

  bindUcLookupExisting() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.losUrl;
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.isReady = true;
  }

  updateUcLookup(value, firstBind, type) {
    this.criteriaList = new Array();
    if (value != null && type != "AddExisting") {
      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = 'A.IS_ACTIVE';
      this.criteriaObj.value = "1";
      this.criteriaList.push(this.criteriaObj);

      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = 'A.IS_FINAL';
      this.criteriaObj.value = "1";
      this.criteriaList.push(this.criteriaObj);

      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = 'B.ASSET_TYPE_CODE';
      this.criteriaObj.value = value;
      this.criteriaList.push(this.criteriaObj);
    } else {
      var arrMemberList = new Array();
      for (let index = 0; index < this.listCollateralData.length; index++) {
        arrMemberList.push(this.listCollateralData[index].CollateralNo)
      }

      if (arrMemberList.length != 0) {
        var addCritListCollateralNo = new CriteriaObj();
        addCritListCollateralNo.DataType = "numeric";
        addCritListCollateralNo.propName = "MCC.COLLATERAL_NO";
        addCritListCollateralNo.restriction = AdInsConstant.RestrictionNotIn;
        addCritListCollateralNo.listValue = arrMemberList;
        this.criteriaList.push(addCritListCollateralNo);
      }

      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = 'MCC.ASSET_TYPE_CODE';
      this.criteriaObj.value = value;
      this.criteriaList.push(this.criteriaObj);

      const addCritCustNo = new CriteriaObj();
      addCritCustNo.DataType = 'text';
      addCritCustNo.propName = 'MC.CUST_NO';
      addCritCustNo.restriction = AdInsConstant.RestrictionEq;
      addCritCustNo.value = this.custNo;
      this.criteriaList.push(addCritCustNo);
    }

    this.inputLookupObj.nameSelect = "";
    this.inputLookupObj.addCritInput = this.criteriaList;
    if (!firstBind) this.ucLookupCollateral.setAddCritInput();
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
  }

  ResetForm() {
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showPhn1 = false;
    this.inputAddressObjForLegalAddr.showPhn2 = false;
    this.inputAddressObjForLegalAddr.showPhn3 = false;
    this.inputAddressObjForLegalAddr.showFax = false;
    this.inputAddressObjForLocAddr = new InputAddressObj();
    this.inputAddressObjForLocAddr.showPhn1 = false;
    this.inputAddressObjForLocAddr.showPhn2 = false;
    this.inputAddressObjForLocAddr.showPhn3 = false;
    this.inputAddressObjForLocAddr.showFax = false;

    this.AddCollForm.patchValue({
      MouCustCollateralId: 0,
      MouCustCollateralRegistrationId: 0,
      CopyFromLegal: '',
      AssetTypeCode: this.CollTypeList[0].Key,
      CollateralValueAmt: 0,
      CollateralPrcnt: 0,
      FullAssetCode: '',
      AssetCategoryCode: '',
      OwnerName: '',
      OwnerRelationship: this.OwnerRelationshipObj[0].Key,
      OwnerIdNo: '',
      MrIdType: this.IdTypeList[0].Key,
      Notes: '',
      RowVersionCollateral: '',
      RowVersionCollateralRegistration: '',
      MrCollateralConditionCode: '',
      ManufacturingYear: '',
      CollateralPortionAmt: 0,
      CollateralPortionType: this.CollateralPortionTypeObj[0].Key,
    });
  }

  async getInitPattern() {
    await this.regexService.getListPattern().subscribe(
      response => {
        this.resultPattern = response[CommonConstant.ReturnObj];
        if (this.resultPattern != undefined) {
          for (let i = 0; i < this.resultPattern.length; i++) {
            let patternObj: CustomPatternObj = new CustomPatternObj();
            let pattern: string = this.resultPattern[i].Value;

            patternObj.pattern = pattern;
            patternObj.invalidMsg = this.regexService.getErrMessage(pattern);
            this.customPattern.push(patternObj);
          }
        }
      }
    );
  }

  setValidator(pattern: string) {
    if (pattern != undefined) {
      this.AddCollForm.controls[this.controlNameIdNo].clearValidators();
      this.AddCollForm.controls[this.controlNameIdNo].updateValueAndValidity();
      this.AddCollForm.controls[this.controlNameIdNo].setValidators([Validators.required, Validators.pattern(pattern)]);
      this.AddCollForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
  }

  setValidatorPattern(idTypeValue) {
    var pattern: string = '';
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        var result = this.resultPattern.find(x => x.Key == idTypeValue)
        if (result != undefined) {
          pattern = result.Value;
        }
      }
    }
    this.setValidator(pattern);
  }

  ChangeIdType(IdType: string) {
    this.setValidatorPattern(IdType);
  }

  open(pageType) {
    this.ResetForm();

    this.AddCollForm.controls.MrCollateralConditionCode.disable();
    this.type = pageType;
    if (pageType == 'AddExisting') {
      this.bindUcLookupExisting();
      this.updateUcLookup(this.CollTypeList[0].Value, true, pageType);
    } else {
      this.bindUcLookup();
      this.updateUcLookup(this.CollTypeList[0].Value, true, pageType);
      this.AddCollForm.controls.CopyFromLegal.enable();
      this.AddCollForm.controls.AssetTypeCode.enable();
      this.AddCollForm.controls.CollateralValueAmt.enable();
      this.AddCollForm.controls.FullAssetCode.enable();
      this.AddCollForm.controls.AssetCategoryCode.enable();
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.OwnerRelationship.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.MrIdType.enable();
      this.AddCollForm.controls.Notes.enable();
      this.AddCollForm.controls.ManufacturingYear.enable();

    }
    this.AddCollForm.updateValueAndValidity();
  }

  BindExistingCollateralSavedData(listCollateralNo: any) {
    const addCritCollateralNo = new CriteriaObj();
    addCritCollateralNo.DataType = 'text';
    addCritCollateralNo.propName = 'CL.COLLATERAL_NO';
    addCritCollateralNo.restriction = AdInsConstant.RestrictionNotIn;
    addCritCollateralNo.listValue = listCollateralNo;
    this.tempPagingObj.addCritInput.push(addCritCollateralNo);
  }

  initAddrObj() {
    this.initAddrLegalObj();
    this.initAddrLocationObj();
  }

  initAddrLegalObj() {
    this.legalAddrObj = new AddrObj();
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();

  }

  initAddrLocationObj() {
    this.locationAddrObj = new AddrObj();
    this.inputFieldLocationObj = new InputFieldObj();
    this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();
  }

  getLookupCollateralTypeResponse(e) {
    if (this.type == "AddEdit") {
      this.AddCollForm.patchValue({
        FullAssetCode: e.FullAssetCode,
        FullAssetName: e.FullAssetName,
        AssetCategoryCode: e.AssetCategoryCode
      });
    } else {
      this.http.post(URLConstant.GetMouCustCollateralDataExistingByCollateralNo, { TrxNo: e.CollateralNo }).subscribe(
        (response) => {

          this.collateralObj = response['MouCustCollateral'];
          this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

          this.maxPrcnt = 100 - e.SumCollateralPrcnt;
          this.AddCollForm.controls.CollateralPrcnt.setValidators([Validators.required, Validators.min(0), Validators.max(this.maxPrcnt)]);
          this.AddCollForm.controls.CollateralPrcnt.updateValueAndValidity();

          this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
          this.inputLookupObj.jsonSelect = this.collateralObj;
          this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.collateralObj.AssetTypeCode }).subscribe(
            (response: GenericListObj) => {
              while (this.items.length) {
                this.items.removeAt(0);
              }
              this.SerialNoList = response.ReturnObject;
              for (var i = 0; i < this.SerialNoList["length"]; i++) {
                var eachDataDetail = this.fb.group({
                  SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                  SerialNoValue: ['', Validators.required],
                  IsMandatory: [this.SerialNoList[i].IsMandatory]
                }) as FormGroup;
                this.items.push(eachDataDetail);
                if (this.items.controls[0] != null) {
                  this.items['controls'][0].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo1,
                  });
                }
                if (this.items.controls[1] != null) {
                  this.items['controls'][1].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo2,
                  });
                }
                if (this.items.controls[2] != null) {
                  this.items['controls'][2].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo3,
                  });
                }
                if (this.items.controls[3] != null) {
                  this.items['controls'][3].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo4,
                  });
                }
                if (this.items.controls[4] != null) {
                  this.items['controls'][4].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo4,
                  });
                }
                this.items.controls[i]['controls']['SerialNoValue'].disable();
              }
            });

          this.AddCollForm.patchValue({
            MouCustCollateralId: this.collateralObj.MouCustCollateralId,
            AssetTypeCode: this.collateralObj.AssetTypeCode,
            FullAssetCode: this.collateralObj.FullAssetCode,
            FullAssetName: this.collateralObj.FullAssetName,
            AssetCategoryCode: this.collateralObj.AssetCategoryCode,
            MrCollateralConditionCode: this.collateralObj.MrCollateralConditionCode,
            MrCollateralUsageCode: this.collateralObj.MrCollateralUsageCode,
            CollateralStat: this.collateralObj.CollateralStat,
            CollateralValueAmt: this.collateralObj.CollateralValueAmt,
            CollateralPrcnt: this.maxPrcnt,
            CollateralPortionAmt: this.collateralObj.CollateralPortionAmt,
            CollateralNotes: this.collateralObj.CollateralNotes,
            ManufacturingYear: this.collateralObj.ManufacturingYear,
            RowVersionCollateral: this.collateralObj.RowVersion,
            MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
            OwnerName: this.collateralRegistrationObj.OwnerName,
            OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
            MrIdType: this.collateralRegistrationObj.MrIdTypeCode,
            OwnerRelationship: this.collateralRegistrationObj.MrOwnerRelationshipCode,
            Notes: this.collateralRegistrationObj.Notes,
            RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
          });
          this.setValidatorPattern(this.collateralRegistrationObj.MrIdTypeCode);
          this.legalAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
          this.legalAddrObj.City = this.collateralRegistrationObj.OwnerCity;
          this.legalAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
          this.legalAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
          this.legalAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
          this.legalAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
          if (this.collateralRegistrationObj.Phn1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.Phn2 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.PhnArea1 != null) this.legalAddrObj.PhnArea1 = this.collateralRegistrationObj.PhnArea1;
          if (this.collateralRegistrationObj.PhnArea2 != null) this.legalAddrObj.PhnArea2 = this.collateralRegistrationObj.PhnArea2;

          this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };

          this.AddCollForm.controls.CopyFromLegal.disable();
          this.AddCollForm.controls.CollateralValueAmt.disable();
          this.AddCollForm.controls.FullAssetCode.disable();
          this.AddCollForm.controls.AssetCategoryCode.disable();
          this.AddCollForm.controls.OwnerName.disable();
          this.AddCollForm.controls.OwnerRelationship.disable();
          this.AddCollForm.controls.OwnerIdNo.disable();
          this.AddCollForm.controls.MrIdType.disable();
          this.AddCollForm.controls.Notes.disable();
          this.AddCollForm.controls.ManufacturingYear.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].Addr.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].AreaCode3.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].AreaCode4.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].PhnArea1.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].Phn1.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].PhnExt1.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].PhnArea2.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].Phn2.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].PhnExt2.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].PhnArea3.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].Phn2.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].PhnExt3.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].Fax.disable();
          this.AddCollForm.controls["legalAddr"]["controls"].FaxArea.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].Addr.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].AreaCode3.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].AreaCode4.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].PhnArea1.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].Phn1.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].PhnExt1.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].PhnArea2.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].Phn2.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].PhnExt2.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].PhnArea3.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].Phn2.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].PhnExt3.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].Fax.disable();
          this.AddCollForm.controls["locationAddr"]["controls"].FaxArea.disable();

          this.inputAddressObjForLegalAddr.default = this.legalAddrObj;
          this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;

          this.locationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
          this.locationAddrObj.City = this.collateralRegistrationObj.LocationCity;
          this.locationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
          this.locationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
          this.locationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
          this.locationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
          if (this.collateralRegistrationObj.Phn1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.Phn2 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.PhnArea1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
          if (this.collateralRegistrationObj.PhnArea1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

          this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
          this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };

          this.inputAddressObjForLocAddr.default = this.locationAddrObj;
          this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;
        })
    }
  }

  onItemChange(value, UserChange: boolean = false) {
    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: value }).subscribe(
      (response: GenericListObj) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }
        this.SerialNoList = response.ReturnObject;
        for (var i = 0; i < this.SerialNoList["length"]; i++) {
          var eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: [''],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }
      });
    this.updateUcLookup(value, UserChange ? false : true, this.type);
  }

  SaveForm() {
    this.setCollateralObjForSave();
    this.listMouCustCollateralDocObj.MouCustCollateralDocObj = new Array();

    for (var i = 0; i < this.AddCollForm.value.ListDoc["length"]; i++) {
      this.mouCustCollateralDoc = new MouCustCollateralDocObj();
      if (this.AddCollForm.value.ListDoc[i].IsReceived == null) {
        this.mouCustCollateralDoc.IsReceived = false;
      }
      else {
        this.mouCustCollateralDoc.IsReceived = this.AddCollForm.value.ListDoc[i].IsReceived;
      }
      this.mouCustCollateralDoc.DocCode = this.AddCollForm.value.ListDoc[i].DocCode;
      this.mouCustCollateralDoc.DocNo = this.AddCollForm.value.ListDoc[i].DocNo;
      this.mouCustCollateralDoc.ExpiredDt = this.AddCollForm.value.ListDoc[i].ACDExpiredDt;
      this.mouCustCollateralDoc.DocNotes = this.AddCollForm.value.ListDoc[i].DocNotes;
      this.listMouCustCollateralDocObj.MouCustCollateralDocObj.push(this.mouCustCollateralDoc);
    }
    var custCollObj = {
      MouCustCollateral: this.mouCustCollateralObj,
      MouCustCollateralRegistration: this.mouCustCollateralRegistrationObj,
      ListMouCustCollateralDoc: this.listMouCustCollateralDocObj.MouCustCollateralDocObj
    }

    if (this.collateralObj == null) {
      this.http.post(URLConstant.AddMouCustCollateralData, custCollObj).subscribe(
        (response) => {
          this.AddCollForm.reset();
          this.toastr.successMessage(response["message"]);
          this.type = 'Paging';
          this.ClearForm();
        });
    }
    else {
      this.http.post(URLConstant.EditMouCustCollateralData, custCollObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.type = 'Paging';
          this.collateralObj = null;
          this.ClearForm();
        });
    }
  }

  setCollateralObjForSave() {
    this.mouCustCollateralObj = new MouCustCollateralObj;
    this.mouCustCollateralRegistrationObj = new MouCustCollateralRegistrationObj;

    if (this.collateralObj != null) {
      this.mouCustCollateralObj = this.collateralObj;
      this.mouCustCollateralRegistrationObj = this.collateralRegistrationObj;
    }
    this.mouCustCollateralObj.MouCustId = this.MouCustId;
    this.mouCustCollateralObj.AssetTypeCode = this.AddCollForm.controls.AssetTypeCode.value;
    this.mouCustCollateralObj.FullAssetCode = this.AddCollForm.controls.FullAssetCode.value;
    this.mouCustCollateralObj.FullAssetName = this.AddCollForm.controls.FullAssetName.value.value;
    this.mouCustCollateralObj.AssetCategoryCode = this.AddCollForm.controls.AssetCategoryCode.value;
    this.mouCustCollateralObj.MrCollateralConditionCode = CommonConstant.AssetConditionUsed;
    this.mouCustCollateralObj.MrCollateralUsageCode = CommonConstant.AssetUsageComm;
    this.mouCustCollateralObj.CollateralStat = CommonConstant.AssetConditionNew;

    if (this.items.controls[0] != null) {
      this.mouCustCollateralObj.SerialNo1 = this.items.controls[0]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[1] != null) {
      this.mouCustCollateralObj.SerialNo2 = this.items.controls[1]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[2] != null) {
      this.mouCustCollateralObj.SerialNo3 = this.items.controls[2]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[3] != null) {
      this.mouCustCollateralObj.SerialNo4 = this.items.controls[3]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[4] != null) {
      this.mouCustCollateralObj.SerialNo5 = this.items.controls[4]["controls"]["SerialNoValue"].value;
    }

    this.mouCustCollateralObj.CollateralValueAmt = this.AddCollForm.controls.CollateralValueAmt.value;
    this.mouCustCollateralObj.CollateralPrcnt = this.AddCollForm.controls.CollateralPrcnt.value;
    this.mouCustCollateralObj.CollateralPortionAmt = this.AddCollForm.controls.CollateralPortionAmt.value;
    this.mouCustCollateralObj.CollateralNotes = this.AddCollForm.controls.Notes.value;
    this.mouCustCollateralObj.ManufacturingYear = this.AddCollForm.controls.ManufacturingYear.value;

    this.mouCustCollateralRegistrationObj.OwnerName = this.AddCollForm.controls.OwnerName.value;
    this.mouCustCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls.OwnerIdNo.value;
    this.mouCustCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls.MrIdType.value;
    this.mouCustCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.mouCustCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.mouCustCollateralRegistrationObj.Notes = this.AddCollForm.controls.Notes.value;

    this.mouCustCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["legalAddr"]["controls"].Addr.value;
    this.mouCustCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["legalAddr"]["controls"].City.value;
    this.mouCustCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode1.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode2.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode3.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode4.value;

    this.mouCustCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["locationAddr"]["controls"].Addr.value;
    this.mouCustCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["locationAddr"]["controls"].City.value;
    this.mouCustCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["locationAddrZipcode"]["controls"].value.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode1.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode2.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode3.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode4.value;
  }

  copyToLocation() {
    this.locationAddrObj.Addr = this.AddCollForm.controls["legalAddr"]["controls"].Addr.value;
    this.locationAddrObj.AreaCode1 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode1.value;
    this.locationAddrObj.AreaCode2 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode2.value;
    this.locationAddrObj.AreaCode3 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode3.value;
    this.locationAddrObj.AreaCode4 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode4.value;
    this.locationAddrObj.City = this.AddCollForm.controls["legalAddr"]["controls"].City.value;
    this.locationAddrObj.Fax = this.AddCollForm.controls["legalAddr"]["controls"].Fax.value;
    this.locationAddrObj.FaxArea = this.AddCollForm.controls["legalAddr"]["controls"].FaxArea.value;
    this.locationAddrObj.Phn1 = this.AddCollForm.controls["legalAddr"]["controls"].Phn1.value;
    this.locationAddrObj.Phn2 = this.AddCollForm.controls["legalAddr"]["controls"].Phn2.value;
    this.locationAddrObj.PhnArea1 = this.AddCollForm.controls["legalAddr"]["controls"].PhnArea1.value;
    this.locationAddrObj.PhnArea2 = this.AddCollForm.controls["legalAddr"]["controls"].PhnArea2.value;
    this.locationAddrObj.PhnExt1 = this.AddCollForm.controls["legalAddr"]["controls"].PhnExt1.value;
    this.locationAddrObj.PhnExt2 = this.AddCollForm.controls["legalAddr"]["controls"].PhnExt2.value;
    this.locationAddrObj.SubZipcode = this.AddCollForm.controls["legalAddr"]["controls"].SubZipcode.value;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value };

    this.inputAddressObjForLocAddr.default = this.locationAddrObj;
    this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;
  }

  editData(MouCustCollId, isAddEdit) {

    if (isAddEdit == true) {
      this.type = "AddEdit";
    } else {
      this.isEdit = true;
      this.type = "AddExisting";
      this.AddCollForm.controls.AssetTypeCode.disable();
      this.AddCollForm.controls.CopyFromLegal.disable();
      this.AddCollForm.controls.CollateralValueAmt.disable();
      this.AddCollForm.controls.FullAssetCode.disable();
      this.AddCollForm.controls.AssetCategoryCode.disable();
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.OwnerRelationship.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.MrIdType.disable();
      this.AddCollForm.controls.Notes.disable();
      this.AddCollForm.controls.ManufacturingYear.disable();
      this.inputAddressObjForLegalAddr.isReadonly = true;
      this.inputAddressObjForLocAddr.isReadonly = true;
    }
    this.http.post(URLConstant.GetMouCustCollateralDataForUpdateByMouCustCollateralId, { Id: MouCustCollId }).subscribe(
      (response) => {

        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

        this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
        this.inputLookupObj.jsonSelect = this.collateralObj;
        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.collateralObj.AssetTypeCode }).subscribe(
          (response: GenericListObj) => {
            while (this.items.length) {
              this.items.removeAt(0);
            }
            this.SerialNoList = response.ReturnObject;
            for (var i = 0; i < this.SerialNoList["length"]; i++) {
              var eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: ['', Validators.required],
                IsMandatory: [this.SerialNoList[i].IsMandatory]
              }) as FormGroup;
              this.items.push(eachDataDetail);
              if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
                this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }
              else {
                this.items.controls[i]['controls']['SerialNoValue'].clearValidators();
                this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }

              if (this.items.controls[0] != null) {
                this.items['controls'][0].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo1,
                });
              }
              if (this.items.controls[1] != null) {
                this.items['controls'][1].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo2,
                });
              }
              if (this.items.controls[2] != null) {
                this.items['controls'][2].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo3,
                });
              }
              if (this.items.controls[3] != null) {
                this.items['controls'][3].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo4,
                });
              }
              if (this.items.controls[4] != null) {
                this.items['controls'][4].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo4,
                });
              }
              if (this.type == "AddExisting")
                this.items.controls[i]['controls']['SerialNoValue'].disable();
            }
          });

        this.getRefAssetDocList(this.collateralObj.AssetTypeCode);

        this.AddCollForm.patchValue({
          MouCustCollateralId: this.collateralObj.MouCustCollateralId,
          AssetTypeCode: this.collateralObj.AssetTypeCode,
          FullAssetCode: this.collateralObj.FullAssetCode,
          FullAssetName: this.collateralObj.FullAssetName,
          AssetCategoryCode: this.collateralObj.AssetCategoryCode,
          MrCollateralConditionCode: this.collateralObj.MrCollateralConditionCode,
          MrCollateralUsageCode: this.collateralObj.MrCollateralUsageCode,
          CollateralStat: this.collateralObj.CollateralStat,
          SerialNo1: this.collateralObj.SerialNo1,
          SerialNo2: this.collateralObj.SerialNo2,
          SerialNo3: this.collateralObj.SerialNo3,
          SerialNo4: this.collateralObj.SerialNo4,
          SerialNo5: this.collateralObj.SerialNo5,
          CollateralValueAmt: this.collateralObj.CollateralValueAmt,
          CollateralPrcnt: this.collateralObj.CollateralPrcnt,
          CollateralPortionAmt: this.collateralObj.CollateralPortionAmt,
          CollateralNotes: this.collateralObj.CollateralNotes,
          ManufacturingYear: this.collateralObj.ManufacturingYear,
          RowVersionCollateral: this.collateralObj.RowVersion,

          MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
          OwnerName: this.collateralRegistrationObj.OwnerName,
          OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
          MrIdType: this.collateralRegistrationObj.MrIdTypeCode,
          OwnerRelationship: this.collateralRegistrationObj.MrOwnerRelationshipCode,
          Notes: this.collateralRegistrationObj.Notes,
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
        });

        this.setValidatorPattern(this.collateralRegistrationObj.MrIdTypeCode);

        this.AddCollForm.controls.MrCollateralConditionCode.disable();
        this.AddCollForm.updateValueAndValidity();

        this.legalAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
        this.legalAddrObj.City = this.collateralRegistrationObj.OwnerCity;
        this.legalAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
        this.legalAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
        this.legalAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
        this.legalAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };

        this.inputAddressObjForLegalAddr.default = this.legalAddrObj;
        this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;

        this.locationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
        this.locationAddrObj.City = this.collateralRegistrationObj.LocationCity;
        this.locationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
        this.locationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
        this.locationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
        this.locationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };

        this.inputAddressObjForLocAddr.default = this.locationAddrObj;
        this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;
      })
  }

  Cancel() {
    this.clearList();
    this.ClearForm();
    this.bindUcLookup()
    this.initAddrObj();
    this.bindMouData();
    this.bindUcAddToTempData();
    this.type = 'Paging';
  }

  ClearForm() {
    this.AddCollForm = this.fb.group({
      MouCustCollateralId: [''],
      MouCustCollateralRegistrationId: [''],
      CopyFromLegal: [''],
      AssetTypeCode: ['', [Validators.required]],
      CollateralValueAmt: [0, [Validators.required]],
      CollateralPrcnt: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      FullAssetCode: [''],
      AssetCategoryCode: [''],
      OwnerName: ['', [Validators.required]],
      OwnerRelationship: ['', [Validators.required]],
      OwnerIdNo: ['', [Validators.required]],
      MrIdType: ['', [Validators.required]],
      Notes: [''],
      SerialNo1: [''],
      SerialNo2: [''],
      SerialNo3: [''],
      SerialNo4: [''],
      SerialNo5: [''],
      RowVersionCollateral: [''],
      RowVersionCollateralRegistration: [''],
      items: this.fb.array([]),
      MrCollateralConditionCode: [''],
      ManufacturingYear: ['', [Validators.pattern("^[0-9]+$")]],
      CollateralPortionAmt: [''],
      CollateralPortionType: [''],
      ListDoc: this.fb.array([])
    })
    this.AddCollForm.updateValueAndValidity();

    this.inputFieldLocationObj.inputLookupObj.nameSelect = '';
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: '' }
    this.inputFieldLegalObj.inputLookupObj.nameSelect = '';
    this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: '' }
    this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;

    this.items = this.AddCollForm.get('items') as FormArray;
    this.bindUcLookup()
    this.initAddrObj();
    this.bindMouData();
  }

  SaveExistingCollateral() {
    if (this.isEdit == true) {
      this.mouCustCollateralObj = this.collateralObj;
      this.mouCustCollateralRegistrationObj = this.collateralRegistrationObj;

      var custCollObj = {
        MouCustCollateral: this.mouCustCollateralObj,
        MouCustCollateralRegistration: this.mouCustCollateralRegistrationObj
      }
      this.mouCustCollateralObj.CollateralPrcnt = this.AddCollForm.controls.CollateralPrcnt.value;
      this.mouCustCollateralObj.CollateralPortionAmt = this.AddCollForm.controls.CollateralPortionAmt.value;
      this.http.post(URLConstant.EditMouCustCollateralData, custCollObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.type = 'Paging';
          this.collateralObj = null;
          this.ClearForm();
        });
      this.isEdit = false;
    } else {
      this.mouCustCollateralObj = new MouCustCollateralObj();
      this.mouCustCollateralObj.MouCustId = this.MouCustId;
      this.mouCustCollateralObj.MouCustCollateralId = this.collateralObj.MouCustCollateralId;
      this.mouCustCollateralObj.CollateralNo = this.collateralObj.CollateralNo;
      this.mouCustCollateralObj.CollateralPrcnt = this.AddCollForm.controls.CollateralPrcnt.value;
      this.mouCustCollateralObj.CollateralPortionAmt = this.AddCollForm.controls.CollateralPortionAmt.value;

      this.http.post(URLConstant.AddExistingCustCollateralData, this.mouCustCollateralObj).subscribe(
        response => {
          this.toastr.successMessage(response['message']);
          this.type = 'Paging';
          this.bindMouData();
          this.ClearForm();
        }
      );
    }

  }
  clearList() {
    this.listSelectedId = [];
    this.tempPagingObj.addCritInput = new Array<CriteriaObj>();

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = 'text';
    addCritCustNo.propName = 'MC.CUST_NO';
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  delete(MouCustCollId) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var custCollObj = { Id: MouCustCollId };
      this.http.post(URLConstant.DeleteMouCustCollateral, custCollObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.bindMouData();
        });
    }
  }

  next() {
    var sumCollateralValue = 0;
    var mouCustObjForAddTrxData = new MouCustObjForAddTrxData();
    mouCustObjForAddTrxData.MouCustObj.MouCustId = this.MouCustId;
    for (let i = 0; i < this.listCollateralData.length; i++) {
      if (this.listCollateralData[i].CollateralPortionAmt != null) {
        sumCollateralValue += this.listCollateralData[i].CollateralPortionAmt;
      }
    }
    if (this.mouCustObj.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOCLLTR) {
      if (sumCollateralValue != this.returnMouCust.PlafondAmt) {
        this.toastr.errorMessage(ExceptionConstant.COLL_VALUE_MUST_EQUALS_PLAFOND_AMT);
        return;
      }
    }

    if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
      if (!this.IsCalledIntegrator) {
        if (confirm("Continue without integrator ?")) {
          this.ResponseMouAddColl.emit({ StatusCode: "200" });
        }
      } else {
        this.http.post(URLConstant.CheckMouCustCollateralIntegrator, mouCustObjForAddTrxData).toPromise().then(
          (response) => {
            this.toastr.successMessage("Success !");
            this.ResponseMouAddColl.emit({ StatusCode: "200" });

          }
        );
      }
    }
    else {
      this.ResponseMouAddColl.emit({ StatusCode: "200" });
    }
    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        var mouCustObjForSave = response;
        mouCustObjForSave.PlafondCollateralAmt = sumCollateralValue;
        this.http.post(URLConstant.UpdatePlafondCollateralAmtMouCust, mouCustObjForSave).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.bindMouData();
          });
      });

  }

  back() {
    this.modeDetail.emit({ mode: "edit" });
    this.ResponseMouAddColl.emit({ StatusCode: "-1" });
  }

  GetGS() {
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);
    this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).subscribe(
      (response) => {
        this.returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];

        var gsNeedCheckBySystem = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

        if (gsNeedCheckBySystem != undefined) {
          this.isNeedCheckBySystem = gsNeedCheckBySystem.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if (gsUseDigitalization != undefined) {
          this.isUseDigitalization = gsUseDigitalization.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
          this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
          this.thirdPartyObj.TrxTypeCode = CommonConstant.MOU_TRX_TYPE_CODE;
          this.thirdPartyObj.TrxNo = this.returnMouCust["MouCustNo"];
          this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_ASSET;
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response: ResThirdPartyRsltHObj) => {
              if (response != null) {
                this.latestReqDtCheckIntegrator = response.ReqDt;
                this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
              }
            });
        }
      });
  }

  getRefAssetDocList(AssetTypeCode) {
    
    this.http.post(URLConstant.GetRefAssetDocList, {Code: AssetTypeCode}).subscribe(
      (response) => {
        console.log("getRefAssetDocList: " + JSON.stringify(response));
        if (response[CommonConstant.ReturnObj].length > 0) {
          var ListDoc = this.AddCollForm.get('ListDoc') as FormArray;

          if (ListDoc.length > 0) {
            while (ListDoc.length !== 0) {
              ListDoc.removeAt(0)
            }
          }

          for (var i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            var assetDocumentDetail = this.fb.group({
              DocCode: response[CommonConstant.ReturnObj][i].AssetDocCode,
              AssetDocName: response[CommonConstant.ReturnObj][i].AssetDocName,
              IsValueNeeded: response[CommonConstant.ReturnObj][i].IsValueNeeded,
              IsMandatoryNew: response[CommonConstant.ReturnObj][i].IsMandatoryNew,
              IsMandatoryUsed: response[CommonConstant.ReturnObj][i].IsMandatoryUsed,
              IsReceived: response[CommonConstant.ReturnObj][i].IsReceived,
              DocNo: response[CommonConstant.ReturnObj][i].DocNo,
              ACDExpiredDt: response[CommonConstant.ReturnObj][i].ACDExpiredDt,
              DocNotes: response[CommonConstant.ReturnObj][i].DocNotes
            }) as FormGroup;
            ListDoc.push(assetDocumentDetail);
          }
        }
        if (this.type == 'AddExisting') {
          this.setMouCustCollateralDoc(this.collateralObj.MouCustCollateralId);
        } else {
          this.setMouCustCollateralDoc(this.collateralObj.MouCustCollateralId);
        }
      });
  }

  setMouCustCollateralDoc(MouCustCollateralId: number = 0) {
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: MouCustCollateralId }).subscribe(
      (response) => {
        var MouCustCollateralDocs = new Array();
        MouCustCollateralDocs = response["MouCustCollateralDocs"];
        if (MouCustCollateralDocs["length"] > 0) {

          for (var i = 0; i < MouCustCollateralDocs.length; i++) {
            this.AddCollForm.controls.ListDoc["controls"][i].patchValue({
              DocNo: MouCustCollateralDocs[i].DocNo,
              DocNotes: MouCustCollateralDocs[i].DocNotes,
              ACDExpiredDt: formatDate(MouCustCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
              IsReceived: MouCustCollateralDocs[i].IsReceived
            })
          }
        } else {
          if (this.type == 'AddExisting') {
            var listDocExisting = this.AddCollForm.get('ListDoc') as FormArray;
            while (listDocExisting.length !== 0) {
              listDocExisting.removeAt(0);
            }
          }
        }
      });
  }

  validateIfAddExisting() {
    var mouCustObj = { MouCustId: this.MouCustId }
    this.http.post(URLConstant.ValidateAddExistingByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.CountExisting = response['ReturnObject'];
      })
  }

  HitAPI() {
    let assetData = this.listCollateralData;
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
}

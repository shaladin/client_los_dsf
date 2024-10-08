import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { formatDate } from '@angular/common';
import { RegexService } from 'app/shared/services/regex.services';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { MouCustCollateralStatXObj } from 'app/impl/shared/model/MouCustCollateralStatXObj.Model';
import { RefAttrGenerate } from 'app/components/sharing-components/ref-attr/ref-attr-form-generate/RefAttrGenerate.service';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/third-party-result-h-for-fraud-chck-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CustomPatternObj } from 'app/shared/model/custom-pattern-obj.model';
import { UcTempPagingObj } from 'app/shared/model/temp-paging/uc-temp-paging-obj.model';
import { MouCustCollateralObj } from 'app/shared/model/mou-cust-collateral-obj.model';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/mou-cust-collateral-registration-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { MouCustAddrObj } from 'app/shared/model/mou-cust-addr-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { ListMouCustCollateralDocObj } from 'app/shared/model/list-mou-cust-collateral-doc-obj.model';
import { MouCustCollateralDocObj } from 'app/shared/model/mou-cust-collateral-doc-obj.model';
import { AssetTypeSerialNoLabelObj } from 'app/shared/model/serial-no/asset-type-serial-no-label-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { environment } from 'environments/environment';
import { ResThirdPartyRsltHObj } from 'app/shared/model/response/third-party-result/res-third-party-rslt-h-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { RefAttrGenerateObj } from 'app/shared/model/ref-attr-generate.model';
import { ResMouCustCollateralAttrObj, MouCustCollateralAttrObj } from 'app/shared/model/mou-cust-collateral-attr-obj.model';
import { MouCustObjForAddTrxData } from 'app/shared/model/mou-cust-obj-for-add-trx-data.model';
import { RefProvDistrictObj } from 'app/shared/model/ref-prov-district-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';

@Component({
  selector: 'app-mou-request-addcoll-x',
  templateUrl: './mou-request-addcoll-x.component.html',
  providers: [NGXToastrService]
})

export class MouRequestAddcollXComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() MouType: string;
  @Output() ResponseMouAddColl: EventEmitter<any> = new EventEmitter();
  @Output() modeDetail: EventEmitter<any> = new EventEmitter();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;
  private ucLookupCollateral: UclookupgenericComponent;
  readonly ownerTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly ownerTypeCompany: string = CommonConstant.CustTypeCompany;
  IsCalledIntegrator: boolean = false;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  latestReqDtCheckIntegrator: Date;
  generalSettingObj: GenericListByCodeObj;
  returnGeneralSettingObj: Array<ResGeneralSettingObj>;
  isNeedCheckBySystem: string;
  isUseDigitalization: string;
  IsSvcExist: boolean = false;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  thirdPartyRsltHId: number = 0;
  controlNameIdNo: string = 'OwnerIdNo';
  resultPattern: Array<KeyValueObj>;
  customPattern: CustomPatternObj[];
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  listCollTypeMandatoryManufacturingYear: Array<string> = new Array<string>();
  listCollTypeMandatory: Array<string> = new Array<string>();
  isMandatoryManufacturingYear: boolean = false;
  attrSettingObj: RefAttrSettingObj = new RefAttrSettingObj();
  isMandatoryObj: boolean = false;

  @ViewChild('LookupCollateral') set content(content: UclookupgenericComponent) {
    if (content) {
      this.ucLookupCollateral = content;
    }
  }

  listSelectedId: Array<number> = new Array<number>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();

  mouCustCollateralObj: MouCustCollateralObj;
  mouCustCollateralRegistrationObj: MouCustCollateralRegistrationObj;
  OwnerRelationshipObj: Array<KeyValueObj> = new Array();

  listCollateralData: Array<MouCustCollateralObj> = new Array();
  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;
  listMouCustAddrObj: Array<MouCustAddrObj> = new Array();

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

  CustPersonalObj: any;
  CustPersonalJobDataObj: any;
  CustCompanyObj: any;

  copyToLocationObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
    {
      Key: "MAILING",
      Value: "Mailing"
    },
  ];

  CollateralStatusObj: Array<KeyValueObj> = [
    {
      Key: "RECEIVED",
      Value: "Received"
    },
    {
      Key: "RELEASED",
      Value: "Released"
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
    CopyToOwnerLocation: [''],
    AssetTypeCode: ['', [Validators.required]],
    CollateralValueAmt: [0, [Validators.required]],
    CollateralPrcnt: [0, [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)]],
    MaxCollPrcnt: [100, [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)]],
    FullAssetCode: [''],
    AssetCategoryCode: [''],
    OwnerName: [''],
    OwnerRelationship: [''],
    OwnerIdNo: [''],
    MrIdType: [''],
    Notes: [''],
    MrOwnerTypeCode: [''],
    TaxCityIssuer: [''],
    TaxIssueDt: [''],
    OwnerProfessionCode: [''],
    OwnerMobilePhnNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    SelfOwner: [false],
    RowVersionCollateral: [''],
    RowVersionCollateralRegistration: [''],
    items: this.fb.array([]),
    MrCollateralConditionCode: [''],
    ManufacturingYear: ['', [Validators.pattern("^[0-9]+$")]],
    CollateralPortionAmt: [0, Validators.required],
    CollateralPortionType: [''],
    ListDoc: this.fb.array([]),
    AttrContentObjs: this.fb.array([]),
    CollateralStatus: [''],
    IsRequiredStatus: [''],
    CollateralReceivedDt: [''],
    CollateralReleasedDt: ['']
  })
  inputAddressObjForLegalAddr: InputAddressObj;
  inputAddressObjForLocAddr: InputAddressObj;
  InputLookupProfessionObj: InputLookupObj;
  dealerGrading: string;
  dealerRating: number;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private regexService: RegexService) { this.type = 'Paging'; }

  async ngOnInit() {
    this.customPattern = new Array<CustomPatternObj>();
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.showAllPhn = false;
    this.inputAddressObjForLocAddr = new InputAddressObj();
    this.inputAddressObjForLocAddr.showSubsection = false;
    this.inputAddressObjForLocAddr.showAllPhn = false;
    this.inputAddressObjForLocAddr.inputField.inputLookupObj.isRequired = false;

    this.items = this.AddCollForm.get('items') as FormArray;
    this.SetLookupBpkpCityIssuer();
    this.bindUcLookup()
    this.initAddrObj();
    this.GetMouCustListAddrByMouCustId();
    await this.bindOwnerTypeObj();
    await this.bindCompanyTypeObj();
    await this.getInitPattern();
    this.bindMouData();
    this.bindUcAddToTempData();
    this.tempPagingObj.isReady = true;
    this.GetGS();
    await this.SetManufacturingYearMandatory();
    await this.SetMandatoryObj();
    this.validateIfAddExisting();

    this.InputLookupProfessionObj = new InputLookupObj();
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;
  }

  bindUcAddToTempData() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = 'text';
    addCritCustNo.propName = 'CU.CUST_NO';
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  OwnerTypeObj: Array<KeyValueObj> = new Array();
  async bindOwnerTypeObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  async bindCompanyTypeObj(){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).toPromise().then(
      (response) => {
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false) {
    if (OwnerType == CommonConstant.CustTypePersonal) {
      if (IsOwnerTypeChanged) {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      } else {
        await this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.collateralRegistrationObj.OwnerProfessionCode }).toPromise().then(
          (response) => {
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    } else {
      if (IsOwnerTypeChanged) {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: ""
        });
      } else {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode
        });
      }
    }
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

        this.AddCollForm.patchValue({
          MrOwnerTypeCode: this.returnMouCust.MrCustTypeCode,
        });

        if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response: ResThirdPartyRsltHObj) => {
              if (response != null) {
                this.latestReqDtCheckIntegrator = response.ReqDt;
                this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
              }
            });
        }
        let refMasterTypeCode: string = response.MrCustTypeCode == CommonConstant.CustTypeCompany ? CommonConstant.RefMasterTypeCodeCustCompanyRelationship : CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
        this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: refMasterTypeCode }).subscribe(
          (response) => {
            this.OwnerRelationshipObj = response[CommonConstant.ReturnObj];
            if (this.OwnerRelationshipObj.length > 0) {
              this.AddCollForm.patchValue({
                OwnerRelationship: this.OwnerRelationshipObj[0].Key,
              });
            }
          }
        );
      });


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

    this.http.post(URLConstant.GetListAssetTypeByCode, {}).subscribe(
      (response) => {
        this.CollTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          AssetTypeCode: this.CollTypeList[0].Key
        });
        this.onItemChange(this.CollTypeList[0].Key);
      })

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          MrIdType: this.IdTypeList[0].Key
        });
        this.setValidatorPattern(this.IdTypeList[0].Key);
      })

  }

  GetMouCustListAddrByMouCustId() {
    this.http.post(URLConstant.GetMouCustListAddrByMouCustId, { Id: this.MouCustId }).subscribe(
      (response: GenericListObj) => {
        this.listMouCustAddrObj = response.ReturnObject;
      }
    )
  }

  GetProfession(event) {
    this.AddCollForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  async GetProfessionName(professionCode: string) {
    await this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).toPromise().then(
      (response) => {
        this.CustPersonalJobDataObj.MrProfessionName = response['ProfessionName'];
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  CollateralPortionTypeChange() {
    if (this.AddCollForm.controls.CollateralPortionType.value == CommonConstant.PaymentTypeAmt) {
      this.AddCollForm.controls["CollateralPortionAmt"].enable();
      this.AddCollForm.controls["CollateralPrcnt"].disable();
      let collPriceAmt: number = this.AddCollForm.get("CollateralValueAmt").value;
      let maxCollPriceAmt: number = collPriceAmt * this.maxPrcnt / 100;
      this.AddCollForm.controls["CollateralPortionAmt"].setValidators([Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(maxCollPriceAmt)]);
      this.AddCollForm.controls["CollateralPortionAmt"].updateValueAndValidity();
    }
    else {
      this.AddCollForm.controls["CollateralPrcnt"].enable();
      this.AddCollForm.controls["CollateralPortionAmt"].disable();
      this.AddCollForm.controls["CollateralPrcnt"].setValidators([Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)]);
      this.AddCollForm.controls["CollateralPrcnt"].updateValueAndValidity();
    }
  }

  async CopyUserForSelfOwner() {
    if (this.AddCollForm.controls.SelfOwner.value) {
      await this.http.post(URLConstant.GetMouCustByMouCustId, { Id: this.MouCustId }).toPromise().then(
        async (response) => {
          let CustObj = response["MouCustObj"];
          let CustAddrObj = response["MouCustAddrLegalObj"];
          this.CustPersonalObj = response["MouCustPersonalObj"];
          this.CustPersonalJobDataObj = response["MouCustPersonalJobDataObj"];
          this.CustCompanyObj = response["MouCustCompanyObj"];

          this.AddCollForm.patchValue({
            OwnerName: CustObj.CustName,
            OwnerRelationship: CommonConstant.SelfCustomer,
            MrIdType: CustObj.MrIdTypeCode,
            OwnerIdNo: CustObj.IdNo,
            OwnerProfessionCode: typeof(response['MouCustPersonalJobDataObj']) != 'undefined' ? this.CustPersonalJobDataObj.MrProfessionCode : this.CustCompanyObj.MrCompanyTypeCode,
            OwnerMobilePhnNo: typeof (response['MouCustPersonalObj']) != 'undefined' ? this.CustPersonalObj.MobilePhnNo1 : '',
            MrOwnerTypeCode: CustObj.MrCustTypeCode
          })

          this.inputFieldLegalObj.inputLookupObj.nameSelect = CustAddrObj.Zipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: CustAddrObj.Zipcode };
          this.inputAddressObjForLegalAddr.default = CustAddrObj;
          this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;

          this.InputLookupProfessionObj.nameSelect = "";
          this.InputLookupProfessionObj.jsonSelect = "";

          if(typeof(response['MouCustPersonalJobDataObj']) != 'undefined'){
            await this.GetProfessionName(this.CustPersonalJobDataObj.MrProfessionCode);
            this.InputLookupProfessionObj.nameSelect = this.CustPersonalJobDataObj.MrProfessionName;
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.CustPersonalJobDataObj.MrProfessionName };
          }
        }
      )
    }
    this.checkSelfOwnerColl();
  }

  isSelfCust: boolean = false;
  checkSelfOwnerColl() {
    if (this.AddCollForm.controls.SelfOwner.value) {
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.OwnerRelationship.disable();
      this.AddCollForm.controls.OwnerMobilePhnNo.disable();
      this.AddCollForm.controls.MrIdType.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.legalAddr.disable();
      this.isSelfCust = true
      this.InputLookupProfessionObj.isDisable = true;
      this.AddCollForm.controls.OwnerProfessionCode.disable();
      this.AddCollForm.controls.MrOwnerTypeCode.disable();
      return;
    }
    this.InputLookupProfessionObj.isDisable = false;
    this.AddCollForm.controls.OwnerName.enable();
    this.AddCollForm.controls.OwnerRelationship.enable();
    this.AddCollForm.controls.OwnerMobilePhnNo.enable();
    this.AddCollForm.controls.MrIdType.enable();
    this.AddCollForm.controls.OwnerIdNo.enable();
    this.AddCollForm.controls.legalAddr.enable();
    this.AddCollForm.controls.OwnerProfessionCode.enable();
    this.AddCollForm.controls.MrOwnerTypeCode.enable();
    this.isSelfCust = false
  }

  UpdateValueCollateralPortionAmt() {
    let CollateralPortionAmt = this.AddCollForm.controls.CollateralValueAmt.value * this.AddCollForm.controls.CollateralPrcnt.value / 100;
    if (this.AddCollForm.controls.CollateralPrcnt.value > 100) {
      this.toastr.warningMessage("Collateral Percentage exceeded 100 !");
      this.AddCollForm.patchValue({
        CollateralPortionAmt: 0,
        CollateralPrcnt: 0
      });
      this.AddCollForm.controls.MaxCollPrcnt.setValidators([Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)]);
      this.AddCollForm.controls.MaxCollPrcnt.updateValueAndValidity();
    }
    else {
      this.AddCollForm.patchValue({
        CollateralPortionAmt: CollateralPortionAmt
      });
      this.AddCollForm.controls.MaxCollPrcnt.setValidators([Validators.required, Validators.min(this.AddCollForm.controls.CollateralPrcnt.value), Validators.max(this.maxPrcnt)])
      this.AddCollForm.controls.MaxCollPrcnt.updateValueAndValidity();
    }
  }

  UpdateValueCollateralPrcnt() {
    let CollateralPrcnt = this.AddCollForm.controls.CollateralPortionAmt.value / this.AddCollForm.controls.CollateralValueAmt.value * 100;
    if (this.AddCollForm.controls.CollateralPortionAmt.value > this.AddCollForm.controls.CollateralValueAmt.value) {
      this.toastr.warningMessage("Collateral Portion Amount exceeded Collateral Value Amount !");
      this.AddCollForm.patchValue({
        CollateralPortionAmt: 0,
        CollateralPrcnt: 0
      });
      this.AddCollForm.controls.MaxCollPrcnt.setValidators([Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)]);
      this.AddCollForm.controls.MaxCollPrcnt.updateValueAndValidity();
    }
    else {
      this.AddCollForm.patchValue({
        CollateralPrcnt: CollateralPrcnt
      });
      this.AddCollForm.controls.MaxCollPrcnt.setValidators([Validators.required, Validators.min(this.AddCollForm.controls.CollateralPrcnt.value), Validators.max(this.maxPrcnt)])
      this.AddCollForm.controls.MaxCollPrcnt.updateValueAndValidity();
    }
  }

  bindUcLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.isReady = true;
  }

  bindUcLookupExisting() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.urlEnviPaging = environment.losUrl + "/v1";
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
      let arrMemberList = new Array();
      for (let index = 0; index < this.listCollateralData.length; index++) {
        arrMemberList.push(this.listCollateralData[index].CollateralNo)
      }

      if (arrMemberList.length != 0) {
        let addCritListCollateralNo = new CriteriaObj();
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

      const addMouActive = new CriteriaObj();
      addMouActive.DataType = 'text';
      addMouActive.propName = 'MC.MOU_STAT';
      addMouActive.restriction = AdInsConstant.RestrictionEq;
      addMouActive.value = CommonConstant.STAT_CODE_ACT;
      this.criteriaList.push(addMouActive);
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
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.showAllPhn = false;
    this.inputAddressObjForLocAddr = new InputAddressObj();
    this.inputAddressObjForLocAddr.showSubsection = false;
    this.inputAddressObjForLocAddr.showAllPhn = false;
    this.inputAddressObjForLocAddr.inputField.inputLookupObj.isRequired = false;

    this.AddCollForm.patchValue({
      MouCustCollateralId: 0,
      MouCustCollateralRegistrationId: 0,
      CopyFromLegal: '',
      CopyToOwnerLocation: '',
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
    let pattern: string = '';
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        let result = this.resultPattern.find(x => x.Key == idTypeValue)
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

  MouCustCollateralId: number = 0;
  isAddExistingOK: boolean = true;
  async open(pageType) {
    this.isAddExistingOK = true;
    if (pageType == 'AddExisting') {
      await this.http.post(URLConstant.GetListMouCustCollateralActiveByCustNo, { TrxNo: this.custNo }).toPromise().then(
        (response) => {
          if(response["ReturnObject"].length < 1){
            this.isAddExistingOK = false;
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
    if(!this.isAddExistingOK){
      this.toastr.warningMessage(ExceptionConstant.NO_EXISTING_COLL);
      return;
    }

    this.maxPrcnt = 100;
    this.ResetForm();
    this.MouCustCollateralId = 0;
    await this.GenerateCollateralAttr(false, 0);

    this.AddCollForm.controls.MrCollateralConditionCode.disable();
    this.AddCollForm.controls.CollateralReleasedDt.disable();
    this.AddCollForm.controls.CollateralReceivedDt.disable();
    this.type = pageType;
    if (pageType == 'AddExisting') {
      this.bindUcLookupExisting();
      this.updateUcLookup(this.CollTypeList[0].Key, true, pageType);
    } else {
      this.bindUcLookup();
      this.updateUcLookup(this.CollTypeList[0].Key, true, pageType);
      this.AddCollForm.controls.CopyFromLegal.enable();
      this.AddCollForm.controls.CopyToOwnerLocation.enable();
      this.AddCollForm.controls.AssetTypeCode.enable();
      this.AddCollForm.controls.CollateralValueAmt.enable();
      this.AddCollForm.controls.FullAssetCode.enable();
      this.AddCollForm.controls.AssetCategoryCode.enable();
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.OwnerRelationship.enable();
      this.AddCollForm.controls.TaxIssueDt.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.MrIdType.enable();
      this.AddCollForm.controls.Notes.enable();
      this.AddCollForm.controls.ManufacturingYear.enable();

    }
    this.getDealerGrading();
    this.AddCollForm.updateValueAndValidity();
  }

  isAttrReady: boolean = false;
  async refreshAttr() {
    this.GenerateCollateralAttr(true, this.MouCustCollateralId);
  }

  readonly identifierAttr: string = "AttrContentObjs";
  ListAttrObjs: Array<RefAttrGenerateObj> = new Array();
  IsDisable: boolean = false;
  async GenerateCollateralAttr(isRefresh: boolean = false, MouCustCollId: number = 0, isCopy: boolean = false) {
    this.isAttrReady = false;
    let GenObj = {
      MouCustCollateralId: MouCustCollId,
      AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value,
      IsRefresh: isRefresh
    };
    this.attrSettingObj.ReqGetListAttrObj = GenObj;
    this.attrSettingObj.Title = "Collateral Attribute";
    this.attrSettingObj.UrlGetListAttr = URLConstant.GenerateMouCollateralAttrForUcAttr;
    this.attrSettingObj.IsDisable = isCopy;
    setTimeout(() => this.isAttrReady = true, 10)
  }

  getDealerGrading() {
    this.http.post(URLConstantX.GetDealerGradingX, { Id: this.MouCustId }).subscribe(
      (response) => {
        this.dealerGrading = response['DealerGrading'];
        this.dealerRating = response['DealerRating'];
      });
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
    this.inputFieldLocationObj.inputLookupObj.isRequired = false;
  }

  async getLookupCollateralTypeResponse(e) {
    if (this.type == "AddEdit") {
      this.AddCollForm.patchValue({
        FullAssetCode: e.FullAssetCode,
        FullAssetName: e.FullAssetName,
        AssetCategoryCode: e.AssetCategoryCode
      });
    } else {
      await this.http.post(URLConstant.GetMouCustCollateralDataExistingByCollateralNo, { TrxNo: e.CollateralNo }).toPromise().then(
        async (response) => {
          this.collateralObj = response['MouCustCollateral'];
          this.collateralRegistrationObj = response['MouCustCollateralRegistration'];
          this.setMouCustCollateralExistingDoc(this.collateralObj.MouCustCollateralId);

          this.maxPrcnt = this.collateralObj.MaxCollPrcnt - e.SumCollateralPrcnt;

          this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
          this.inputLookupObj.jsonSelect = this.collateralObj;
          this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.collateralObj.AssetTypeCode }).subscribe(
            (response: GenericListObj) => {
              while (this.items.length) {
                this.items.removeAt(0);
              }
              this.SerialNoList = response.ReturnObject;
              for (let i = 0; i < this.SerialNoList["length"]; i++) {
                let eachDataDetail = this.fb.group({
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
            MaxCollPrcnt: this.collateralObj.MaxCollPrcnt,
            CollateralNotes: this.collateralObj.CollateralNotes,
            ManufacturingYear: this.collateralObj.ManufacturingYear,
            RowVersionCollateral: this.collateralObj.RowVersion,
            MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
            OwnerName: this.collateralRegistrationObj.OwnerName,
            OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
            MrIdType: this.collateralRegistrationObj.MrIdTypeCode,
            SelfOwner: this.collateralRegistrationObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer,
            OwnerRelationship: this.collateralRegistrationObj.MrOwnerRelationshipCode,
            Notes: this.collateralRegistrationObj.Notes,
            TaxCityIssuer: this.collateralObj.TaxCityIssuer,
            OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode,
            OwnerMobilePhnNo: this.collateralRegistrationObj.OwnerMobilePhnNo,
            RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion,
            MrOwnerTypeCode: this.collateralRegistrationObj.MrOwnerTypeCode
          });

          this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: this.collateralObj.TaxCityIssuer };
          this.InputLookupCityIssuerObj.nameSelect = this.collateralObj.TaxCityIssuer;

          if (this.collateralObj.AssetTaxDate) {
            this.AddCollForm.patchValue({
              TaxIssueDt: formatDate(this.collateralObj.AssetTaxDate, 'yyyy-MM-dd', 'en-US')
            });
          }
          this.InputLookupCityIssuerObj.isDisable = true;

          this.CopyUserForSelfOwner();
          this.OwnerTypeChange(this.collateralRegistrationObj.MrOwnerTypeCode);

          await this.GenerateCollateralAttr(true, this.collateralObj["MouCustCollateralId"], true);
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

          this.CollateralPortionTypeChange();

          this.AddCollForm.controls.SelfOwner.disable();
          this.AddCollForm.controls.CopyFromLegal.disable();
          this.AddCollForm.controls.CopyToOwnerLocation.disable();
          this.AddCollForm.controls.CollateralValueAmt.disable();
          this.AddCollForm.controls.MaxCollPrcnt.disable();
          this.AddCollForm.controls.FullAssetCode.disable();
          this.AddCollForm.controls.AssetCategoryCode.disable();
          this.AddCollForm.controls.OwnerName.disable();
          this.AddCollForm.controls.OwnerRelationship.disable();
          this.AddCollForm.controls.OwnerIdNo.disable();
          this.AddCollForm.controls.MrIdType.disable();
          this.AddCollForm.controls.Notes.disable();
          this.AddCollForm.controls.ManufacturingYear.disable();
          this.AddCollForm.controls.TaxIssueDt.disable();
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

          this.SetProfessionName(this.collateralRegistrationObj.OwnerProfessionCode);
          this.InputLookupProfessionObj.isDisable = true;
          this.InputLookupProfessionObj.isReady = true;
          this.UpdateValueCollateralPortionAmt();
          await this.CheckManufacturingYearMandatory();
          await this.CheckMandatoryObj();
        })
    }
  }

  async onItemChange(value, UserChange: boolean = false) {
    this.getRefAssetDocList(value);
    await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: value }).toPromise().then(
      (response: GenericListObj) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }
        this.SerialNoList = response.ReturnObject;
        for (let i = 0; i < this.SerialNoList["length"]; i++) {
          let eachDataDetail = this.fb.group({
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
    await this.GenerateCollateralAttr(false, this.MouCustCollateralId);
    await this.CheckManufacturingYearMandatory();
    await this.CheckMandatoryObj();
  }

  async SaveForm() {
    console.log(this.AddCollForm.invalid);
    this.setCollateralObjForSave();
    this.listMouCustCollateralDocObj.MouCustCollateralDocObj = new Array();

    for (let i = 0; i < this.AddCollForm.value.ListDoc["length"]; i++) {
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
    let custCollObj = {
      MouCustCollateral: this.mouCustCollateralObj,
      MouCustCollateralRegistration: this.mouCustCollateralRegistrationObj,
      ListMouCustCollateralDoc: this.listMouCustCollateralDocObj.MouCustCollateralDocObj,
      ListMouCustCollaterals: this.SetCollateralAttr(),
      CollateralReceivedDt: this.AddCollForm.controls.CollateralReceivedDt.value,
      CollateralReleasedDt: this.AddCollForm.controls.CollateralReleasedDt.value
    }

    let mouCustObjForAddTrxData = new MouCustObjForAddTrxData();
    mouCustObjForAddTrxData.MouCustObj.MouCustId = this.MouCustId;

    await this.submitAddEditMouCustCollateralData(custCollObj);
    this.AddCollForm.reset();
    this.ClearForm();
    this.collateralObj = null;
    this.type = 'Paging';
  }

  async submitAddEditMouCustCollateralData(custCollObj) {
    if (this.collateralObj == null) {
      await this.http.post(URLConstantX.AddMouCustCollateralDataX, custCollObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
        });
    }
    else {
      await this.http.post(URLConstantX.EditMouCustCollateralDataX, custCollObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
        });
    }
  }

  hitIntegrator(mouCustObjForAddTrxData: MouCustObjForAddTrxData) {
    this.http.post(URLConstant.CheckMouCustCollateralIntegrator, mouCustObjForAddTrxData).subscribe(
      (response) => {
      }
    );
  }

  setCollateralObjForSave() {
    this.mouCustCollateralObj = new MouCustCollateralObj();
    this.mouCustCollateralRegistrationObj = new MouCustCollateralRegistrationObj();

    if (this.collateralObj) {
      this.mouCustCollateralObj = this.collateralObj;
    }
    if (this.collateralRegistrationObj) {
      this.mouCustCollateralRegistrationObj = this.collateralRegistrationObj;
    }
    this.mouCustCollateralObj.MouCustId = this.MouCustId;
    this.mouCustCollateralObj.AssetTypeCode = this.AddCollForm.controls.AssetTypeCode.value;
    this.mouCustCollateralObj.FullAssetCode = this.AddCollForm.controls.FullAssetCode.value;
    this.mouCustCollateralObj.FullAssetName = this.AddCollForm.controls.FullAssetName.value.value;
    this.mouCustCollateralObj.AssetCategoryCode = this.AddCollForm.controls.AssetCategoryCode.value;
    this.mouCustCollateralObj.TaxCityIssuer = this.AddCollForm.controls.TaxCityIssuer.value;
    this.mouCustCollateralObj.AssetTaxDate = this.AddCollForm.controls.TaxIssueDt.value;
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
    this.mouCustCollateralObj.MaxCollPrcnt = this.AddCollForm.controls.MaxCollPrcnt.value;
    this.mouCustCollateralObj.CollateralNotes = this.AddCollForm.controls.Notes.value;
    this.mouCustCollateralObj.ManufacturingYear = this.AddCollForm.controls.ManufacturingYear.value;

    this.mouCustCollateralRegistrationObj.OwnerName = this.AddCollForm.controls.OwnerName.value;
    this.mouCustCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls.OwnerIdNo.value;
    this.mouCustCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls.MrIdType.value;
    this.mouCustCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.mouCustCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.mouCustCollateralRegistrationObj.Notes = this.AddCollForm.controls.Notes.value;
    this.mouCustCollateralRegistrationObj.OwnerProfessionCode = this.AddCollForm.controls.OwnerProfessionCode.value;
    this.mouCustCollateralRegistrationObj.MrOwnerTypeCode = this.AddCollForm.controls.MrOwnerTypeCode.value;
    this.mouCustCollateralRegistrationObj.OwnerMobilePhnNo = this.AddCollForm.controls.OwnerMobilePhnNo.value;

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

  SetCollateralAttr(): Array<MouCustCollateralAttrObj> {
    let tempList: Array<MouCustCollateralAttrObj> = new Array();
    let tempFormArray = this.AddCollForm.get(this.identifierAttr) as FormArray;
    for (let index = 0; index < tempFormArray.length; index++) {
      const element = tempFormArray.get(index.toString()).value;
      let tempObj: MouCustCollateralAttrObj = new MouCustCollateralAttrObj();
      tempObj.CollateralAttrCode = element["AttrCode"];
      tempObj.CollateralAttrName = element["AttrName"];
      tempObj.AttrValue = element["AttrValue"] ? element["AttrValue"] : "";
      tempList.push(tempObj);
    }
    return tempList;
  }

  copyToLocation() {
    let tempSelectedCopyAddr = this.AddCollForm.get("CopyFromLegal").value;
    let tempAddr: MouCustAddrObj = this.listMouCustAddrObj.find(x => x.MrCustAddrTypeCode == tempSelectedCopyAddr);
    if (tempAddr == null) return;
    this.locationAddrObj.Addr = tempAddr.Addr;
    this.locationAddrObj.AreaCode1 = tempAddr.AreaCode1;
    this.locationAddrObj.AreaCode2 = tempAddr.AreaCode2;
    this.locationAddrObj.AreaCode3 = tempAddr.AreaCode3;
    this.locationAddrObj.AreaCode4 = tempAddr.AreaCode4;
    this.locationAddrObj.City = tempAddr.City;
    this.locationAddrObj.Fax = tempAddr.Fax;
    this.locationAddrObj.FaxArea = tempAddr.FaxArea;
    this.locationAddrObj.Phn1 = tempAddr.Phn1;
    this.locationAddrObj.Phn2 = tempAddr.Phn2;
    this.locationAddrObj.PhnArea1 = tempAddr.PhnArea1;
    this.locationAddrObj.PhnArea2 = tempAddr.PhnArea2;
    this.locationAddrObj.PhnExt1 = tempAddr.PhnExt1;
    this.locationAddrObj.PhnExt2 = tempAddr.PhnExt2;
    this.locationAddrObj.SubZipcode = tempAddr.SubZipcode;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = tempAddr.Zipcode;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: tempAddr.Zipcode };

    this.inputAddressObjForLocAddr.default = this.locationAddrObj;
    this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;
  }

  copyToLocationOwner() {
    let tempSelectedCopyAddr = this.AddCollForm.get("CopyToOwnerLocation").value;
    let tempAddr: MouCustAddrObj = this.listMouCustAddrObj.find(x => x.MrCustAddrTypeCode == tempSelectedCopyAddr);
    if (tempAddr == null) return;
    this.legalAddrObj.Addr = tempAddr.Addr;
    this.legalAddrObj.AreaCode1 = tempAddr.AreaCode1;
    this.legalAddrObj.AreaCode2 = tempAddr.AreaCode2;
    this.legalAddrObj.AreaCode3 = tempAddr.AreaCode3;
    this.legalAddrObj.AreaCode4 = tempAddr.AreaCode4;
    this.legalAddrObj.City = tempAddr.City;
    this.legalAddrObj.Fax = tempAddr.Fax;
    this.legalAddrObj.FaxArea = tempAddr.FaxArea;
    this.legalAddrObj.Phn1 = tempAddr.Phn1;
    this.legalAddrObj.Phn2 = tempAddr.Phn2;
    this.legalAddrObj.PhnArea1 = tempAddr.PhnArea1;
    this.legalAddrObj.PhnArea2 = tempAddr.PhnArea2;
    this.legalAddrObj.PhnExt1 = tempAddr.PhnExt1;
    this.legalAddrObj.PhnExt2 = tempAddr.PhnExt2;
    this.legalAddrObj.SubZipcode = tempAddr.SubZipcode;

    this.inputFieldLegalObj.inputLookupObj.nameSelect = tempAddr.Zipcode;
    this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: tempAddr.Zipcode };

    this.inputAddressObjForLegalAddr.default = this.legalAddrObj;
    this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;
  }

  async editData(MouCustCollId: number, isAddEdit: boolean) {
    this.MouCustCollateralId = MouCustCollId;
    this.getDealerGrading();
    if (isAddEdit) {
      this.type = "AddEdit";
      this.AddCollForm.controls.CollateralReleasedDt.disable();
      this.AddCollForm.controls.CollateralReceivedDt.disable();
    } else {
      this.isEdit = true;
      this.type = "AddExisting";
      this.inputLookupObj.isReadonly = true;
      this.inputLookupObj.isDisable = true;
      this.AddCollForm.controls.SelfOwner.disable();
      this.AddCollForm.controls.AssetTypeCode.disable();
      this.AddCollForm.controls.CopyFromLegal.disable();
      this.AddCollForm.controls.CopyToOwnerLocation.disable();
      this.AddCollForm.controls.CollateralValueAmt.disable();
      this.AddCollForm.controls.MaxCollPrcnt.disable();
      this.AddCollForm.controls.FullAssetCode.disable();
      this.AddCollForm.controls.AssetCategoryCode.disable();
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.OwnerRelationship.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.MrIdType.disable();
      this.AddCollForm.controls.Notes.disable();
      this.AddCollForm.controls.OwnerMobilePhnNo.disable();
      this.AddCollForm.controls.ManufacturingYear.disable();
      this.AddCollForm.controls.TaxIssueDt.disable();
      this.InputLookupCityIssuerObj.isDisable = true;
      this.AddCollForm.controls.CollateralReleasedDt.disable();
      this.AddCollForm.controls.CollateralReceivedDt.disable();
      this.inputAddressObjForLegalAddr.isReadonly = true;
      this.inputAddressObjForLocAddr.isReadonly = true;
    }
    const obj = { Id: MouCustCollId };
    await this.http.post(URLConstant.GetMouCustCollateralDataForUpdateByMouCustCollateralId, obj).subscribe(
      async (response) => {

        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];
        this.maxPrcnt = 100 - this.collateralObj.RemainingCollateralPrcnt;
        this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
        this.inputLookupObj.jsonSelect = this.collateralObj;
        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.collateralObj.AssetTypeCode }).subscribe(
          (response: GenericListObj) => {
            while (this.items.length) {
              this.items.removeAt(0);
            }
            this.SerialNoList = response.ReturnObject;
            for (let i = 0; i < this.SerialNoList["length"]; i++) {
              let eachDataDetail = this.fb.group({
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

        if(isAddEdit) this.getRefAssetDocList(this.collateralObj.AssetTypeCode);
        else this.setMouCustCollateralExistingDoc(this.collateralObj.MouCustCollateralId);

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
          MaxCollPrcnt: this.collateralObj.MaxCollPrcnt,
          CollateralNotes: this.collateralObj.CollateralNotes,
          ManufacturingYear: this.collateralObj.ManufacturingYear,
          TaxCityIssuer: this.collateralObj.TaxCityIssuer,
          RowVersionCollateral: this.collateralObj.RowVersion,

          MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
          OwnerName: this.collateralRegistrationObj.OwnerName,
          OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
          MrIdType: this.collateralRegistrationObj.MrIdTypeCode,
          OwnerRelationship: this.collateralRegistrationObj.MrOwnerRelationshipCode,
          SelfOwner: this.collateralRegistrationObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer,
          Notes: this.collateralRegistrationObj.Notes,
          OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode,
          OwnerMobilePhnNo: this.collateralRegistrationObj.OwnerMobilePhnNo,
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
        });

        if (this.collateralObj.AssetTaxDate) {
          this.AddCollForm.patchValue({
            TaxIssueDt: formatDate(this.collateralObj.AssetTaxDate, 'yyyy-MM-dd', 'en-US')
          });
        }

        this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: this.collateralObj.TaxCityIssuer };
        this.InputLookupCityIssuerObj.nameSelect = this.collateralObj.TaxCityIssuer;

        this.AddCollForm.controls.MaxCollPrcnt.setValidators([Validators.required, Validators.min(this.AddCollForm.controls.CollateralPrcnt.value), Validators.max(this.maxPrcnt)])
        this.AddCollForm.controls.MaxCollPrcnt.updateValueAndValidity();

        this.CollateralPortionTypeChange();
        await this.GenerateCollateralAttr(false, MouCustCollId, !isAddEdit);

        this.checkSelfOwnerColl();
        this.setValidatorPattern(this.collateralRegistrationObj.MrIdTypeCode);

        this.AddCollForm.controls.MrCollateralConditionCode.disable();
        this.AddCollForm.updateValueAndValidity();

        this.SetProfessionName(this.collateralRegistrationObj.OwnerProfessionCode);

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
      }
    );

    this.http.post<MouCustCollateralStatXObj>(URLConstantX.GetMouCustCollateralStatXByMouCustCollateralIdX, obj).subscribe(
      (response) => {
        let collRcvDt = "";
        let collRlsDt = "";
        if (response.CollateralReceivedDt != null) {
          collRcvDt = formatDate(response.CollateralReceivedDt, 'yyyy-MM-dd', 'en-US')
        }
        if (response.CollateralReleasedDt != null) {
          collRlsDt = formatDate(response.CollateralReleasedDt, 'yyyy-MM-dd', 'en-US')
        }
        this.AddCollForm.patchValue({
          CollateralReceivedDt: collRcvDt,
          CollateralReleasedDt: collRlsDt
        });
      }
    );
  }

  async SetProfessionName(professionCode: string) {
    await this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).toPromise().then(
      (response) => {
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = response;
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
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
    this.SetLookupBpkpCityIssuer();
    this.AddCollForm = this.fb.group({
      MouCustCollateralId: [''],
      MouCustCollateralRegistrationId: [''],
      CopyFromLegal: [''],
      CopyToOwnerLocation: [''],
      AssetTypeCode: ['', [Validators.required]],
      CollateralValueAmt: [0, [Validators.required]],
      CollateralPrcnt: [0, [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(100)]],
      MaxCollPrcnt: [100, [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)]],
      FullAssetCode: [''],
      AssetCategoryCode: [''],
      MrOwnerTypeCode: [''],
      OwnerName: ['', [Validators.required]],
      OwnerRelationship: ['', [Validators.required]],
      OwnerIdNo: ['', [Validators.required]],
      MrIdType: ['', [Validators.required]],
      Notes: [''],
      OwnerProfessionCode: [''],
      OwnerMobilePhnNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      SerialNo1: [''],
      SerialNo2: [''],
      SerialNo3: [''],
      SerialNo4: [''],
      SerialNo5: [''],
      SelfOwner: [false],
      TaxCityIssuer: [''],
      TaxIssueDt: [''],
      RowVersionCollateral: [''],
      RowVersionCollateralRegistration: [''],
      items: this.fb.array([]),
      MrCollateralConditionCode: [''],
      ManufacturingYear: ['', [Validators.pattern("^[0-9]+$")]],
      CollateralPortionAmt: [0],
      CollateralPortionType: [''],
      ListDoc: this.fb.array([]),
      AttrContentObjs: this.fb.array([]),
      CollateralStatus: [''],
      IsRequiredStatus: [''],
      CollateralReceivedDt: [''],
      CollateralReleasedDt: ['']
    })
    this.AddCollForm.updateValueAndValidity();
    this.setValidatorBpkb();

    this.InputLookupCityIssuerObj.nameSelect = '';
    this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: '' }
    this.inputFieldLocationObj.inputLookupObj.nameSelect = '';
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: '' }
    this.inputFieldLegalObj.inputLookupObj.nameSelect = '';
    this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: '' }
    this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;
    this.InputLookupProfessionObj.nameSelect = '';
    this.InputLookupProfessionObj.jsonSelect = { ProfessionName: '' };
    this.InputLookupProfessionObj.isDisable = false;
    this.isSelfCust = false;
    this.collateralObj = null;
    this.isAttrReady = false;

    this.items = this.AddCollForm.get('items') as FormArray;
    this.bindUcLookup()
    this.initAddrObj();
    this.bindMouData();
  }

  InputLookupCityIssuerObj: InputLookupObj = new InputLookupObj();
  SetLookupBpkpCityIssuer() {
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
  }
  setValidatorBpkb() {
    if(this.returnMouCust.MrMouTypeCode == 'GENERAL')
    {
      this.AddCollForm.controls.TaxCityIssuer.setValidators(Validators.required);
      this.AddCollForm.controls.TaxIssueDt.setValidators(Validators.required);
      this.InputLookupCityIssuerObj.isRequired = true;
    }
    else
    {
      this.AddCollForm.controls.TaxCityIssuer.clearValidators();
      this.AddCollForm.controls.TaxIssueDt.clearValidators();
      this.InputLookupCityIssuerObj.isRequired = false;
    }
    this.AddCollForm.controls.TaxCityIssuer.updateValueAndValidity();
    this.AddCollForm.controls.TaxIssueDt.updateValueAndValidity();
  }
  SetBpkbCity(event) {
    this.AddCollForm.patchValue({
      TaxCityIssuer: event.DistrictCode,
    });
  }
  SaveExistingCollateral() {
    if (this.isEdit) {
      this.mouCustCollateralObj = this.collateralObj;
      this.mouCustCollateralRegistrationObj = this.collateralRegistrationObj;

      this.listMouCustCollateralDocObj.MouCustCollateralDocObj = new Array();
      for (let i = 0; i < this.AddCollForm.value.ListDoc["length"]; i++) {
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

      const custCollObj = {
        MouCustCollateral: this.mouCustCollateralObj,
        MouCustCollateralRegistration: this.mouCustCollateralRegistrationObj,
        ListMouCustCollaterals: this.SetCollateralAttr(),
        CollateralReceivedDt: this.AddCollForm.controls.CollateralReceivedDt.value,
        CollateralReleasedDt: this.AddCollForm.controls.CollateralReleasedDt.value
      }
      this.mouCustCollateralObj.CollateralPrcnt = this.AddCollForm.controls.CollateralPrcnt.value;
      this.mouCustCollateralObj.CollateralPortionAmt = this.AddCollForm.controls.CollateralPortionAmt.value;
      this.http.post(URLConstantX.EditMouCustCollateralDataX, custCollObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.type = 'Paging';
          this.collateralObj = null;
          this.isEdit = false;
          this.ClearForm();
        });
    } else {
      this.mouCustCollateralObj = new MouCustCollateralObj();
      this.mouCustCollateralObj.MouCustId = this.MouCustId;
      this.mouCustCollateralObj.MouCustCollateralId = this.collateralObj.MouCustCollateralId;
      this.mouCustCollateralObj.CollateralNo = this.collateralObj.CollateralNo;
      this.mouCustCollateralObj.CollateralPrcnt = this.AddCollForm.controls.CollateralPrcnt.value;
      this.mouCustCollateralObj.CollateralPortionAmt = this.AddCollForm.controls.CollateralPortionAmt.value;
      this.mouCustCollateralObj.OwnerMobilePhnNo = this.AddCollForm.controls.OwnerMobilePhnNo.value;

      this.http.post(URLConstantX.AddExistingCustCollateralDataX, this.mouCustCollateralObj).subscribe(
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
      let custCollObj = { Id: MouCustCollId };
      this.http.post(URLConstantX.DeleteMouCustCollateralX, custCollObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.bindMouData();
        });
    }
  }

  next() {
    let sumCollateralValue = 0;
    let mouCustObjForAddTrxData = new MouCustObjForAddTrxData();
    mouCustObjForAddTrxData.MouCustObj.MouCustId = this.MouCustId;
    for (let i = 0; i < this.listCollateralData.length; i++) {
      if (this.listCollateralData[i].CollateralPortionAmt != null) {
        sumCollateralValue += this.listCollateralData[i].CollateralPortionAmt;
      }
    }

    if (this.mouCustObj.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOAMT
      && this.mouCustObj.MrMouTypeCode == CommonConstant.MOU_TYPE_GENERAL) {
      if (sumCollateralValue < this.returnMouCust.PlafondAmt) {
        this.toastr.warningMessage(ExceptionConstant.COLL_VALUE_CANNOT_LESS_THAN_PLAFOND_AMT);
        return;
      }
    }
    
    if (this.mouCustObj.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOCLLTR) {
      if(this.listCollateralData.length == 0){
        this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_COLLATERAL_DATA);
        return;
      }
      
    }
    // if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0" && this.IsSvcExist) {
    //   if (!this.IsCalledIntegrator) {
    //     if (confirm("Continue without integrator ?")) {
    //       this.UpdatePlafondAmt(sumCollateralValue);
    //     }
    //   } else {
    //     this.http.post(URLConstant.CheckMouCustCollateralIntegrator, mouCustObjForAddTrxData).toPromise().then(
    //       (response) => {
    //         this.UpdatePlafondAmt(sumCollateralValue);
    //         this.toastr.successMessage("Success !");
    //       }
    //     );
    //   }
    // }
    // else {
    //   this.UpdatePlafondAmt(sumCollateralValue);
    // }
    this.UpdatePlafondAmt(sumCollateralValue);
  }

  UpdatePlafondAmt(sumCollateralValue: number) {
    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        let mouCustObjForSave = response;
        mouCustObjForSave.PlafondCollateralAmt = sumCollateralValue;
        this.http.post(URLConstant.UpdatePlafondCollateralAmtMouCust, mouCustObjForSave).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.bindMouData();
            this.ResponseMouAddColl.emit({ StatusCode: "200" });
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

        let gsNeedCheckBySystem = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        let gsUseDigitalization = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

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
          this.getDigitalizationSvcType();
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
    this.http.post(URLConstant.GetRefAssetDocList, { Code: AssetTypeCode }).subscribe(
      (response) => {
        if (response[CommonConstant.ReturnObj].length > 0) {
          let ListDoc = this.AddCollForm.get('ListDoc') as FormArray;

          if (ListDoc.length > 0) {
            while (ListDoc.length !== 0) {
              ListDoc.removeAt(0)
            }
          }

          for (let i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            let assetDocumentDetail = this.fb.group({
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
        if (this.type == 'AddEdit') {
          this.setMouCustCollateralDoc(this.MouCustCollateralId);
        }
      });
  }

  setMouCustCollateralDoc(MouCustCollateralId: number = 0) {
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: MouCustCollateralId }).subscribe(
      (response) => {
        let MouCustCollateralDocs = response["MouCustCollateralDocs"];
        let tempDocForm = this.AddCollForm.get("ListDoc");
        let tempListDoc = tempDocForm.value;
        if (MouCustCollateralDocs["length"] > 0) {
          for (let i = 0; i < MouCustCollateralDocs.length; i++) {
            const tempMouCustCollateralDoc = MouCustCollateralDocs[i];
            const findIdx: number = tempListDoc.findIndex(x => x.DocCode == tempMouCustCollateralDoc.DocCode);
            if (findIdx > -1) {
              tempDocForm["controls"][findIdx].patchValue({
                DocNo: tempMouCustCollateralDoc.DocNo,
                DocNotes: tempMouCustCollateralDoc.DocNotes,
                ACDExpiredDt: formatDate(tempMouCustCollateralDoc.ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                IsReceived: tempMouCustCollateralDoc.IsReceived
              });
            }
          }
          //end region
          // for (let i = 0; i < MouCustCollateralDocs.length; i++) {
          //   this.AddCollForm.controls.ListDoc["controls"][i].patchValue({
          //     DocNo: MouCustCollateralDocs[i].DocNo,
          //     DocNotes: MouCustCollateralDocs[i].DocNotes,
          //     ACDExpiredDt: formatDate(MouCustCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
          //     IsReceived: MouCustCollateralDocs[i].IsReceived
          //   })
          // }
        } else {
          if (this.type == 'AddExisting') {
            let listDocExisting = this.AddCollForm.get('ListDoc') as FormArray;
            while (listDocExisting.length !== 0) {
              listDocExisting.removeAt(0);
            }
          }
        }
      });
  }

  setMouCustCollateralExistingDoc(MouCustCollateralId: number = 0) {
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: MouCustCollateralId }).subscribe(
      (response) => {
        let MouCustCollateralDocs = response["MouCustCollateralDocs"];
        let tempDocForm = this.AddCollForm.get("ListDoc") as FormArray;
        while (tempDocForm.length !== 0) {
          tempDocForm.removeAt(0);
        }
        if (MouCustCollateralDocs["length"] > 0) {
          for (let i = 0; i < MouCustCollateralDocs.length; i++) {
            const tempMouCustCollateralDoc = MouCustCollateralDocs[i];
            console.log(tempMouCustCollateralDoc);
            let assetDocumentDetail = this.fb.group({
              DocCode: tempMouCustCollateralDoc.DocCode,
              AssetDocName: tempMouCustCollateralDoc.DocName,
              IsValueNeeded: tempMouCustCollateralDoc.IsValueNeeded,
              IsMandatoryNew: tempMouCustCollateralDoc.IsMandatoryNew,
              IsMandatoryUsed: tempMouCustCollateralDoc.IsMandatoryUsed,
              IsReceived: tempMouCustCollateralDoc.IsReceived,
              DocNo: tempMouCustCollateralDoc.DocNo,
              ACDExpiredDt: formatDate(tempMouCustCollateralDoc.ExpiredDt, 'yyyy-MM-dd', 'en-US'),
              DocNotes: tempMouCustCollateralDoc.DocNotes
            }) as FormGroup;
            tempDocForm.push(assetDocumentDetail);
          }
        }
      });
  }

  validateIfAddExisting() {
    let mouCustObj = { MouCustId: this.MouCustId }
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

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapAsset, { TrxNo: "-"}).toPromise().then(
        (response) => {
          refSvcType = response["Result"];
        });

      var svcType = listSvcType.find(x => x == refSvcType);
      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
  }

  async SetManufacturingYearMandatory(){
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GsCodeManufacturingYearMandatoryByCollType }).toPromise().then(
      (result: GeneralSettingObj) => {
        if (result.GsValue) {
          this.listCollTypeMandatoryManufacturingYear  = result.GsValue.split(';');
          console.log(this.listCollTypeMandatoryManufacturingYear);
        }
      }
    );
  }

  async SetMandatoryObj(){
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstantX.GsCodeMandatoryByCollType }).toPromise().then(
      (result: GeneralSettingObj) => {
        if (result.GsValue) {
          this.listCollTypeMandatory  = result.GsValue.split(';');
          console.log(this.listCollTypeMandatory);
        }
      }
    );
  }

  async CheckManufacturingYearMandatory(){
    let temp = this.AddCollForm.controls.AssetTypeCode.value;
    this.isMandatoryManufacturingYear = this.listCollTypeMandatoryManufacturingYear.includes(temp);

    if (this.isMandatoryManufacturingYear) {
      this.AddCollForm.controls.ManufacturingYear.setValidators([Validators.required]);
      this.AddCollForm.controls.ManufacturingYear.updateValueAndValidity();
    }
    else{
      this.AddCollForm.controls.ManufacturingYear.clearValidators();
      this.AddCollForm.controls.ManufacturingYear.updateValueAndValidity();
    }
  }

  async CheckMandatoryObj(){
    let temp = this.AddCollForm.controls.AssetTypeCode.value;
    this.isMandatoryObj = this.listCollTypeMandatory.includes(temp);

    if (this.isMandatoryObj) {
      this.AddCollForm.controls.OwnerName.setValidators([Validators.required]);
      this.AddCollForm.controls.OwnerName.updateValueAndValidity();
      this.AddCollForm.controls.OwnerRelationship.setValidators([Validators.required]);
      this.AddCollForm.controls.OwnerRelationship.updateValueAndValidity();
      this.AddCollForm.controls.MrIdType.setValidators([Validators.required]);
      this.AddCollForm.controls.MrIdType.updateValueAndValidity();
      this.AddCollForm.controls.OwnerIdNo.setValidators([Validators.required]);
      this.AddCollForm.controls.OwnerIdNo.updateValueAndValidity();
      this.AddCollForm.controls.OwnerMobilePhnNo.setValidators([Validators.required]);
      this.AddCollForm.controls.OwnerMobilePhnNo.updateValueAndValidity();
      this.inputAddressObjForLocAddr.inputField.inputLookupObj.isRequired = true;
      this.inputAddressObjForLocAddr.isRequired = true;
      this.inputAddressObjForLegalAddr.isRequired = true;
    }
    else{
      this.AddCollForm.controls.OwnerName.clearValidators();
      this.AddCollForm.controls.OwnerName.updateValueAndValidity();
      this.AddCollForm.controls.OwnerRelationship.clearValidators();
      this.AddCollForm.controls.OwnerRelationship.updateValueAndValidity();
      this.AddCollForm.controls.MrIdType.clearValidators();
      this.AddCollForm.controls.MrIdType.updateValueAndValidity();
      this.AddCollForm.controls.OwnerIdNo.clearValidators();
      this.AddCollForm.controls.OwnerIdNo.updateValueAndValidity();
      this.AddCollForm.controls.OwnerMobilePhnNo.clearValidators();
      this.AddCollForm.controls.OwnerMobilePhnNo.updateValueAndValidity();
      this.inputAddressObjForLocAddr.inputField.inputLookupObj.isRequired = false;
      this.inputAddressObjForLegalAddr.inputField.inputLookupObj.isRequired = false;
      this.inputAddressObjForLocAddr.isRequired = false;
      this.inputAddressObjForLegalAddr.isRequired = false;
    }
  }

  ChangeCollStat() {
    if (this.AddCollForm.controls.CollateralStatus.value == 'RECEIVED' && this.AddCollForm.controls.IsRequiredStatus.value == true) {
      this.AddCollForm.controls.CollateralReceivedDt.enable();

      this.AddCollForm.controls.CollateralReleasedDt.disable();
      this.AddCollForm.controls.CollateralReleasedDt.clearValidators();
      this.AddCollForm.controls.CollateralReleasedDt.updateValueAndValidity();
    } else if (this.AddCollForm.controls.CollateralStatus.value == 'RELEASED' && this.AddCollForm.controls.IsRequiredStatus.value == true){
      this.AddCollForm.controls.CollateralReleasedDt.enable();

      this.AddCollForm.controls.CollateralReceivedDt.disable();
      this.AddCollForm.controls.CollateralReceivedDt.clearValidators();
      this.AddCollForm.controls.CollateralReceivedDt.updateValueAndValidity();
    }
  }

  CollateralReceive() {
    let temp: AbstractControl;

    if (this.AddCollForm.controls.CollateralStatus.value == 'RECEIVED' && this.AddCollForm.controls.IsRequiredStatus.value == true) {
      temp = this.AddCollForm.controls.CollateralReceivedDt;
    } else if(this.AddCollForm.controls.CollateralStatus.value == 'RELEASED' && this.AddCollForm.controls.IsRequiredStatus.value == true) {
      temp = this.AddCollForm.controls.CollateralReleasedDt;
    }

    if (this.AddCollForm.controls.IsRequiredStatus.value) {
      temp.enable();
      temp.setValidators([Validators.required]);
    } else {
      this.AddCollForm.controls.CollateralReceivedDt.disable();
      this.AddCollForm.controls.CollateralReleasedDt.disable();
      temp.clearValidators();
    }
    temp.updateValueAndValidity();
  }


}

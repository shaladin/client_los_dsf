import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { CustMainDataCompanyObj } from 'app/shared/model/CustMainDataCompanyObj.Model';
import { CustMainDataPersonalObj } from 'app/shared/model/CustMainDataPersonalObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResListKeyValueObj } from 'app/shared/model/Response/Generic/ResListKeyValueObj.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { ResponseCustCompanyForCopyObj } from 'app/shared/model/ResponseCustCompanyForCopyObj.Model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-nap-cust-main-data',
  templateUrl: './new-nap-cust-main-data.component.html'
})
export class NewNapCustMainDataComponent implements OnInit {
  private ucLookupExistingCust: UclookupgenericComponent;
  @ViewChild('LookupExistingCust') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupExistingCust = content;
    }
  }

  @Input() ParentForm: FormGroup;
  @Input() custMainDataMode: string;
  @Input() appId: number;
  @Input() appCustId: number = 0;
  @Input() bizTemplateCode: string = "";
  @Input() inputMode: string = "ADD";
  @Input() isMainCustMarried: boolean = false;
  @Input() InputAppCustObjMainData: Object;
  @Input() IsCustMainDataSubmitted: boolean;
  @Output() ResponseCustType: EventEmitter<any>;
  @Output() ResponseIsExisting: EventEmitter<any>;
  @Output() ResponseIsIncludeCustRelation: EventEmitter<any>;
  @Output() ResponseCustModel: EventEmitter<any>;
  @Output() ResponseGetExistingCust: EventEmitter<ResponseCustPersonalForCopyObj>;
  @Output() ResponseGetExistingCustCompany: EventEmitter<ResponseCustCompanyForCopyObj>;
  @Output() ResponseIsMarried: EventEmitter<boolean>;


  isExisting: boolean = false;
  isUcAddressReady: boolean = false;
  isIncludeCustRelation: boolean = false;
  MrCustTypeCode: string = CommonConstant.CustTypePersonal;
  subjectTitle: string = 'Customer';
  MaritalStatLookup: string = "";
  MaxDate: Date;
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  InputLookupCustGrpObj: InputLookupObj = new InputLookupObj();
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();
  legalAddrObj: AddrObj = new AddrObj();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  DictRefMaster: Array<KeyValueObj> = new Array<KeyValueObj>();
  MrCustRelationshipCodeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustModelObj: Array<KeyValueObj> = new Array();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  UserAccess: Object;
  custDataObj: CustDataObj;
  custDataPersonalObj: CustMainDataPersonalObj;
  custDataCompanyObj: CustMainDataCompanyObj;
  rowVersionAppCust: string;
  rowVersionAppCustPersonal: string[];
  rowVersionAppCustCompany: string[];
  rowVersionAppCustAddr: string[];
  rowVersionMgmntShrholder: string[];
  readonly MasterGender = CommonConstant.RefMasterTypeCodeGender;
  readonly MasterCustType = CommonConstant.RefMasterTypeCodeCustType;
  readonly MasterMaritalStat = CommonConstant.RefMasterTypeCodeMaritalStat;
  readonly MasterCompanyType = CommonConstant.RefMasterTypeCodeCompanyType;
  readonly MasterJobPosition = CommonConstant.RefMasterTypeCodeJobPosition;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private cookieService: CookieService
  ) {
    this.InputAppCustObjMainData = new Object();
    this.ResponseCustType = new EventEmitter<any>();
    this.ResponseIsExisting = new EventEmitter<any>();
    this.ResponseIsIncludeCustRelation = new EventEmitter<any>();
    this.ResponseCustModel = new EventEmitter<any>();
    this.ResponseGetExistingCust = new EventEmitter<ResponseCustPersonalForCopyObj>();
    this.ResponseIsMarried = new EventEmitter<boolean>();
    this.ResponseGetExistingCustCompany = new EventEmitter<ResponseCustCompanyForCopyObj>();
    this.IsCustMainDataSubmitted = false;
  }

  async ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess[CommonConstant.BUSINESS_DT];

    await this.initcustMainDataMode();
    await this.setLookup();

    this.legalAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.inputAddressObj.showAllPhn = false;
    this.inputAddressObj.showFax = false;
    this.isUcAddressReady = true;

    await this.getRefMaster();
    if (this.inputMode != 'ADD') {
      this.getCustMainData();
    }
    this.ResponseCustType.emit(this.ParentForm.controls.MrCustTypeCode.value);
  }

  CustModelHandler() {
    this.ResponseCustModel.emit(this.ParentForm.controls.MrCustModelCode.value);
  }

  initcustMainDataMode() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    if (this.appCustId) this.custDataObj.AppCustId = this.appCustId;

    switch (this.custMainDataMode) {
      case CommonConstant.CustMainDataModeCust:
        this.isIncludeCustRelation = false;
        this.custDataObj.IsCustomer = true;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
        this.ParentForm.controls.MrCustRelationshipCode.clearValidators();
        this.ResponseIsIncludeCustRelation.emit(this.isIncludeCustRelation);
        break;
      case CommonConstant.CustMainDataModeGuarantor:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.ParentForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.ParentForm.controls.MrGenderCode.setValidators(Validators.required);
        this.GetAppCustMainDataByAppId();
        this.ResponseIsIncludeCustRelation.emit(this.isIncludeCustRelation);
        break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.subjectTitle = 'Family';
        this.ParentForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.ParentForm.controls.MrGenderCode.setValidators(Validators.required);
        this.GetAppCustMainDataByAppId();
        this.ResponseIsIncludeCustRelation.emit(this.isIncludeCustRelation);
        break;
      case CommonConstant.CustMainDataModeMgmntShrholder:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsShareholder = true;
        this.subjectTitle = 'Shareholder';
        this.ParentForm.controls.EstablishmentDt.setValidators([Validators.required]);
        this.ParentForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.ParentForm.controls.MrJobPositionCode.setValidators(Validators.required);
        this.GetAppCustMainDataByAppId();
        this.ResponseIsIncludeCustRelation.emit(this.isIncludeCustRelation);
        break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
        this.ResponseIsIncludeCustRelation.emit(this.isIncludeCustRelation);
    }
  }

  AppCustData: AppCustObj = new AppCustObj();
  GetAppCustMainDataByAppId() {
    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, { 'Id': this.appId }).subscribe(
      async (response) => {
        if (response.AppCustObj) {
          this.AppCustData = response.AppCustObj;
        }
      }
    );
  }

  setLookup(custType: string = CommonConstant.CustTypePersonal, isChange: boolean = false) {
    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustObj.isRequired = true;
    this.InputLookupCustObj.nameSelect = "";

    this.InputLookupCustGrpObj.urlJson = "./assets/uclookup/lookupCustGrp.json";
    this.InputLookupCustGrpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustGrpObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustGrpObj.pagingJson = "./assets/uclookup/lookupCustGrp.json";
    this.InputLookupCustGrpObj.genericJson = "./assets/uclookup/lookupCustGrp.json";
    this.InputLookupCustGrpObj.isRequired = false;
    this.InputLookupCustGrpObj.nameSelect = "";
    this.InputLookupCustGrpObj.ddlEnvironments = [
      {
        name: "C.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url
      },
    ];

    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = custType;
    this.ArrAddCrit.push(critObj);

    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;

    if (isChange) {
      this.ucLookupExistingCust.setAddCritInput();
    } else {
      this.InputLookupCustObj.isReady = true;
      this.InputLookupCustGrpObj.isReady = true;
    }
  }

  RelationshipChange(relationship: string) {
    let idxMarried = this.DictRefMaster[this.MasterMaritalStat].findIndex(x => x.Key == CommonConstant.MasteCodeMartialStatsMarried);

    if (relationship == CommonConstant.MasteCodeRelationshipSpouse) {
      this.ParentForm.controls.MrMaritalStatCode.patchValue(this.DictRefMaster[this.MasterMaritalStat][idxMarried].Key);
      this.ParentForm.controls.MrMaritalStatCode.disable();
    } else {
      this.ParentForm.controls.MrMaritalStatCode.patchValue(this.MaritalStatLookup != "" ? this.MaritalStatLookup : this.DictRefMaster[this.MasterMaritalStat][idxMarried].Key);
      if (!this.isExisting) this.ParentForm.controls.MrMaritalStatCode.enable();
    }
    this.ParentForm.controls.MrMaritalStatCode.updateValueAndValidity();
  }

  MaritalStatChange(maritalStat: string) {
    if (maritalStat == CommonConstant.MasteCodeMartialStatsMarried) {
      this.ResponseIsMarried.emit(true);
    } else {
      this.ResponseIsMarried.emit(false);
    }
  }

  getCustGrpData(event) {
    this.ParentForm.patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });
  }

  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: RefMasterTypeCode }).toPromise().then(
      (response) => {
        this.DictRefMaster[RefMasterTypeCode] = response[CommonConstant.ReturnObj];
      });
  }

  async getRefMaster() {
    await this.GetListActiveRefMaster(this.MasterCustType);
    await this.GetListActiveRefMaster(this.MasterGender);
    await this.GetListActiveRefMaster(this.MasterMaritalStat);
    await this.GetListActiveRefMaster(this.MasterCompanyType);
    await this.GetListActiveRefMaster(this.MasterJobPosition);

    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel, MappingCode: this.MrCustTypeCode }).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
      }
    );

    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeIdType }).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.ChangeIdType(this.IdTypeObj[idxDefault]["MasterCode"]);
        }
      });

    if (this.DictRefMaster[this.MasterCustType].length != 0) await this.ParentForm.controls.MrCustTypeCode.patchValue(this.DictRefMaster[this.MasterCustType][0].Key)
    if (this.isIncludeCustRelation) {
      await this.getCustRelationship();
    }
  }

  getCustRelationship() {
    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (this.ParentForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal) {
        var refCustRelObj = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
          MappingCode: CommonConstant.CustTypePersonal,
          RowVersion: ""
        }
      } else {
        var refCustRelObj = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
          MappingCode: CommonConstant.CustTypeCompany,
          RowVersion: ""
        }
      }
      this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refCustRelObj).subscribe(
        (response) => {
          this.MrCustRelationshipCodeObj = response[CommonConstant.ReturnObj];
        }
      );
    } else {
      this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, { RefMasterTypeCode: this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship }).subscribe(
        async (response) => {
          this.MrCustRelationshipCodeObj = response[CommonConstant.ReturnObj];
          if (this.ParentForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal && !this.isMainCustMarried) await this.removeSpouse();
        }
      );
    }
  }

  removeSpouse() {
    let idxSpouse = this.MrCustRelationshipCodeObj.findIndex(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
    this.MrCustRelationshipCodeObj.splice(idxSpouse, 1)
  }

  getCustMainData() {
    console.log("get main data");
    if (this.InputAppCustObjMainData) {
      if (!this.appCustId) this.appCustId = this.InputAppCustObjMainData["AppCustObj"].AppCustId;
      this.MrCustTypeCode = this.InputAppCustObjMainData["AppCustObj"].MrCustTypeCode;
      this.custTypeChange(this.MrCustTypeCode, true);

      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal)
        this.setDataCustomerPersonal(this.InputAppCustObjMainData["AppCustObj"], this.InputAppCustObjMainData["AppCustPersonalObj"], this.InputAppCustObjMainData["AppCustCompanyMgmntShrholderObj"]);
      else
        this.setDataCustomerCompany(this.InputAppCustObjMainData["AppCustObj"], this.InputAppCustObjMainData["AppCustCompanyObj"], this.InputAppCustObjMainData["AppCustCompanyMgmntShrholderObj"]);

      if (this.InputAppCustObjMainData["AppCustObj"].IsExistingCust) this.disableInput();
    } else
      this.custTypeChange(CommonConstant.CustTypePersonal, true);
  }

  custTypeChange(custType: string = CommonConstant.CustTypePersonal, FirstInit: boolean = false) {
    this.MrCustTypeCode = custType;
    this.ParentForm.controls.MrCustTypeCode.setValue(this.MrCustTypeCode);

    if (!FirstInit) {
      var custModelReqObj = new GenericObj();
      custModelReqObj.Code = this.MrCustTypeCode;
      this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, custModelReqObj).subscribe(
        (response : ResListKeyValueObj) => {
          this.CustModelObj = response[CommonConstant.ReturnObj];
        }
      );
    }

    if (custType == CommonConstant.CustTypePersonal) {
      this.ParentForm.controls.MrCustModelCode.setValidators(Validators.required);
      this.ParentForm.controls.MotherMaidenName.setValidators(Validators.required);
      this.ParentForm.controls.BirthDt.setValidators(Validators.required);
      this.ParentForm.controls.BirthPlace.setValidators(Validators.required);
      this.ParentForm.controls.MrIdTypeCode.setValidators(Validators.required);
      this.ParentForm.controls.MrGenderCode.setValidators(Validators.required);
      this.ParentForm.controls.MrMaritalStatCode.setValidators(Validators.required);
      this.ParentForm.controls.IdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.ParentForm.controls.MobilePhnNo1.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.ParentForm.controls.Email1.setValidators([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]);
      this.ParentForm.controls.MrCompanyTypeCode.clearValidators();
      this.ParentForm.controls.MrCompanyTypeCode.updateValueAndValidity();
      this.ParentForm.controls.TaxIdNo.clearValidators();
      this.ParentForm.controls.TaxIdNo.updateValueAndValidity();
    } else {
      this.ParentForm.controls.TaxIdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.ParentForm.controls.TaxIdNo.updateValueAndValidity();

      this.ParentForm.controls.MrCompanyTypeCode.setValidators(Validators.required);
      this.ParentForm.controls.MrCompanyTypeCode.updateValueAndValidity();

      this.ParentForm.controls.MrCustModelCode.clearValidators();
      this.ParentForm.controls.MotherMaidenName.clearValidators();
      this.ParentForm.controls.BirthPlace.clearValidators();
      this.ParentForm.controls.BirthDt.clearValidators();
      this.ParentForm.controls.MrIdTypeCode.clearValidators();
      this.ParentForm.controls.MrGenderCode.clearValidators();
      this.ParentForm.controls.MrMaritalStatCode.clearValidators();
      this.ParentForm.controls.IdNo.clearValidators();
      this.ParentForm.controls.MobilePhnNo1.clearValidators();
      this.ParentForm.controls.Email1.clearValidators();
    }

    if (this.isIncludeCustRelation) {
      this.getCustRelationship();
      this.ParentForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
      this.ParentForm.controls.MrCustRelationshipCode.updateValueAndValidity();

    }
    else {
      this.ParentForm.controls.MrCustRelationshipCode.clearValidators();
      this.ParentForm.controls.MrCustRelationshipCode.updateValueAndValidity();
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (custType == CommonConstant.CustTypePersonal) {
        this.ParentForm.controls.MrJobPositionCode.setValidators(Validators.required);
        this.ParentForm.controls.MrJobPositionCode.updateValueAndValidity();
      } else {
        this.ParentForm.controls.MrJobPositionCode.clearValidators();
        this.ParentForm.controls.MrJobPositionCode.updateValueAndValidity();

      }
    }

    this.ParentForm.controls.MrCustModelCode.updateValueAndValidity();
    this.ParentForm.controls.MotherMaidenName.updateValueAndValidity();
    this.ParentForm.controls.BirthDt.updateValueAndValidity();
    this.ParentForm.controls.BirthPlace.updateValueAndValidity();
    this.ParentForm.controls.MrIdTypeCode.updateValueAndValidity();
    this.ParentForm.controls.MrGenderCode.updateValueAndValidity();
    this.ParentForm.controls.MrMaritalStatCode.updateValueAndValidity();
    this.ParentForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.ParentForm.controls.MrCompanyTypeCode.updateValueAndValidity();
    this.ParentForm.controls.IdNo.updateValueAndValidity();
    this.ParentForm.controls.TaxIdNo.updateValueAndValidity();
    this.ParentForm.controls.MobilePhnNo1.updateValueAndValidity();
    this.ParentForm.controls.Email1.updateValueAndValidity();
    this.setLookup(custType, true);
  }

  async copyCustomerEvent(event) {
    this.ParentForm.patchValue({
      CustName: event.CustName
    });
    if (event.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalForCopyByCustId, { Id: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerPersonal(response.CustObj, response.CustPersonalObj, response.CustCompanyMgmntShrholderObj, true);
          this.ResponseGetExistingCust.emit(response);
        });
    } else {
      this.http.post<ResponseCustCompanyForCopyObj>(URLConstant.GetCustCompanyForCopyByCustId, { Id: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerCompany(response.CustObj, response.CustCompanyObj, response.CustCompanyMgmntShrholderObj, true);
          this.ResponseGetExistingCustCompany.emit(response);
        });
    }
    await this.disableInput();
  }

  ChangeIdType(IdType: string) {
    this.ParentForm.controls.IdExpiredDt.patchValue("");

    if (IdType == "KITAS" || IdType == "SIM") {
      this.ParentForm.controls.IdExpiredDt.setValidators([Validators.required]);
    } else {
      this.ParentForm.controls.IdExpiredDt.clearValidators();
    }

    this.ParentForm.controls.IdExpiredDt.updateValueAndValidity();
  }

  CopyAddress() {
    this.http.post(URLConstant.GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode, { AppId: this.appId, MrCustAddrTypeCode: CommonConstant.AddrTypeLegal }).subscribe(
      (response) => {
        this.legalAddrObj.Addr = response["Addr"];
        this.legalAddrObj.AreaCode1 = response["AreaCode1"];
        this.legalAddrObj.AreaCode2 = response["AreaCode2"];
        this.legalAddrObj.AreaCode3 = response["AreaCode3"];
        this.legalAddrObj.AreaCode4 = response["AreaCode4"];
        this.legalAddrObj.City = response["City"];

        this.inputAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
        this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
        this.inputAddressObj.default = this.legalAddrObj;
      });
  }

  resetInput(custType: string = CommonConstant.CustTypePersonal) {
    this.ParentForm.reset();
    this.ParentForm.patchValue({
      MrCustTypeCode: custType,
      SharePrcnt: 0,
      IsActive: false,
      IsSigner: false,
      IsOwner: false
    });
    if (custType == CommonConstant.CustTypePersonal) {
      this.ParentForm.patchValue({
        MrIdTypeCode: "",
        MrGenderCode: "",
        MrMaritalStatCode: "",
        MrCustModelCode: ""
      });
    } else {
      this.ParentForm.patchValue({
        MrCompanyTypeCode: ""
      });
    }

    this.enableInput();

    this.custTypeChange(custType);

    this.ResponseCustType.emit(this.ParentForm.controls.MrCustTypeCode.value);
  }

  disableInput() {
    this.isExisting = true;
    this.inputAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = true;
    this.ResponseIsExisting.emit(this.isExisting);
  }

  enableInput() {
    this.isExisting = false;
    this.inputAddressObj.isReadonly = false;
    this.InputLookupCustObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = false;
    this.ResponseIsExisting.emit(this.isExisting);
  }

  clearInput() {
    this.ParentForm.patchValue({
      BirthDt: '',
      BirthPlace: '',
      IdNo: '',
      IdExpiredDt: '',
      TaxIdNo: '',
      MotherMaidenName: '',
      MobilePhnNo1: '',
      Email1: ''
    });
  }

  setDataCustomerPersonal(CustObj, CustPersonalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      this.ParentForm.patchValue({
        MrCustModelCode: CustObj.MrCustModelCode,
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        MrIdTypeCode: CustObj.MrIdTypeCode,
        IdNo: CustObj.IdNo,
        IdExpiredDt: CustObj.IdExpiredDt != null ? formatDate(CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
        TaxIdNo: CustObj.TaxIdNo
      });
      this.ResponseCustModel.emit(CustObj.MrCustModelCode);
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
    }

    if (CustPersonalObj != undefined) {
      this.ParentForm.patchValue({
        MrGenderCode: CustPersonalObj.MrGenderCode,
        MotherMaidenName: CustPersonalObj.MotherMaidenName,
        BirthPlace: CustPersonalObj.BirthPlace,
        BirthDt: formatDate(CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MobilePhnNo1: CustPersonalObj.MobilePhnNo1,
        Email1: CustPersonalObj.Email1,
      });
      this.MaritalStatLookup = CustPersonalObj.MrMaritalStatCode;
      if (!IsCopyCust) {
        this.ParentForm.patchValue({
          MrMaritalStatCode: CustPersonalObj.MrMaritalStatCode
        })
        this.rowVersionAppCustPersonal = CustPersonalObj.RowVersion;
      }
      this.RelationshipChange(CustObj.MrCustRelationshipCode);
      this.MaritalStatChange(CustPersonalObj.MrMaritalStatCode);

      if (this.inputMode == 'EDIT') {
        this.ParentForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation && !IsCopyCust ? CustObj.MrCustRelationshipCode : '',
        })
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj)
    }

  }

  setDataCustomerCompany(CustObj, CustCompanyObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      this.ParentForm.patchValue({
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        TaxIdNo: CustObj.TaxIdNo,
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
    }

    if (CustCompanyObj != undefined) {
      this.ParentForm.patchValue({
        MrCompanyTypeCode: CustCompanyObj.MrCompanyTypeCode,
      });
      if (!IsCopyCust) this.rowVersionAppCustCompany = CustCompanyObj.RowVersion;

      if (this.inputMode == 'EDIT') {
        this.ParentForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation ? CustObj.MrCustRelationshipCode : '',
        })
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj)
    }

  }

  setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustCompanyMgmntShrholderObj != undefined) {
      this.ParentForm.patchValue({
        MrJobPositionCode: CustCompanyMgmntShrholderObj.MrJobPositionCode,
        SharePrcnt: CustCompanyMgmntShrholderObj.SharePrcnt,
        IsSigner: CustCompanyMgmntShrholderObj.IsSigner,
        IsActive: CustCompanyMgmntShrholderObj.IsActive,
        IsOwner: CustCompanyMgmntShrholderObj.IsOwner,
        EstablishmentDt: CustCompanyMgmntShrholderObj.EstablishmentDt != null ? formatDate(CustCompanyMgmntShrholderObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
      });
      if (!IsCopyCust) {
        this.ParentForm.patchValue({
          RowVersionShareholder: CustCompanyMgmntShrholderObj.RowVersion
        });
      }
    }
  }

}

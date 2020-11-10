import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { CustMainDataCompanyObj } from 'app/shared/model/CustMainDataCompanyObj.Model';
import { CustMainDataPersonalObj } from 'app/shared/model/CustMainDataPersonalObj.Model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { ResponseCustCompanyForCopyObj } from 'app/shared/model/ResponseCustCompanyForCopyObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-cust-main-data',
  templateUrl: './cust-main-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustMainDataComponent implements OnInit {

  private ucLookupExistingCust: UclookupgenericComponent;
  @ViewChild('LookupExistingCust') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupExistingCust = content;
    }
  }
  @Input() custMainDataMode: string;
  @Input() appId: number;
  @Input() appCustId: number = 0;
  @Input() bizTemplateCode: string = "";
  @Input() inputMode: string = "ADD";
  @Input() isMarried: boolean = false;
  @Output() outputAfterSave: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

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
  CustTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  GenderObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  MaritalStatObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  MrCustRelationshipCodeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CompanyTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustModelObj: Array<KeyValueObj> = new Array();
  JobPositionObj: Array<KeyValueObj> = new Array();
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    public formValidate: FormValidateService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["appId"];
    })
  }

  CustMainDataForm = this.fb.group({
    MrCustModelCode: ['', Validators.required],
    MrCustTypeCode: [],
    MrCustRelationshipCode: ['', Validators.maxLength(50)],
    CustNo: [],
    CompanyType: [''],
    MrMaritalStatCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    IdExpiredDt: [''],
    TaxIdNo: ['', Validators.pattern("^[0-9]+$")],
    MrGenderCode: ['', Validators.required],
    BirthPlace: ['', Validators.required],
    BirthDt: ['', Validators.required],
    MotherMaidenName: ['', Validators.required],
    MrCompanyTypeCode: [''],
    MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    Email1: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    MrJobPositionCode: [''],
    EstablishmentDt: [''],
    SharePrcnt: [0],
    IsSigner: [false],
    IsActive: [false],
    IsOwner: [false]
  });

  async ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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
        this.CustMainDataForm.controls.MrCustRelationshipCode.clearValidators();
        break;
      case CommonConstant.CustMainDataModeGuarantor:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.subjectTitle = 'Family';
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        break;
      case CommonConstant.CustMainDataModeMgmntShrholder:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsShareholder = true;
        this.subjectTitle = 'Shareholder';
        this.CustMainDataForm.controls.EstablishmentDt.setValidators([Validators.required]);
        this.CustMainDataForm.controls.MrCustRelationshipCode.clearValidators();
        break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
    }
  }

  setLookup(custType: string = CommonConstant.CustTypePersonal, isChange: boolean = false) {
    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
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

  RelationshipChange(relationship: string){
    let idxMarried = this.MaritalStatObj.findIndex(x => x.Key == CommonConstant.MasteCodeMartialStatsMarried);

    if(relationship == CommonConstant.MasteCodeRelationshipSpouse){
      this.CustMainDataForm.controls.MrMaritalStatCode.patchValue(this.MaritalStatObj[idxMarried].Key);
      this.CustMainDataForm.controls.MrMaritalStatCode.disable();
    }else{
      this.CustMainDataForm.controls.MrMaritalStatCode.patchValue(this.MaritalStatLookup != "" ? this.MaritalStatLookup : this.MaritalStatObj[idxMarried].Key);
      if(!this.isExisting) this.CustMainDataForm.controls.MrMaritalStatCode.enable();
    }
    this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
  }

  getCustGrpData(event) {
    this.CustMainDataForm.patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });
  }

  async getRefMaster() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).toPromise().then(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.MrCustTypeCode = this.CustTypeObj[0].Key;
        if (this.inputMode == 'ADD') {
          this.CustMainDataForm.patchValue({
            MrCustTypeCode: this.CustTypeObj[0].Key
          })
        }
      });

    await this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, { MrCustTypeCode: this.MrCustTypeCode }).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        this.CustMainDataForm.patchValue({
          MrCustModelCode: this.CustModelObj[0].Key
        });
      }
    );

    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.CustMainDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
          this.ChangeIdType(this.IdTypeObj[idxDefault]["MasterCode"]);
        }
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).toPromise().then(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMaritalStat }).toPromise().then(
      (response) => {
        this.MaritalStatObj = response[CommonConstant.ReturnObj];
        if (this.MaritalStatObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
        }
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).toPromise().then(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).toPromise().then(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        if (this.JobPositionObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrJobPositionCode: this.JobPositionObj[0].Key
          });
        }
      });

    if (this.isIncludeCustRelation) {
      this.getCustRelationship();
    }
  }

  getCustRelationship() {
    var refCustRelObj = {
      RefMasterTypeCode: this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship,
    }
    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, refCustRelObj).subscribe(
      async (response) => {
        this.MrCustRelationshipCodeObj = response[CommonConstant.ReturnObj];
        if (this.CustMainDataForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal && !this.isMarried) await this.removeSpouse();
        if (this.inputMode != "EDIT"){
          this.CustMainDataForm.patchValue({ MrCustRelationshipCode: this.MrCustRelationshipCodeObj[0].Key });
          this.RelationshipChange(this.MrCustRelationshipCodeObj[0].Key);
        } 
        
      }
    );
  }

  removeSpouse() {
    let SpouseRelationship = this.MrCustRelationshipCodeObj[0]
    if (SpouseRelationship.Key == "SPOUSE") {
      this.MrCustRelationshipCodeObj = this.MrCustRelationshipCodeObj.slice(1, this.MrCustRelationshipCodeObj.length);
    }
  }

  getCustMainData() {
    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppCustId, { 'AppCustId': this.appCustId }).subscribe(
      async (response) => {
        if (response.AppCustObj) {
          if (!this.appCustId) this.appCustId = response.AppCustObj.AppCustId
          this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
          await this.custTypeChange(this.MrCustTypeCode, true);

          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal)
            await this.setDataCustomerPersonal(response.AppCustObj, response.AppCustPersonalObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);
          else
            await this.setDataCustomerCompany(response.AppCustObj, response.AppCustCompanyObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);

          if (response.AppCustObj.IsExistingCust) this.disableInput();
        } else
          this.custTypeChange(CommonConstant.CustTypePersonal, true);
      }
    );
  }

  custTypeChange(custType: string = CommonConstant.CustTypePersonal, FirstInit: boolean = false) {
    this.MrCustTypeCode = custType;
    this.CustMainDataForm.controls.MrCustTypeCode.setValue(this.MrCustTypeCode);

    if (!FirstInit) {
      this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, { MrCustTypeCode: custType == CommonConstant.CustTypePersonal ? CommonConstant.CustTypePersonal : CommonConstant.CustTypeCompany }).subscribe(
        (response) => {
          this.CustModelObj = response[CommonConstant.ReturnObj];
          this.CustMainDataForm.patchValue({
            MrCustModelCode: this.CustModelObj[0].Key
          });
        }
      );
    }

    if (custType == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.controls.MrCustModelCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MotherMaidenName.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthDt.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthPlace.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrIdTypeCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrMaritalStatCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.IdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.MobilePhnNo1.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.Email1.setValidators([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]);
      this.CustMainDataForm.controls.TaxIdNo.clearValidators();
    } else {
      this.CustMainDataForm.controls.TaxIdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.MrCustModelCode.clearValidators();
      this.CustMainDataForm.controls.MotherMaidenName.clearValidators();
      this.CustMainDataForm.controls.BirthPlace.clearValidators();
      this.CustMainDataForm.controls.BirthDt.clearValidators();
      this.CustMainDataForm.controls.MrIdTypeCode.clearValidators();
      this.CustMainDataForm.controls.MrGenderCode.clearValidators();
      this.CustMainDataForm.controls.MrMaritalStatCode.clearValidators();
      this.CustMainDataForm.controls.IdNo.clearValidators();
      this.CustMainDataForm.controls.MobilePhnNo1.clearValidators();
      this.CustMainDataForm.controls.Email1.clearValidators();
    }

    if (this.isIncludeCustRelation) {
      this.getCustRelationship();
      this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
    }
    else {
      this.CustMainDataForm.controls.MrCustRelationshipCode.clearValidators();
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (custType == CommonConstant.CustTypePersonal) {
        this.CustMainDataForm.controls.MrJobPositionCode.setValidators(Validators.required);
      } else {
        this.CustMainDataForm.controls.MrJobPositionCode.clearValidators();
      }
    }

    this.CustMainDataForm.controls.MrCustModelCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MotherMaidenName.updateValueAndValidity();
    this.CustMainDataForm.controls.BirthDt.updateValueAndValidity();
    this.CustMainDataForm.controls.BirthPlace.updateValueAndValidity();
    this.CustMainDataForm.controls.MrIdTypeCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrGenderCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
    this.CustMainDataForm.controls.IdNo.updateValueAndValidity();
    this.CustMainDataForm.controls.TaxIdNo.updateValueAndValidity();
    this.CustMainDataForm.controls.MobilePhnNo1.updateValueAndValidity();
    this.CustMainDataForm.controls.Email1.updateValueAndValidity();
    this.setLookup(custType, true);
  }

  async copyCustomerEvent(event) {
    if (event.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerPersonal(response.CustObj, response.CustPersonalObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
        });
    } else {
      this.http.post<ResponseCustCompanyForCopyObj>(URLConstant.GetCustCompanyForCopyByCustId, { CustId: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerCompany(response.CustObj, response.CustCompanyObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
        });
    }
    await this.disableInput();
  }

  ChangeIdType(IdType: string) {
    this.CustMainDataForm.controls.IdExpiredDt.patchValue("");

    if (IdType == "KITAS" || IdType == "SIM") {
      this.CustMainDataForm.controls.IdExpiredDt.setValidators([Validators.required]);
    } else {
      this.CustMainDataForm.controls.IdExpiredDt.clearValidators();
    }

    this.CustMainDataForm.controls.IdExpiredDt.updateValueAndValidity();
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
    this.CustMainDataForm.reset();
    let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
    this.CustMainDataForm.patchValue({
      MrCustTypeCode: custType,
      SharePrcnt: 0,
      IsActive: false,
      IsSigner: false,
      IsOwner: false
    });
    if (custType == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"],
        MrGenderCode: this.GenderObj[0].Key,
        MrMaritalStatCode: this.MaritalStatObj[0].Key
      });
    } else {
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: this.CompanyTypeObj[0].Key
      });
    }

    this.enableInput();

    this.custTypeChange(custType);
  }

  disableInput() {
    this.isExisting = true;
    this.inputAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = true;
  }

  enableInput() {
    this.isExisting = false;
    this.inputAddressObj.isReadonly = false;
    this.InputLookupCustObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = false;
  }

  clearInput() {
    this.CustMainDataForm.patchValue({
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

  setDataCustomerPersonal(CustObj, CustPersonalObj, CustAddrLegalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCustModelCode: CustObj.MrCustModelCode,
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        MrIdTypeCode: CustObj.MrIdTypeCode,
        IdNo: CustObj.IdNo,
        IdExpiredDt: CustObj.IdExpiredDt != null ? formatDate(CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
        TaxIdNo: CustObj.TaxIdNo
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
    }

    if (CustPersonalObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrGenderCode: CustPersonalObj.MrGenderCode,
        MotherMaidenName: CustPersonalObj.MotherMaidenName,
        BirthPlace: CustPersonalObj.BirthPlace,
        BirthDt: formatDate(CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MobilePhnNo1: CustPersonalObj.MobilePhnNo1,
        Email1: CustPersonalObj.Email1,
      });
      this.MaritalStatLookup = CustPersonalObj.MrMaritalStatCode;
      if (!IsCopyCust) {
        this.CustMainDataForm.patchValue({
          MrMaritalStatCode: CustPersonalObj.MrMaritalStatCode})
        this.rowVersionAppCustPersonal = CustPersonalObj.RowVersion;
      }
      this.RelationshipChange(this.CustMainDataForm.controls.MrCustRelationshipCode.value);

      if (this.inputMode == 'EDIT') {
        this.CustMainDataForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation ? CustObj.MrCustRelationshipCode : '',
        })
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj)
    }

    this.setDataLegalAddr(CustAddrLegalObj, IsCopyCust);
  }

  setDataCustomerCompany(CustObj, CustCompanyObj, CustAddrLegalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        TaxIdNo: CustObj.TaxIdNo,
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
    }

    if (CustCompanyObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: CustCompanyObj.MrCompanyTypeCode,
      });
      if (!IsCopyCust) this.rowVersionAppCustCompany = CustCompanyObj.RowVersion;

      if (this.inputMode == 'EDIT') {
        this.CustMainDataForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation ? CustObj.MrCustRelationshipCode : '',
        })
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj)
    }

    this.setDataLegalAddr(CustAddrLegalObj, IsCopyCust);
  }

  setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustCompanyMgmntShrholderObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrJobPositionCode: CustCompanyMgmntShrholderObj.MrJobPositionCode,
        SharePrcnt: CustCompanyMgmntShrholderObj.SharePrcnt,
        IsSigner: CustCompanyMgmntShrholderObj.IsSigner,
        IsActive: CustCompanyMgmntShrholderObj.IsActive,
        IsOwner: CustCompanyMgmntShrholderObj.IsOwner,
        EstablishmentDt: CustCompanyMgmntShrholderObj.EstablishmentDt != null ? formatDate(CustCompanyMgmntShrholderObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
      });
      if (!IsCopyCust) this.rowVersionMgmntShrholder = CustCompanyMgmntShrholderObj.RowVersion;
    }
  }

  setDataLegalAddr(response, IsCopyCust: boolean) {
    if (response != undefined) {
      this.legalAddrObj.Addr = response.Addr;
      this.legalAddrObj.AreaCode1 = response.AreaCode1;
      this.legalAddrObj.AreaCode2 = response.AreaCode2;
      this.legalAddrObj.AreaCode3 = response.AreaCode3;
      this.legalAddrObj.AreaCode4 = response.AreaCode4;
      this.legalAddrObj.City = response.City;

      this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
      this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
      this.inputAddressObj.default = this.legalAddrObj;

      if (!IsCopyCust) this.rowVersionAppCustAddr = response.RowVersion;
    }
  }

  setDataCustomerPersonalForSave() {
    if (this.MrCustTypeCode != CommonConstant.CustTypePersonal) return;
    this.custDataPersonalObj = new CustMainDataPersonalObj();
    this.custDataPersonalObj.AppCustObj.MrCustModelCode = this.CustMainDataForm.controls.MrCustModelCode.value;
    this.custDataPersonalObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    this.custDataPersonalObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    this.custDataPersonalObj.AppCustObj.MrIdTypeCode = this.CustMainDataForm.controls.MrIdTypeCode.value;
    this.custDataPersonalObj.AppCustObj.IdNo = this.CustMainDataForm.controls.IdNo.value;
    this.custDataPersonalObj.AppCustObj.IdExpiredDt = this.CustMainDataForm.controls.IdExpiredDt.value;
    this.custDataPersonalObj.AppCustObj.TaxIdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataPersonalObj.AppCustObj.IsCustomer = (this.custMainDataMode == CommonConstant.CustMainDataModeCust);
    this.custDataPersonalObj.AppCustObj.IsGuarantor = (this.custMainDataMode == CommonConstant.CustMainDataModeGuarantor);
    this.custDataPersonalObj.AppCustObj.IsFamily = (this.custMainDataMode == CommonConstant.CustMainDataModeFamily);
    this.custDataPersonalObj.AppCustObj.IsShareholder = (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder);
    this.custDataPersonalObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataPersonalObj.AppCustObj.AppId = this.appId;
    this.custDataPersonalObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId ? this.appCustId : 0;
    if (this.isIncludeCustRelation)
      this.custDataPersonalObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustMainDataForm.controls.MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustMainDataForm.controls.MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustMainDataForm.controls.BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustMainDataForm.controls.BirthDt.value;
    this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustMainDataForm.controls.MotherMaidenName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1 = this.CustMainDataForm.controls.MobilePhnNo1.value,
      this.custDataPersonalObj.AppCustPersonalObj.Email1 = this.CustMainDataForm.controls.Email1.value,

      this.custDataPersonalObj.AppCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    this.custDataPersonalObj.AppCustAddrLegalObj.Addr = this.CustMainDataForm.controls["Address"]["controls"].Addr.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode = this.CustMainDataForm.controls["AddressZipcode"]["controls"].value.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.City = this.CustMainDataForm.controls["Address"]["controls"].City.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;

    if (this.custDataPersonalObj.AppCustObj.IsShareholder) {
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustMainDataForm.controls.MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.rowVersionMgmntShrholder;
    }

    this.custDataPersonalObj.AppCustObj.RowVersion = this.rowVersionAppCust;
    this.custDataPersonalObj.AppCustPersonalObj.RowVersion = this.rowVersionAppCustPersonal;
    this.custDataPersonalObj.AppCustAddrLegalObj.RowVersion = this.rowVersionAppCustAddr;
  }

  setDataCustomerCompanyForSave() {
    if (this.MrCustTypeCode != CommonConstant.CustTypeCompany) return;
    this.custDataCompanyObj = new CustMainDataCompanyObj();
    this.custDataCompanyObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    this.custDataCompanyObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataCompanyObj.AppCustObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    this.custDataCompanyObj.AppCustObj.MrIdTypeCode = "NPWP";
    this.custDataCompanyObj.AppCustObj.IdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataCompanyObj.AppCustObj.TaxIdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataCompanyObj.AppCustObj.IsCustomer = (this.custMainDataMode == CommonConstant.CustMainDataModeCust);
    this.custDataCompanyObj.AppCustObj.IsGuarantor = (this.custMainDataMode == CommonConstant.CustMainDataModeGuarantor);
    this.custDataCompanyObj.AppCustObj.IsShareholder = (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder);
    this.custDataCompanyObj.AppCustObj.AppId = this.appId;
    this.custDataCompanyObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataCompanyObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId != null ? this.appCustId : 0;

    if (this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataCompanyObj.AppCustCompanyObj.MrCompanyTypeCode = this.CustMainDataForm.controls.MrCompanyTypeCode.value;

    this.custDataCompanyObj.AppCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    this.custDataCompanyObj.AppCustAddrLegalObj.Addr = this.CustMainDataForm.controls["Address"]["controls"].Addr.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode3 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode3.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode4 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode4.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.Zipcode = this.CustMainDataForm.controls["AddressZipcode"]["controls"].value.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode1 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode1.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode2 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode2.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.City = this.CustMainDataForm.controls["Address"]["controls"].City.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;

    if (this.custDataCompanyObj.AppCustObj.IsShareholder) {
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.rowVersionMgmntShrholder;
    }

    this.custDataCompanyObj.AppCustObj.RowVersion = this.rowVersionAppCust;
    this.custDataCompanyObj.AppCustCompanyObj.RowVersion = this.rowVersionAppCustCompany;
    this.custDataCompanyObj.AppCustAddrLegalObj.RowVersion = this.rowVersionAppCustAddr;
  }

  SaveForm() {
    let max17Yodt = new Date(this.MaxDate);
    let d1 = new Date(this.CustMainDataForm.controls.BirthDt.value);
    let d2 = new Date(this.MaxDate);
    max17Yodt.setFullYear(d2.getFullYear() - 17);

    if (d1 > max17Yodt) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      return;
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.setDataCustomerPersonalForSave();
      this.http.post(URLConstant.AddEditCustMainDataPersonal, this.custDataPersonalObj).subscribe(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["message"]);
            this.outputAfterSave.emit(this.custDataPersonalObj.AppCustPersonalObj);
          }
          else {
            response["ErrorMessages"].forEach((message: string) => {
              this.toastr.errorMessage(message["Message"]);
            });
          }
        }
      );
    }
    else {
      this.setDataCustomerCompanyForSave();
      this.http.post(URLConstant.AddEditCustMainDataCompany, this.custDataCompanyObj).subscribe(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.outputAfterSave.emit(this.custDataCompanyObj.AppCustObj);
            this.toastr.successMessage(response["message"]);
          }
          else {
            response["ErrorMessages"].forEach((message: string) => {
              this.toastr.errorMessage(message["Message"]);
            });
          }
        }
      );
    }
  }

  cancel() {
    this.outputCancel.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormGroup, ControlContainer, Validators, NgForm } from '@angular/forms';
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
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { CustMainDataCompanyObj } from 'app/shared/model/CustMainDataCompanyObj.Model';
import { CustMainDataPersonalObj } from 'app/shared/model/CustMainDataPersonalObj.Model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';

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
  @Input() appCustId: number;
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
  MrCustRelationshipObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CompanyTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  UserAccess: Object;
  custDataObj: CustDataObj;
  custDataPersonalObj: CustMainDataPersonalObj;
  custDataCompanyObj: CustMainDataCompanyObj;

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
    MrCustTypeCode: [],
    MrCustRelationship: ['', Validators.maxLength(50)],
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
    Email1: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
  });

  async ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess[CommonConstant.BUSINESS_DT];

    await this.initcustMainDataMode();
    await this.setLookup();

    this.legalAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.title = "Legal Address";
    this.isUcAddressReady = true;

    await this.getRefMaster();
    if (this.inputMode != 'ADD') {
      await this.getCustMainData();
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
        this.subjectTitle = 'Customer';
        this.CustMainDataForm.controls.MrCustRelationship.clearValidators();
        break;
      case CommonConstant.CustMainDataModeGuarantor:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.CustMainDataForm.controls.MrCustRelationship.setValidators(Validators.required);
        break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.subjectTitle = 'Family';
        this.CustMainDataForm.controls.MrCustRelationship.setValidators(Validators.required);
        break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = 'Customer';
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

  getCustGrpData(event){
    this.CustMainDataForm.patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });
  }
  
  getRefMaster() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.MrCustTypeCode = this.CustTypeObj[0].Key;
        if (this.inputMode == 'ADD') {
          this.CustMainDataForm.patchValue({
            MrCustTypeCode: this.CustTypeObj[0].Key
          })
        }
      });

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.CustMainDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
        // this.clearExpDt();
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMaritalStat }).subscribe(
      (response) => {
        this.MaritalStatObj = response[CommonConstant.ReturnObj];
        if (this.MaritalStatObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      });

    if (this.isIncludeCustRelation) {
      this.getCustRelationship();
    }
  }

  getCustRelationship(){
    var refCustRelObj = {
      RefMasterTypeCode: this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, refCustRelObj).subscribe(
      (response) => {
        this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
        if(this.CustMainDataForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal) this.removeSpouse();
        if (this.inputMode != "EDIT")
          this.CustMainDataForm.patchValue({ MrCustRelationship: this.MrCustRelationshipObj[0].Key });
      }
    );
  }

  removeSpouse(){
    let SpouseRelationship = this.MrCustRelationshipObj[0]
    if(!this.isMarried && SpouseRelationship.Key == "SPOUSE"){
      this.MrCustRelationshipObj = this.MrCustRelationshipObj.slice(1, this.MrCustRelationshipObj.length);
    }
  }

  getCustMainData() {
    this.http.post(URLConstant.GetAppCustMainDataByAppId, this.custDataObj).subscribe(
      (response) => {
        if (response['AppCustObj']) {
          if (!this.appCustId) this.appCustId = response['AppCustObj']['AppCustId']
          this.MrCustTypeCode = response['AppCustObj']['MrCustTypeCode'];
          this.custTypeChange(this.MrCustTypeCode);
          
          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) 
            this.setDataCustomerPersonal(response['AppCustObj'], response['AppCustPersonalObj'], response['AppCustAddrLegalObj']);
          else
            this.setDataCustomerCompany(response['AppCustObj'], response['AppCustCompanyObj'], response['AppCustAddrLegalObj']);
          
          if (response['AppCustObj']['IsExistingCust']) this.disableInput();
        }
      }
    );
  }

  custTypeChange(custType: string = CommonConstant.CustTypePersonal) {
    this.MrCustTypeCode = custType;
    this.CustMainDataForm.controls.MrCustTypeCode.setValue(this.MrCustTypeCode);

    if (custType == CommonConstant.CustTypePersonal) {
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
      this.CustMainDataForm.controls.MobilePhnNo1.clearValidators();
      this.CustMainDataForm.controls.Email1.clearValidators();
      this.CustMainDataForm.controls.MrCustRelationship.setValidators(Validators.required);
    }
    else{
      this.CustMainDataForm.controls.MrCustRelationship.clearValidators();
    }

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
      this.http.post(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerPersonal(response['CustObj'], response['CustPersonalObj'], response['CustAddrLegalObj']);
        });
    } else {
      this.http.post(URLConstant.GetCustCompanyForCopyByCustId, { CustId: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerCompany(response['CustObj'], response['CustCompanyObj'], response['CustAddrLegalObj']);
        });
    }
    await this.disableInput();
  }

  clearExpDt() {
    this.CustMainDataForm.controls.IdExpiredDt.reset();
    this.CustMainDataForm.controls.IdExpiredDt.clearValidators();
  }


  resetInput(custType: string = CommonConstant.CustTypePersonal) {
    this.CustMainDataForm.reset();
    let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
    this.CustMainDataForm.patchValue({
      MrCustTypeCode: custType
    });
    if (custType == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"],
        MrGenderCode: this.GenderObj[0].Key,
        MrMaritalStatCode: this.MaritalStatObj[0].Key,
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

  setDataCustomerPersonal(CustObj, CustPersonalObj, CustAddrLegalObj) {
    if (CustObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        MrIdTypeCode: CustObj.MrIdTypeCode,
        IdNo: CustObj.IdNo,
        IdExpiredDt: formatDate(CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: CustObj.TaxIdNo
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
    }

    if (CustPersonalObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrGenderCode: CustPersonalObj.MrGenderCode,
        MotherMaidenName: CustPersonalObj.MotherMaidenName,
        BirthPlace: CustPersonalObj.BirthPlace,
        BirthDt: formatDate(CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MrMaritalStatCode: CustPersonalObj.MrMaritalStatCode,
        MobilePhnNo1: CustPersonalObj.MobilePhnNo1,
        Email1: CustPersonalObj.Email1,
      });
      
      if(this.inputMode == 'EDIT'){
        this.CustMainDataForm.patchValue({
          MrCustRelationship: this.isIncludeCustRelation ? CustObj.MrCustRelationship : '',
        }) 
      }
    }
    
    this.setDataLegalAddr(CustAddrLegalObj);
  }

  setDataCustomerCompany(CustObj, CustCompanyObj, CustAddrLegalObj) {
    if (CustObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        TaxIdNo: CustObj.TaxIdNo,
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
    }

    if (CustCompanyObj != undefined){
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: CustCompanyObj.MrCompanyTypeCode,
      });

      if(this.inputMode == 'EDIT'){
        this.CustMainDataForm.patchValue({
          MrCustRelationship: this.isIncludeCustRelation ? CustCompanyObj.MrCustRelationship : '',
        }) 
      }
    }
    this.setDataLegalAddr(CustAddrLegalObj);
  }

  setDataLegalAddr(response) {
    if (response != undefined) {
      this.legalAddrObj.Addr = response.Addr;
      this.legalAddrObj.AreaCode1 = response.AreaCode1;
      this.legalAddrObj.AreaCode2 = response.AreaCode2;
      this.legalAddrObj.AreaCode3 = response.AreaCode3;
      this.legalAddrObj.AreaCode4 = response.AreaCode4;
      this.legalAddrObj.City = response.City;
      this.legalAddrObj.Fax = response.Fax;
      this.legalAddrObj.FaxArea = response.FaxArea;
      this.legalAddrObj.Phn1 = response.Phn1;
      this.legalAddrObj.Phn2 = response.Phn2;
      this.legalAddrObj.PhnArea1 = response.PhnArea1;
      this.legalAddrObj.PhnArea2 = response.PhnArea2;
      this.legalAddrObj.PhnExt1 = response.PhnExt1;
      this.legalAddrObj.PhnExt2 = response.PhnExt2;

      this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
      this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
      this.inputAddressObj.default = this.legalAddrObj;
    }
  }

  setDataCustomerPersonalForSave() {
    if (this.MrCustTypeCode != CommonConstant.CustTypePersonal) return;
    this.custDataPersonalObj = new CustMainDataPersonalObj();
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
    this.custDataPersonalObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataPersonalObj.AppCustObj.AppId = this.appId;
    if (this.appCustId)
      this.custDataPersonalObj.AppCustObj.AppCustId = this.appCustId;
    if (this.isIncludeCustRelation)
      this.custDataPersonalObj.AppCustObj.MrCustRelationship = this.CustMainDataForm.controls.MrCustRelationship.value;

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
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea1 = this.CustMainDataForm.controls["Address"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Phn1 = this.CustMainDataForm.controls["Address"]["controls"].Phn1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt1 = this.CustMainDataForm.controls["Address"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea2 = this.CustMainDataForm.controls["Address"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Phn2 = this.CustMainDataForm.controls["Address"]["controls"].Phn2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt2 = this.CustMainDataForm.controls["Address"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea3 = this.CustMainDataForm.controls["Address"]["controls"].PhnArea3.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Phn3 = this.CustMainDataForm.controls["Address"]["controls"].Phn3.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt3 = this.CustMainDataForm.controls["Address"]["controls"].PhnExt3.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.FaxArea = this.CustMainDataForm.controls["Address"]["controls"].FaxArea.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Fax = this.CustMainDataForm.controls["Address"]["controls"].Fax.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;
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
    this.custDataCompanyObj.AppCustObj.AppId = this.appId;
    this.custDataCompanyObj.AppCustObj.IsExistingCust = this.isExisting;
    if (this.appCustId)
      this.custDataCompanyObj.AppCustObj.AppCustId = this.appCustId;
    if (this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrCustRelationship = this.CustMainDataForm.controls.MrCustRelationship.value;

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
    this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea1 = this.CustMainDataForm.controls["Address"]["controls"].PhnArea1.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.Phn1 = this.CustMainDataForm.controls["Address"]["controls"].Phn1.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt1 = this.CustMainDataForm.controls["Address"]["controls"].PhnExt1.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea2 = this.CustMainDataForm.controls["Address"]["controls"].PhnArea2.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.Phn2 = this.CustMainDataForm.controls["Address"]["controls"].Phn2.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt2 = this.CustMainDataForm.controls["Address"]["controls"].PhnExt2.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea3 = this.CustMainDataForm.controls["Address"]["controls"].PhnArea3.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.Phn3 = this.CustMainDataForm.controls["Address"]["controls"].Phn3.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt3 = this.CustMainDataForm.controls["Address"]["controls"].PhnExt3.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.FaxArea = this.CustMainDataForm.controls["Address"]["controls"].FaxArea.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.Fax = this.CustMainDataForm.controls["Address"]["controls"].Fax.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;
  }

  SaveForm() {
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormGroup, ControlContainer, Validators, NgForm } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { formatDate, KeyValue } from '@angular/common';
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

@Component({
  selector: 'app-cust-main-data',
  templateUrl: './cust-main-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustMainDataComponent implements OnInit {
  @Input() custMainDataMode: string;
  @Input() appId: number;
  @Input() appCustId: number;
  @Input() bizTemplateCode: string = "";
  @Input() inputMode: string = "ADD";
  @Output() outputAfterSave: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  isExisting: boolean = false;
  isUcAddressReady: boolean = false;
  isIncludeCustRelation: boolean = false;
  MrCustTypeCode: string;
  subjectTitle: string = 'Customer';
  MaxDate: Date;
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();;
  legalAddrObj: AddrObj = new AddrObj();;
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
    MrRelationshipCustCode: ['', Validators.maxLength(50)],
    CustNo: [],
    CustName: ['', Validators.required],
    CompanyType: [''],
    MrMaritalStatCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', Validators.required],
    IdExpiredDt: [''],
    TaxIdNo: [''],
    MrGenderCode: ['', Validators.required],
    BirthPlace: ['', Validators.required],
    BirthDt: ['', Validators.required],
    MotherMaidenName: ['', Validators.required],
    MrCompanyTypeCode: [''],
  });

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess[CommonConstant.BUSINESS_DT];

    this.initcustMainDataMode();
    this.setLookup();
        
    this.legalAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.title = "Address";
    this.inputAddressObj.showOwnership = true;
    this.isUcAddressReady = true;
    
    this.getRefMasterPersonal();
    if(this.inputMode != 'ADD') this.getCusMaintData();
  }

  initcustMainDataMode()
  {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    if(this.appCustId) this.custDataObj.AppCustId = this.appCustId;

    switch(this.custMainDataMode) {
      case CommonConstant.CustMainDataModeCust:
        this.isIncludeCustRelation = false;
        this.custDataObj.IsCustomer = true;
        this.subjectTitle = 'Customer';
        this.CustMainDataForm.controls.MrRelationshipCustCode.clearValidators();
      break;
      case CommonConstant.CustMainDataModeGuarantor:    
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.CustMainDataForm.controls.MrRelationshipCustCode.setValidators(Validators.required);
      break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.CustMainDataForm.controls.MrRelationshipCustCode.setValidators(Validators.required);
      break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = 'Customer';
    }
  }

  setLookup(value: string = CommonConstant.CustTypePersonal) {
    this.InputLookupCustObj = new InputLookupObj();
    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.isReadonly = false;

    this.ArrAddCrit = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = value;
    this.ArrAddCrit.push(critObj);
    
    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;
    this.InputLookupCustObj.isReady = true;
  }

  getRefMasterPersonal() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.CustMainDataForm.patchValue({
          MrCustTypeCode: this.CustTypeObj[0].Key
        })
        this.custTypeChange(this.CustTypeObj[0].Key, true);
      }
    );

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          var idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.CustMainDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMaritalStat }).subscribe(
      (response) => {
        this.MaritalStatObj = response[CommonConstant.ReturnObj];
        if (this.MaritalStatObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
        }
      }
    );
    
    if(this.isIncludeCustRelation)
    {
      var refCustRelObj = {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship,
        //ReserveField1: CommonConstant.CustTypePersonal,
        RowVersion: ""
      }
      this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, refCustRelObj).subscribe(
        (response) => {
          this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
          if (this.inputMode != "EDIT") 
            this.CustMainDataForm.patchValue({ MrRelationshipCustCode: this.MrCustRelationshipObj[0].Key });
        }
      );
    }
  
  }

  getRefMasterCompany() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      }
    );
  
    if(this.isIncludeCustRelation)
    {
      var refCustRelObj = {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustCompanyRelationship,
        //ReserveField1: CommonConstant.CustTypePersonal,
        RowVersion: ""
      }
      this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, refCustRelObj).subscribe(
        (response) => {
          this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
          if (this.inputMode != "EDIT") 
            this.CustMainDataForm.patchValue({ MrRelationshipCustCode: this.MrCustRelationshipObj[0].Key });
        }
      );
    }
  }

  getCusMaintData() 
  {
    this.http.post(URLConstant.GetAppCustMainDataByAppId, this.custDataObj).subscribe(
      (response) => {
        if (response['AppCustObj']) 
        {
          this.MrCustTypeCode = response['AppCustObj']['MrCustTypeCode'];
          if(!this.appCustId) this.appCustId = response['AppCustObj']['AppCustId']
          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) 
            this.setDataCustomerPersonal(response['AppCustObj'], response['AppCustPersonalObj'], response['AppCustAddrLegalObj']);
          else
            this.setDataCustomerCompany(response['AppCustObj'], response['AppCustCompanyObj'], response['AppCustAddrLegalObj']);

          if(response['AppCustObj']['IsExistingCust']) this.disableInput();
        }
      }
    );
  }

  custTypeChange(value: string = CommonConstant.CustTypePersonal, firstInit: boolean = false) {
    this.MrCustTypeCode = value;
    this.setLookup(value);
    
    if (!firstInit) {
      this.CustMainDataForm.enable();
      if (value == CommonConstant.CustTypePersonal) {
        this.getRefMasterPersonal();
        this.CustMainDataForm.controls.MotherMaidenName.setValidators(Validators.required);
        this.CustMainDataForm.controls.BirthDt.setValidators(Validators.required);
        this.CustMainDataForm.controls.BirthPlace.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrIdTypeCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.IdNo.setValidators(Validators.required);
        this.CustMainDataForm.controls.TaxIdNo.clearValidators();
      } else {
        this.getRefMasterCompany();
        this.CustMainDataForm.controls.TaxIdNo.setValidators(Validators.required);
        this.CustMainDataForm.controls.MotherMaidenName.clearValidators();
        this.CustMainDataForm.controls.BirthDt.clearValidators();
        this.CustMainDataForm.controls.BirthPlace.clearValidators();
        this.CustMainDataForm.controls.MrIdTypeCode.clearValidators();
        this.CustMainDataForm.controls.MrGenderCode.clearValidators();
        this.CustMainDataForm.controls.IdNo.clearValidators();
      }
      if(this.isIncludeCustRelation)
        this.CustMainDataForm.controls.MrRelationshipCustCode.setValidators(Validators.required);
      else
       this.CustMainDataForm.controls.MrRelationshipCustCode.clearValidators();
       
      this.CustMainDataForm.updateValueAndValidity();
      this.clearInput();
    }
  }

  copyCustomerEvent(event) {
    if (event.MrCustTypeCode == CommonConstant.CustTypePersonal){
      this.http.post(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
        (response) => {
            this.setDataCustomerPersonal(response['CustObj'], response['CustPersonalObj'], response['CustAddrLegalObj']);
        });
    }else{
      this.http.post(URLConstant.GetCustCompanyForCopyByCustId, { CustId: event.CustId }).subscribe(
        (response) => {
            this.setDataCustomerCompany(response['CustObj'], response['CustCompanyObj'], response['CustAddrLegalObj']);
        });
    }
    this.disableInput();
  }

  disableInput(){
    this.CustMainDataForm.controls.MrCustTypeCode.disable();
    this.CustMainDataForm.controls.CustName.disable();
    this.CustMainDataForm.controls.CompanyType.disable();
    this.CustMainDataForm.controls.MrMaritalStatCode.disable();
    this.CustMainDataForm.controls.MrIdTypeCode.disable();
    this.CustMainDataForm.controls.IdNo.disable();
    this.CustMainDataForm.controls.IdExpiredDt.disable();
    this.CustMainDataForm.controls.TaxIdNo.disable();
    this.CustMainDataForm.controls.MrGenderCode.disable();
    this.CustMainDataForm.controls.BirthPlace.disable();
    this.CustMainDataForm.controls.BirthDt.disable();
    this.CustMainDataForm.controls.MotherMaidenName.disable();
    this.CustMainDataForm.controls.MrCompanyTypeCode.disable();
    this.CustMainDataForm.controls.Address["controls"]["MrHouseOwnershipCode"].disable();
    this.inputAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = true;
  }

  clearInput(){
    this.CustMainDataForm.patchValue({
      BirthDt: '',
      BirthPlace: '',
      IdNo: '',
      IdExpiredDt: '',
      TaxIdNo: '',
      MotherMaidenName: '',
    });
  }

  setDataCustomerPersonal(CustObj, CustPersonalObj, CustAddrLegalObj) {
    if (CustObj) {
      this.CustMainDataForm.patchValue({
        CustName: CustObj.CustName,
        CustNo: CustObj.CustNo,
        MrIdTypeCode: CustObj.MrIdTypeCode,
        MrRelationshipCustCode: this.isIncludeCustRelation ? CustObj.MrRelationshipCustCode : '',
        IdNo: CustObj.IdNo,
        IdExpiredDt: formatDate(CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: CustObj.TaxIdNo
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
    }

    if (CustPersonalObj) {
      this.CustMainDataForm.patchValue({
        MrGenderCode: CustPersonalObj.MrGenderCode,
        MotherMaidenName: CustPersonalObj.MotherMaidenName,
        BirthPlace: CustPersonalObj.BirthPlace,
        BirthDt: formatDate(CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MrMaritalStatCode: CustPersonalObj.MrMaritalStatCode,
      });
    }
    this.setDataLegalAddr(CustAddrLegalObj);
  }

  setDataCustomerCompany(CustObj, CustCompanyObj, CustAddrLegalObj) {
    if (CustObj != undefined) {
      this.CustMainDataForm.patchValue({
        CustName: CustObj.CustName,
        CustNo: CustObj.CustNo,
        TaxIdNo: CustObj.TaxIdNo,
        MrRelationshipCustCode: this.isIncludeCustRelation ? CustObj.MrRelationshipCustCode : '',
      });
      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
    }

    if (CustCompanyObj != undefined){
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: CustCompanyObj.MrCompanyTypeCode,
      });
    }
    this.setDataLegalAddr(CustAddrLegalObj);
  }

  setDataLegalAddr(response){
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
      this.legalAddrObj.MrHouseOwnershipCode = response.MrBuildingOwnershipCode;

      this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
      this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
      this.inputAddressObj.default = this.legalAddrObj;
    }
  }

  setDataCustomerPersonalForSave(){
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
    this.custDataPersonalObj.AppCustObj.IsExistingCust = (this.custDataPersonalObj.AppCustObj.CustNo != "" && this.custDataPersonalObj.AppCustObj.CustNo != undefined);
    this.custDataPersonalObj.AppCustObj.AppId = this.appId;
    if(this.appCustId)
      this.custDataPersonalObj.AppCustObj.AppCustId = this.appCustId;
    if(this.isIncludeCustRelation)
      this.custDataPersonalObj.AppCustObj.MrRelationshipCustCode = this.CustMainDataForm.controls.MrRelationshipCustCode.value;

    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustMainDataForm.controls.MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustMainDataForm.controls.MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustMainDataForm.controls.BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustMainDataForm.controls.BirthDt.value;

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
    this.custDataPersonalObj.AppCustAddrLegalObj.MrHouseOwnershipCode = this.CustMainDataForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;
  }

  setDataCustomerCompanyForSave(){
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
    this.custDataCompanyObj.AppCustObj.IsExistingCust = (this.custDataCompanyObj.AppCustObj.CustNo != "" && this.custDataCompanyObj.AppCustObj.CustNo != undefined);
    if(this.appCustId)
      this.custDataCompanyObj.AppCustObj.AppCustId = this.appCustId;
    if(this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrRelationshipCustCode = this.CustMainDataForm.controls.MrRelationshipCustCode.value;

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
    this.custDataCompanyObj.AppCustAddrLegalObj.MrHouseOwnershipCode = this.CustMainDataForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;
  }

  
  SaveForm(enjiForm: NgForm) {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal)
    {
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
    else{
      this.setDataCustomerCompanyForSave();
      this.http.post(URLConstant.AddEditCustMainDataCompany, this.custDataCompanyObj).subscribe(
        (response) => {
          if (response["StatusCode"] == 200) {
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
    /*
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log(this.appId)
    console.log(this.custDataPersonalObj)
    this.outputTab.emit(this.MrCustTypeCode);
    return;
    enjiForm.resetForm();
    this.inputAddressObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = false;
    this.CustMainDataForm.controls.Address["controls"]["MrHouseOwnershipCode"].enable();
    this.custTypeChange();
    */
  }

  cancel() {
    this.outputCancel.emit();
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustCompanyMgmntShrholderObj } from 'app/shared/model/AppCustCompanyMgmntShrholderObj.Model';

@Component({
  selector: 'app-cust-shareholder',
  templateUrl: './cust-shareholder.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustShareholderComponent implements OnInit {

  @Input() listShareholder: Array<AppCustCompanyMgmntShrholderObj> = new Array<AppCustCompanyMgmntShrholderObj>();

  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: any;
  currentEditedIndex: any;
  selectedCustNo: any;
  selectedIndustryTypeCode: any;

  closeResult: any;
  appCustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;

  refMasterObj = {
    RefMasterTypeCode: ""
  };

  industryTypeObj = {
    IndustryTypeCode: ""
  };
  
  InputLookupCustomerObj: any;
  InputLookupIndustryTypeObj: any;

  CustTypeObj: any;
  defaultCustType: any;
  GenderObj: any;
  defaultGender: any;
  IdTypeObj: any;
  defaultIdType: any;
  JobPositionObj: any;
  defaultJobPosition: any;
  CompanyTypeObj: any;
  defaultCompanyType: any;
  industryTypeName: any;
  isCust: boolean = false;
  selectedCustTypeName: any;
  selectedJobPositionName: any;
  defaultCustTypeName: any;
  defaultJobPositionName: any;



  CustShareholderForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    BirthPlace: ['', Validators.maxLength(200)],
    BirthDt: ['', Validators.required],
    IdNo: ['', Validators.maxLength(50)],
    TaxIdNo: ['', Validators.maxLength(50)],
    IdExpiredDt: [''],
    MobilePhnNo: ['', Validators.maxLength(50)],
    Email: ['', Validators.maxLength(50)],
    SharePrcnt: [0, [Validators.min(0),Validators.max(100), Validators.pattern("^[0-9]+$")]],
    MrJobPositionCode: ['', Validators.maxLength(50)],
    IsSigner: [false],
    MrCompanyTypeCode: ['', Validators.maxLength(50)],
    EstablishmentDt: ['', Validators.required]
  });


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal,) {

     }

  UserAccess: any;
  MaxDate: Date;
  Max17YO: Date;
  ngOnInit() {
    // console.log("User Access");
    // console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.Max17YO = new Date(this.UserAccess.BusinessDt);
    this.Max17YO.setFullYear(this.MaxDate.getFullYear()-17);
    // console.log(this.MaxDate);
    // console.log(this.Max17YO);

    this.initLookup();
    this.bindAllRefMasterObj();
  }

  SaveForm(){
    this.appCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj();
    if(this.listShareholder == undefined){
      this.listShareholder = new Array<AppCustCompanyMgmntShrholderObj>();
    }
    if(this.setAppCustCompanyMgmntShrholder() == false) return;
    if(this.mode == "add"){
      if(this.checkSharePrcnt(-1) == false){
        this.toastr.warningMessage("Total Share Percentage cannot be more than 100.");
        return;
      }
      this.listShareholder.push(this.appCustCompanyMgmntShrholderObj);
    }
    if(this.mode == "edit"){
      if(this.checkSharePrcnt(this.currentEditedIndex) == false){
        this.toastr.warningMessage("Total Share Percentage cannot be more than 100.");
        return;
      }
      this.listShareholder[this.currentEditedIndex] = this.appCustCompanyMgmntShrholderObj;
    }
    this.callbackSubmit.emit(this.listShareholder);
    this.modalService.dismissAll();
    this.clearForm();
  }

  checkSharePrcnt(currentEditedIndex){
    var sharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
    var totalPrcnt = 0;

    for(let i = 0; i < this.listShareholder.length; i++){
      if(currentEditedIndex == -1 || currentEditedIndex != i){
        totalPrcnt += this.listShareholder[i].SharePrcnt;
      }
    }

    if(sharePrcnt + totalPrcnt > 100){
      return false;
    }
    return true;
  }

  CustTypeChanged(event){
    this.setCriteriaLookupCustomer(event.value);
    this.setValidator(event.value);
    this.selectedCustTypeName = this.CustTypeObj.find(x => x.Key == event.value).Value;
    this.CustShareholderForm.controls.MrGenderCode.enable();
    this.CustShareholderForm.controls.MrIdTypeCode.enable();
    this.CustShareholderForm.controls.IdExpiredDt.enable();
    this.CustShareholderForm.controls.IdNo.enable();
    this.CustShareholderForm.controls.BirthPlace.enable();
    this.CustShareholderForm.controls.BirthDt.enable();
    this.CustShareholderForm.controls.MrGenderCode.enable();
    this.CustShareholderForm.controls.TaxIdNo.enable();
    this.CustShareholderForm.controls.IdExpiredDt.enable();
    this.CustShareholderForm.controls.MrCompanyTypeCode.enable();
    this.CustShareholderForm.controls.EstablishmentDt.enable();
    this.CustShareholderForm.controls.TaxIdNo.enable();
    this.isCust = false;

  }

  JobPositionChanged(event){
    this.selectedJobPositionName = event.target.options[event.target.options.selectedIndex].text;
  }

  setCriteriaLookupCustomer(custTypeCode){
    this.initLookup();
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }

  add(content){
    this.mode = "add";
    this.clearForm();
    this.setCriteriaLookupCustomer(this.defaultCustType);
    this.open(content);
  }

  edit(i, content){
    this.clearForm();
    this.mode = "edit";
    this.currentEditedIndex = i;

    if(this.listShareholder[i].MrCustTypeCode == AdInsConstant.CustTypePersonal){
      this.CustShareholderForm.patchValue({
        MrCustTypeCode: this.listShareholder[i].MrCustTypeCode,
        MrGenderCode: this.listShareholder[i].MrGenderCode,
        MrIdTypeCode: this.listShareholder[i].MrIdTypeCode,
        BirthPlace: this.listShareholder[i].BirthPlace,
        BirthDt: this.listShareholder[i].BirthDt != undefined && this.listShareholder[i].BirthDt != "" ? formatDate(this.listShareholder[i].BirthDt, 'yyyy-MM-dd', 'en-US') : '',
        IdNo: this.listShareholder[i].IdNo,
        TaxIdNo: this.listShareholder[i].TaxIdNo,
        IdExpiredDt: this.listShareholder[i].IdExpiredDt != undefined && this.listShareholder[i].IdExpiredDt != "" ? formatDate(this.listShareholder[i].IdExpiredDt, 'yyyy-MM-dd', 'en-US') : '',
        MobilePhnNo: this.listShareholder[i].MobilePhnNo,
        Email: this.listShareholder[i].Email,
        SharePrcnt: this.listShareholder[i].SharePrcnt,
        MrJobPositionCode: this.listShareholder[i].MrJobPositionCode,
        IsSigner: this.listShareholder[i].IsSigner
      });
      if(this.listShareholder[i].CustNo != undefined && this.listShareholder[i].CustNo != ""){
        this.InputLookupCustomerObj.isReadonly = true;
        this.CustShareholderForm.controls.MrGenderCode.disable();
        this.CustShareholderForm.controls.MrIdTypeCode.disable();
        this.CustShareholderForm.controls.IdExpiredDt.disable();
        this.CustShareholderForm.controls.IdNo.disable();
        this.CustShareholderForm.controls.BirthPlace.disable();
        this.CustShareholderForm.controls.BirthDt.disable();
        this.CustShareholderForm.controls.MrGenderCode.disable();
        this.CustShareholderForm.controls.TaxIdNo.disable();
        this.CustShareholderForm.controls.IdExpiredDt.disable();
      }
      this.selectedJobPositionName = this.listShareholder[i].JobPositionName;
      this.selectedCustTypeName = this.listShareholder[i].CustTypeName;
      this.setCriteriaLookupCustomer(this.listShareholder[i].MrCustTypeCode);
    }

    if(this.listShareholder[i].MrCustTypeCode == AdInsConstant.CustTypeCompany){
      this.CustShareholderForm.patchValue({
        MrCustTypeCode: this.listShareholder[i].MrCustTypeCode,
        MrCompanyTypeCode: this.listShareholder[i].MrCompanyTypeCode,
        EstablishmentDt: this.listShareholder[i].EstablishmentDt != undefined && this.listShareholder[i].EstablishmentDt != "" ? formatDate(this.listShareholder[i].EstablishmentDt, 'yyyy-MM-dd', 'en-US') : '',
        TaxIdNo: this.listShareholder[i].TaxIdNo,
        SharePrcnt: this.listShareholder[i].SharePrcnt,
        IsSigner: this.listShareholder[i].IsSigner
      });
      this.selectedCustTypeName = this.listShareholder[i].CustTypeName;
      this.selectedJobPositionName = this.defaultJobPositionName;
      this.selectedIndustryTypeCode = this.listShareholder[i].IndustryTypeCode;
      this.setIndustryTypeName(this.listShareholder[i].IndustryTypeCode);
      this.setCriteriaLookupCustomer(this.listShareholder[i].MrCustTypeCode);
      if(this.listShareholder[i].CustNo != undefined && this.listShareholder[i].CustNo != ""){
        this.InputLookupCustomerObj.isReadonly = true;
        this.CustShareholderForm.controls.MrCompanyTypeCode.disable();
        this.CustShareholderForm.controls.EstablishmentDt.disable();
        this.CustShareholderForm.controls.TaxIdNo.disable();
        this.isCust = true;
      }
    }

    this.InputLookupCustomerObj.nameSelect = this.listShareholder[i].MgmntShrholderName;
    this.InputLookupCustomerObj.jsonSelect = {CustName: this.listShareholder[i].MgmntShrholderName};
    this.selectedCustNo = this.listShareholder[i].CustNo;
    this.setValidator(this.listShareholder[i].MrCustTypeCode);
    this.open(content);
  }

  delete(i){
    if (confirm("Are you sure to delete this record?")) {
      this.listShareholder.splice(i, 1);
      this.callbackSubmit.emit(this.listShareholder);
    }
  }

  clearForm(){
    this.CustShareholderForm = this.fb.group({
      MrCustTypeCode: [this.defaultCustType, [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: [this.defaultGender, [Validators.required, Validators.maxLength(50)]],
      MrIdTypeCode: [this.defaultIdType, Validators.maxLength(50)],
      BirthPlace: ['', Validators.maxLength(200)],
      BirthDt: ['', Validators.required],
      IdNo: ['', Validators.maxLength(50)],
      TaxIdNo: ['', Validators.maxLength(50)],
      IdExpiredDt: [''],
      MobilePhnNo: ['', Validators.maxLength(50)],
      Email: ['', [Validators.maxLength(50), Validators.email]],
      SharePrcnt: [0, [Validators.min(0),Validators.max(100)]],
      MrJobPositionCode: [this.defaultJobPosition, Validators.maxLength(50)],
      IsSigner: [false],
      MrCompanyTypeCode: [this.defaultCompanyType, Validators.maxLength(50)],
      EstablishmentDt: ['', Validators.required]
    });
    this.selectedCustNo = "";
    this.selectedJobPositionName = this.defaultJobPositionName;
    this.selectedCustTypeName = this.defaultCustTypeName;
    this.initLookup();
    this.setValidator(this.defaultCustType);
    this.isCust = false;
  }

  CopyCustomer(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;

    var custObj = {CustId: event.CustId};
    var url;

    if(event.MrCustTypeCode == AdInsConstant.CustTypePersonal){
      url = AdInsConstant.GetCustPersonalForCopyMgmntShrholderByCustId;
    }
    if(event.MrCustTypeCode == AdInsConstant.CustTypeCompany){
      url = AdInsConstant.GetCustCompanyForCopyMgmntShrholderByCustId;
    }

    this.http.post(url, custObj).subscribe(
      (response) => {
        console.log(response);

        if(event.MrCustTypeCode == AdInsConstant.CustTypePersonal){
          if(response["CustObj"] != undefined){
            this.CustShareholderForm.patchValue({
              MrCustTypeCode: response["CustObj"].MrCustTypeCode,
              MrIdTypeCode: response["CustObj"].MrIdTypeCode,
              IdNo: response["CustObj"].IdNo,
              TaxIdNo: response["CustObj"].TaxIdNo,
              IdExpiredDt: response["CustObj"].IdExpiredDt != undefined ? formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US') : ''
            });
            this.selectedCustTypeName = this.CustTypeObj.find(x => x.Key == response["CustObj"].MrCustTypeCode).Value;
          }

          if(response["CustPersonalObj"] != undefined){
            this.CustShareholderForm.patchValue({
              MrGenderCode: response["CustPersonalObj"].MrGenderCode,
              BirthPlace: response["CustPersonalObj"].BirthPlace,
              BirthDt: response["CustPersonalObj"].BirthDt != undefined ? formatDate(response["CustPersonalObj"].BirthDt, 'yyyy-MM-dd', 'en-US') : '',
              MobilePhnNo: response["CustPersonalObj"].MobilePhnNo1,
              Email: response["CustPersonalObj"].Email1
            });
          }

          if(response["CustPersonalJobDataObj"] != undefined){
            this.CustShareholderForm.patchValue({
              MrJobPositionCode: response["CustPersonalJobDataObj"].MrJobPositionCode,
            });
            this.selectedJobPositionName = this.JobPositionObj.find(x => x.Key == response["CustPersonalJobDataObj"].MrJobPositionCode).Value;
          }

          this.CustShareholderForm.controls.MrGenderCode.disable();
          this.CustShareholderForm.controls.MrIdTypeCode.disable();
          this.CustShareholderForm.controls.IdExpiredDt.disable();
          this.CustShareholderForm.controls.IdNo.disable();
          this.CustShareholderForm.controls.BirthPlace.disable();
          this.CustShareholderForm.controls.BirthDt.disable();
          this.CustShareholderForm.controls.MrGenderCode.disable();
          this.CustShareholderForm.controls.TaxIdNo.disable();

        }

        if(event.MrCustTypeCode == AdInsConstant.CustTypeCompany){
          if(response["CustObj"] != undefined){
            this.CustShareholderForm.patchValue({
              MrCustTypeCode: response["CustObj"].MrCustTypeCode,
              TaxIdNo: response["CustObj"].TaxIdNo
            });
            this.selectedCustTypeName = this.CustTypeObj.find(x => x.Key == response["CustObj"].MrCustTypeCode).Value;

          }
          if(response["CustCompanyObj"] != undefined){
            this.CustShareholderForm.patchValue({
              MrCompanyTypeCode: response["CustCompanyObj"].MrCompanyTypeCode,
              EstablishmentDt: formatDate(response["CustCompanyObj"].EstablishmentDt, 'yyyy-MM-dd', 'en-US'),
            });
          }
          this.selectedJobPositionName = "";
          this.selectedIndustryTypeCode = response["CustCompanyObj"].IndustryTypeCode;
          this.setIndustryTypeName(response["CustCompanyObj"].IndustryTypeCode); 
          this.CustShareholderForm.controls.MrCompanyTypeCode.disable();
          this.CustShareholderForm.controls.EstablishmentDt.disable();
          this.CustShareholderForm.controls.TaxIdNo.disable();
          this.isCust = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setAppCustCompanyMgmntShrholder(){
    var flag:boolean = true;
    if(this.CustShareholderForm.controls.MrCustTypeCode.value == AdInsConstant.CustTypePersonal){
      this.appCustCompanyMgmntShrholderObj.MrCustTypeCode = this.CustShareholderForm.controls.MrCustTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.CustTypeName = this.selectedCustTypeName;
      this.appCustCompanyMgmntShrholderObj.MrGenderCode = this.CustShareholderForm.controls.MrGenderCode.value;
      this.appCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustShareholderForm.controls.lookupCustomerShareholder.value.value;
      this.appCustCompanyMgmntShrholderObj.CustNo = this.selectedCustNo;
      this.appCustCompanyMgmntShrholderObj.MrIdTypeCode = this.CustShareholderForm.controls.MrIdTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.BirthPlace = this.CustShareholderForm.controls.BirthPlace.value;
      this.appCustCompanyMgmntShrholderObj.BirthDt = this.CustShareholderForm.controls.BirthDt.value;
      this.appCustCompanyMgmntShrholderObj.IdNo = this.CustShareholderForm.controls.IdNo.value;
      this.appCustCompanyMgmntShrholderObj.TaxIdNo = this.CustShareholderForm.controls.TaxIdNo.value;
      this.appCustCompanyMgmntShrholderObj.IdExpiredDt = this.CustShareholderForm.controls.IdExpiredDt.value;
      let d1 = new Date(this.appCustCompanyMgmntShrholderObj.IdExpiredDt);
      let d2 = new Date(this.MaxDate);
      let d3 = new Date(this.appCustCompanyMgmntShrholderObj.BirthDt);
      let d4 = new Date(this.Max17YO);
      if(d1<d2){
        this.toastr.warningMessage("Id Expired Date can not be less than Business Date");
        flag = false;
      }
      if(d3>d4){
        // this.toastr.warningMessage("Birth Date can not be more than " + this.Max17YO);
        this.toastr.warningMessage("Customer age must be at least 17 year old");
        flag = false;
      }
      this.appCustCompanyMgmntShrholderObj.MobilePhnNo = this.CustShareholderForm.controls.MobilePhnNo.value;
      this.appCustCompanyMgmntShrholderObj.Email = this.CustShareholderForm.controls.Email.value;
      this.appCustCompanyMgmntShrholderObj.SharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
      this.appCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustShareholderForm.controls.MrJobPositionCode.value;
      this.appCustCompanyMgmntShrholderObj.JobPositionName = this.selectedJobPositionName;
      this.appCustCompanyMgmntShrholderObj.IsSigner = this.CustShareholderForm.controls.IsSigner.value;
    }

    if(this.CustShareholderForm.controls.MrCustTypeCode.value == AdInsConstant.CustTypeCompany){
      this.appCustCompanyMgmntShrholderObj.MrCustTypeCode = this.CustShareholderForm.controls.MrCustTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.CustTypeName = this.selectedCustTypeName;
      this.appCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustShareholderForm.controls.lookupCustomerShareholder.value.value;
      this.appCustCompanyMgmntShrholderObj.CustNo = this.selectedCustNo;
      this.appCustCompanyMgmntShrholderObj.IndustryTypeCode = this.selectedIndustryTypeCode;
      this.appCustCompanyMgmntShrholderObj.MrCompanyTypeCode = this.CustShareholderForm.controls.MrCompanyTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustShareholderForm.controls.EstablishmentDt.value;
      this.appCustCompanyMgmntShrholderObj.TaxIdNo = this.CustShareholderForm.controls.TaxIdNo.value;
      this.appCustCompanyMgmntShrholderObj.SharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
    }

    return flag;
  }

  GetIndustryType(event){
    this.selectedIndustryTypeCode = event.IndustryTypeCode;
  }

  setIndustryTypeName(industryTypeCode){
    this.industryTypeObj.IndustryTypeCode = industryTypeCode;
    this.http.post(AdInsConstant.GetRefIndustryTypeByCode, this.industryTypeObj).subscribe(
      (response) => {
        console.log(response);
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.industryTypeName = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;     
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setValidator(custType){
    if(custType == AdInsConstant.CustTypePersonal){
      this.CustShareholderForm.controls.BirthDt.setValidators(Validators.required);
      this.CustShareholderForm.controls.BirthDt.updateValueAndValidity();
      this.CustShareholderForm.controls.EstablishmentDt.clearValidators();
      this.CustShareholderForm.controls.EstablishmentDt.updateValueAndValidity();
    }

    if(custType == AdInsConstant.CustTypeCompany){
      this.CustShareholderForm.controls.BirthDt.clearValidators();
      this.CustShareholderForm.controls.BirthDt.updateValueAndValidity();
      this.CustShareholderForm.controls.EstablishmentDt.setValidators(Validators.required);
      this.CustShareholderForm.controls.EstablishmentDt.updateValueAndValidity();
    }
  }

  initLookup(){
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.isRequired = false;

  }

  bindAllRefMasterObj(){
    this.bindCustTypeObj();
    this.bindGenderObj();
    this.bindIdTypeObj();
    this.bindJobPositionObj();
    this.bindCompanyTypeObj();
  }

  bindCustTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CustTypeObj = response["ReturnObject"];
        if(this.CustTypeObj.length > 0){
          this.defaultCustType = this.CustTypeObj[0].Key;
          this.defaultCustTypeName = this.CustTypeObj[0].Value;
          this.setValidator(this.CustTypeObj[0].Key);
        }
      }
    );
  }

  bindGenderObj(){
    this.refMasterObj.RefMasterTypeCode = "GENDER";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.GenderObj = response["ReturnObject"];
        if(this.GenderObj.length > 0){
          this.defaultGender = this.GenderObj[0].Key
        }
      }
    );
  }

  bindIdTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response["ReturnObject"];
        if(this.IdTypeObj.length > 0){
          this.defaultIdType = this.IdTypeObj[0].Key
        }
      }
    );
  }

  bindJobPositionObj(){
    this.refMasterObj.RefMasterTypeCode = "JOB_POSITION";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobPositionObj = response["ReturnObject"];
        if(this.JobPositionObj.length > 0){
          this.defaultJobPosition = this.JobPositionObj[0].Key;
          this.defaultJobPositionName = this.JobPositionObj[0].Value;
        }
      }
    );
  }

  bindCompanyTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "COMPANY_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyTypeObj = response["ReturnObject"];
        if(this.CompanyTypeObj.length > 0){
          this.defaultCompanyType = this.CompanyTypeObj[0].Key;
        }
      }
    );
  }


  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancel()
  {
    this.modalService.dismissAll();
  }

  clearExpDt(){
    if(this.CustShareholderForm.value.MrIdTypeCode == "EKTP"){
      this.CustShareholderForm.patchValue({
        IdExpiredDt: ''
      });
    }
  }



}

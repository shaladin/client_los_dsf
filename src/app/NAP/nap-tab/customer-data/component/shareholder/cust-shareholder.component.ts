import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';

import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestCriteriaObj } from 'app/shared/model/RequestCriteriaObj.model';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustBankStmntObj } from 'app/shared/model/AppCustBankStmntObj.Model';
import { AppCustCompanyMgmntShrholderObj } from 'app/shared/model/AppCustCompanyMgmntShrholderObj.Model';

@Component({
  selector: 'app-cust-shareholder',
  templateUrl: './cust-shareholder.component.html',
  styleUrls: ['./cust-shareholder.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustShareholderComponent implements OnInit {

  @Input() listShareholder: any = new Array<AppCustCompanyMgmntShrholderObj>();

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




  CustShareholderForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    BirthPlace: ['', Validators.maxLength(200)],
    BirthDt: [''],
    IdNo: ['', Validators.maxLength(50)],
    TaxIdNo: ['', Validators.maxLength(50)],
    IdExpiredDt: [''],
    MobilePhnNo: ['', Validators.maxLength(50)],
    Email: ['', Validators.maxLength(50)],
    SharePrcnt: [0],
    MrJobPositionCode: ['', Validators.maxLength(50)],
    IsSigner: [false],
    MrCompanyTypeCode: ['', Validators.maxLength(50)],
    EstablishmentDt: ['']
  });


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,) {

     }

  ngOnInit() {
    this.initLookup();
    this.bindAllRefMasterObj();
  }

  SaveForm(){
    this.appCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj();
    if(this.listShareholder == undefined){
      this.listShareholder = new Array<AppCustCompanyMgmntShrholderObj>();
    }
    this.setAppCustCompanyMgmntShrholder();
    if(this.mode == "add"){
      this.listShareholder.push(this.appCustCompanyMgmntShrholderObj);
    }
    if(this.mode == "edit"){
      this.listShareholder[this.currentEditedIndex] = this.appCustCompanyMgmntShrholderObj;
    }
    this.callbackSubmit.emit(this.listShareholder);
    this.modalService.dismissAll();
    this.clearForm();
  }

  add(content){
    this.mode = "add";
    this.clearForm();
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
        BirthDt: this.listShareholder[i].BirthDt,
        IdNo: this.listShareholder[i].IdNo,
        TaxIdNo: this.listShareholder[i].TaxIdNo,
        IdExpiredDt: this.listShareholder[i].IdExpiredDt,
        MobilePhnNo: this.listShareholder[i].MobilePhnNo,
        Email: this.listShareholder[i].Email,
        SharePrcnt: this.listShareholder[i].SharePrcnt,
        MrJobPositionCode: this.listShareholder[i].MrJobPositionCode,
        IsSigner: this.listShareholder[i].IsSigner
      });
    }

    if(this.listShareholder[i].MrCustTypeCode == AdInsConstant.CustTypeCompany){
      this.CustShareholderForm.patchValue({
        MrCustTypeCode: this.listShareholder[i].MrCustTypeCode,
        MrCompanyTypeCode: this.listShareholder[i].MrCompanyTypeCode,
        EstablishmentDt: formatDate(this.listShareholder[i].EstablishmentDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: this.listShareholder[i].TaxIdNo,
        SharePrcnt: this.listShareholder[i].SharePrcnt,
        IsSigner: this.listShareholder[i].IsSigner
      });

      this.selectedIndustryTypeCode = this.listShareholder[i].IndustryTypeCode;
      this.setIndustryTypeName(this.listShareholder[i].IndustryTypeCode);
    }
    this.InputLookupCustomerObj.nameSelect = this.listShareholder[i].MgmntShrholderName;
    this.InputLookupCustomerObj.jsonSelect = {CustName: this.listShareholder[i].MgmntShrholderName};
    this.selectedCustNo = this.listShareholder[i].CustNo;
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
      BirthDt: [''],
      IdNo: ['', Validators.maxLength(50)],
      TaxIdNo: ['', Validators.maxLength(50)],
      IdExpiredDt: [''],
      MobilePhnNo: ['', Validators.maxLength(50)],
      Email: ['', Validators.maxLength(50)],
      SharePrcnt: [0],
      MrJobPositionCode: [this.defaultJobPosition, Validators.maxLength(50)],
      IsSigner: [false],
      MrCompanyTypeCode: [this.defaultCompanyType, Validators.maxLength(50)],
      EstablishmentDt: ['']
    });
    this.selectedCustNo = "";
    this.initLookup();
  }

  CopyCustomer(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;
  }

  setAppCustCompanyMgmntShrholder(){
    if(this.CustShareholderForm.controls.MrCustTypeCode.value == AdInsConstant.CustTypePersonal){
      this.appCustCompanyMgmntShrholderObj.MrCustTypeCode = this.CustShareholderForm.controls.MrCustTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.MrGenderCode = this.CustShareholderForm.controls.MrGenderCode.value;
      this.appCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustShareholderForm.controls.lookupCustomerShareholder.value.value;
      this.appCustCompanyMgmntShrholderObj.CustNo = this.selectedCustNo;
      this.appCustCompanyMgmntShrholderObj.MrIdTypeCode = this.CustShareholderForm.controls.MrIdTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.BirthPlace = this.CustShareholderForm.controls.BirthPlace.value;
      this.appCustCompanyMgmntShrholderObj.BirthDt = this.CustShareholderForm.controls.BirthDt.value;
      this.appCustCompanyMgmntShrholderObj.IdNo = this.CustShareholderForm.controls.IdNo.value;
      this.appCustCompanyMgmntShrholderObj.TaxIdNo = this.CustShareholderForm.controls.TaxIdNo.value;
      this.appCustCompanyMgmntShrholderObj.IdExpiredDt = this.CustShareholderForm.controls.IdExpiredDt.value;
      this.appCustCompanyMgmntShrholderObj.MobilePhnNo = this.CustShareholderForm.controls.MobilePhnNo.value;
      this.appCustCompanyMgmntShrholderObj.Email = this.CustShareholderForm.controls.Email.value;
      this.appCustCompanyMgmntShrholderObj.SharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
      this.appCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustShareholderForm.controls.MrJobPositionCode.value;
      this.appCustCompanyMgmntShrholderObj.IsSigner = this.CustShareholderForm.controls.IsSigner.value;
    }

    if(this.CustShareholderForm.controls.MrCustTypeCode.value == AdInsConstant.CustTypeCompany){
      this.appCustCompanyMgmntShrholderObj.MrCustTypeCode = this.CustShareholderForm.controls.MrCustTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustShareholderForm.controls.lookupCustomerShareholder.value.value;
      this.appCustCompanyMgmntShrholderObj.CustNo = this.selectedCustNo;
      this.appCustCompanyMgmntShrholderObj.IndustryTypeCode = this.selectedIndustryTypeCode;
      this.appCustCompanyMgmntShrholderObj.MrCompanyTypeCode = this.CustShareholderForm.controls.MrCompanyTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustShareholderForm.controls.EstablishmentDt.value;
      this.appCustCompanyMgmntShrholderObj.TaxIdNo = this.CustShareholderForm.controls.TaxIdNo.value;
      this.appCustCompanyMgmntShrholderObj.SharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
    }
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
        this.InputLookupIndustryTypeObj.jsonSelect = response;     
      },
      (error) => {
        console.log(error);
      }
    );
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
        console.log("bind cust type");
        console.log(this.CustTypeObj);
        if(this.CustTypeObj.length > 0){
          this.defaultCustType = this.CustTypeObj[0].Key;
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
          this.defaultJobPosition = this.JobPositionObj[0].Key
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





}

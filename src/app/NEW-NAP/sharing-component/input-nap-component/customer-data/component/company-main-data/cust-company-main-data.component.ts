import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustDataCompanyObj } from 'app/shared/model/CustDataCompanyObj.Model';

@Component({
  selector: 'app-cust-company-main-data',
  templateUrl: './cust-company-main-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyMainDataComponent implements OnInit {

  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataCompanyObj: CustDataCompanyObj = new CustDataCompanyObj();
  @Input() custType: any;
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();


  refMasterObj = {
    RefMasterTypeCode: "",
  };
  refIndustryObj = {
    IndustryTypeCode: ""
  };
  selectedCustNo: any;
  selectedIndustryTypeCode: any;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: any;
  InputLookupIndustryTypeObj: any;
  IdTypeObj: any;
  CompanyTypeObj: any;
  CustModelObj: any;
  custModelReqObj= {
    MrCustTypeCode: ""
  };


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {

    this.parentForm.addControl(this.identifier, this.fb.group({
      CustNo: [''],
      IndustryTypeCode: [''],
      CustModelCode: ['', [Validators.required, Validators.maxLength(50)]],
      CompanyBrandName: ['', Validators.maxLength(100)],
      MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      NumOfEmp: [0],
      IsAffiliated: [false],
      EstablishmentDt: [''],
      TaxIdNo: ['', [Validators.required, Validators.maxLength(50)]],
      IsVip: [false]
    }));

    this.initLookup();
    this.bindAllRefMasterObj();
    this.bindCustModelObj();
    this.bindCustData();
  }

  CopyCustomerEvent(event) {
    this.parentForm.controls[this.identifier].patchValue({
      CustNo: event.CustNo
    });
    this.InputLookupCustomerObj.isReadonly = true;

    var custObj = {CustId: event.CustId};
    this.http.post(AdInsConstant.GetCustCompanyForCopyByCustId, custObj).subscribe(
      (response) => {
        console.log(response);
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CopyCustomer(response){
    if(response["CustObj"] != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: response["CustObj"].CustNo,
        CustModelCode: response["CustObj"].MrCustModelCode,
        TaxIdNo: response["CustObj"].TaxIdNo,
        IsVip: response["CustObj"].IsVip
      });
      this.InputLookupCustomerObj.nameSelect = response["CustObj"].CustName;
      this.InputLookupCustomerObj.jsonSelect = {CustName: response["CustObj"].CustName};
      this.selectedCustNo = response["CustObj"].CustNo;
    }

    if(response["CustCompanyObj"] != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        IndustryTypeCode: response["CustCompanyObj"].IndustryTypeCode,
        CompanyBrandName: response["CustCompanyObj"].CompanyBrandName,
        MrCompanyTypeCode: response["CustCompanyObj"].MrCompanyTypeCode,		
        NumOfEmp: response["CustCompanyObj"].NumOfEmp,
        IsAffiliated: response["CustCompanyObj"].IsAffiliated,
        EstablishmentDt: formatDate(response["CustCompanyObj"].EstablishmentDt, 'yyyy-MM-dd', 'en-US')
      });
      
      this.setIndustryTypeName(response["CustCompanyObj"].IndustryTypeCode);
    }    
  }

  
  GetIndustryType(event){
    this.parentForm.controls[this.identifier].patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }


  setCriteriaLookupCustomer(custTypeCode){
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }

  setIndustryTypeName(industryTypeCode){
    this.refIndustryObj.IndustryTypeCode = industryTypeCode;

    this.http.post(AdInsConstant.GetRefIndustryTypeByCode, this.refIndustryObj).subscribe(
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

  bindCustData(){
    console.log("bind cust data");
    console.log(this.custDataCompanyObj);
    if(this.custDataCompanyObj.AppCustObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: this.custDataCompanyObj.AppCustObj.CustNo,
        CustModelCode: this.custDataCompanyObj.AppCustObj.CustModelCode,
        TaxIdNo: this.custDataCompanyObj.AppCustObj.TaxIdNo,
        IsVip: this.custDataCompanyObj.AppCustObj.IsVip
      });
      this.InputLookupCustomerObj.nameSelect = this.custDataCompanyObj.AppCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = {CustName: this.custDataCompanyObj.AppCustObj.CustName};
      if(this.custDataCompanyObj.AppCustObj.CustNo != undefined && this.custDataCompanyObj.AppCustObj.CustNo != ""){
        this.InputLookupCustomerObj.isReadonly = true;
      }
    }
    
    if(this.custDataCompanyObj.AppCustCompanyObj.AppCustCompanyId != 0){
      this.parentForm.controls[this.identifier].patchValue({
        IndustryTypeCode: this.custDataCompanyObj.AppCustCompanyObj.IndustryTypeCode,
        CompanyBrandName: this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName,
        MrCompanyTypeCode: this.custDataCompanyObj.AppCustCompanyObj.MrCompanyTypeCode,		
        NumOfEmp: this.custDataCompanyObj.AppCustCompanyObj.NumOfEmp,
        IsAffiliated: this.custDataCompanyObj.AppCustCompanyObj.IsAffiliated,
        EstablishmentDt: formatDate(this.custDataCompanyObj.AppCustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US')
      });
      this.setIndustryTypeName(this.custDataCompanyObj.AppCustCompanyObj.IndustryTypeCode);
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
    this.setCriteriaLookupCustomer(AdInsConstant.CustTypeCompany);

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";

  }

  bindAllRefMasterObj(){
    this.bindCompanyTypeObj();
  }

  bindCompanyTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "COMPANY_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyTypeObj = response["ReturnObject"];
        if(this.CompanyTypeObj.length > 0  && (this.parentForm.controls[this.identifier]["controls"].MrCompanyTypeCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrCompanyTypeCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
          console.log("bind company type");
        }
      }
    );
  }

  bindCustModelObj(){
    this.custModelReqObj.MrCustTypeCode = AdInsConstant.CustTypeCompany;
     this.http.post(AdInsConstant.GetListKeyValueByMrCustTypeCode, this.custModelReqObj).toPromise().then(
      (response) => {
        this.CustModelObj = response["ReturnObject"];
        if(this.CustModelObj.length > 0  && (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );
  }

}

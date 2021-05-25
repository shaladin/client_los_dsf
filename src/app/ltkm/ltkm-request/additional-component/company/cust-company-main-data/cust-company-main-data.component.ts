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
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CustDataCompanyLtkmObj } from 'app/shared/model/LTKM/CustDataCompanyLtkmObj.Model';

@Component({
  selector: 'app-ltkm-cust-company-main-data',
  templateUrl: './cust-company-main-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class LtkmCustCompanyMainDataComponent implements OnInit {
  @Input() isLockLookupCust: boolean = false;
  @Input() isLockMode: boolean = false;
  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataCompanyObj: CustDataCompanyLtkmObj = new CustDataCompanyLtkmObj();
  @Input() custType: any;
  @Input() bizTemplateCode : string = "";
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();
  AppObj: AppObj = new AppObj();
  AppId: number;

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
  CustModelObj: Array<KeyValueObj>;
  custModelReqObj = {
    MrCustTypeCode: ""
  };
  UserAccess: any;
  MaxDate: Date;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
    });
  }

  ngOnInit() {

    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    if(this.isLockMode){
      this.parentForm.addControl(this.identifier, this.fb.group({
        CustNo: [''],
        IndustryTypeCode: [''],
        CustModelCode: [''],
        CompanyBrandName: [''],
        MrCompanyTypeCode: [''],
        NumOfEmp: [0],
        IsAffiliated: [false],
        EstablishmentDt: [''],
        TaxIdNo: [''],
        IsVip: [false]
      }));
    }else{
      this.parentForm.addControl(this.identifier, this.fb.group({
        CustNo: [''],
        IndustryTypeCode: [''],
        CustModelCode: ['', [Validators.required, Validators.maxLength(50)]],
        CompanyBrandName: ['', Validators.maxLength(100)],
        MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
        NumOfEmp: [0],
        IsAffiliated: [false],
        EstablishmentDt: ['',[Validators.required]],
        TaxIdNo: ['', [Validators.required, Validators.maxLength(50)]],
        IsVip: [false]
      }));
    }
    
    console.log('ini cust main data company form');
    console.log(this.parentForm);

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

    var custObj = { CustId: event.CustId };
    this.http.post(URLConstant.GetCustCompanyLtkmForCopyByCustId, custObj).subscribe(
      (response) => {
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      });
  }

  CopyCustomer(response) {
    if (response["CustObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: response["CustObj"].CustNo,
        // CustModelCode: response["CustObj"].MrCustModelCode,
        TaxIdNo: response["CustObj"].TaxIdNo,
        IsVip: response["CustObj"].IsVip
      });

      if(!this.isLockMode)
      {
        if(response["CustObj"].MrCustModelCode.length === 0 || !response["CustObj"].MrCustModelCode.trim()){

        }else{
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: response["CustObj"].MrCustModelCode,
          });
        }
      }

      this.InputLookupCustomerObj.nameSelect = response["CustObj"].CustName;
      this.InputLookupCustomerObj.jsonSelect = { CustName: response["CustObj"].CustName };
      this.selectedCustNo = response["CustObj"].CustNo;
      this.parentForm.controls[this.identifier]['controls']["TaxIdNo"].disable();
    }

    if (response["CustCompanyObj"] != undefined) {
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


  GetIndustryType(event) {
    this.parentForm.controls[this.identifier].patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }


  setCriteriaLookupCustomer(custTypeCode) {
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }

  setIndustryTypeName(industryTypeCode) {
    this.refIndustryObj.IndustryTypeCode = industryTypeCode;

    this.http.post(URLConstant.GetRefIndustryTypeByCode, this.refIndustryObj).subscribe(
      (response) => {
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;
      });

  }

  bindCustData() {
    if (this.custDataCompanyObj.LtkmCustObj.LtkmCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: this.custDataCompanyObj.LtkmCustObj.CustNo,
        CustModelCode: this.custDataCompanyObj.LtkmCustObj.MrCustModelCode,
        TaxIdNo: this.custDataCompanyObj.LtkmCustObj.TaxIdNo,
        IsVip: this.custDataCompanyObj.LtkmCustObj.IsVip
      });
      this.InputLookupCustomerObj.nameSelect = this.custDataCompanyObj.LtkmCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = { CustName: this.custDataCompanyObj.LtkmCustObj.CustName };
      if (this.custDataCompanyObj.LtkmCustObj.CustNo != undefined && this.custDataCompanyObj.LtkmCustObj.CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
      }
    }

    if (this.custDataCompanyObj.LtkmCustCompanyObj.LtkmCustCompanyId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        IndustryTypeCode: this.custDataCompanyObj.LtkmCustCompanyObj.IndustryTypeCode,
        CompanyBrandName: this.custDataCompanyObj.LtkmCustCompanyObj.CompanyBrandName,
        MrCompanyTypeCode: this.custDataCompanyObj.LtkmCustCompanyObj.MrCompanyTypeCode,
        NumOfEmp: this.custDataCompanyObj.LtkmCustCompanyObj.NumOfEmp,
        IsAffiliated: this.custDataCompanyObj.LtkmCustCompanyObj.IsAffiliated,
        EstablishmentDt: formatDate(this.custDataCompanyObj.LtkmCustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US')
      });
      this.setIndustryTypeName(this.custDataCompanyObj.LtkmCustCompanyObj.IndustryTypeCode);
    }
  }

  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookUpExistingCustCompany.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookUpExistingCustCompany.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookUpExistingCustCompany.json";

    if(this.isLockLookupCust){
      this.InputLookupCustomerObj.isReadonly = true;
      this.InputLookupCustomerObj.isDisable = true
    }else{
      this.InputLookupCustomerObj.isReadonly = false;
      this.InputLookupCustomerObj.isDisable = false
    }

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.setCriteriaLookupCustomer(CommonConstant.CustTypeCompany);

    if(this.isLockMode)
    {
      this.InputLookupIndustryTypeObj.isDisable = true;
      this.InputLookupIndustryTypeObj.isRequired = false;
    }

    var AppObj = { AppId: this.AppId };
    this.http.post<AppObj>(URLConstant.GetAppById, AppObj).subscribe(
      (response) => {
        this.AppObj = response;
        
        if (this.AppObj.BizTemplateCode != CommonConstant.FCTR) {
          this.InputLookupCustomerObj.isReadonly = false;
        }

        this.InputLookupCustomerObj.isReady = true;
      }, 
      (error) => {
      }
    );
  }

  bindAllRefMasterObj() {
    this.bindCompanyTypeObj();
  }

  bindCompanyTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCompanyType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrCompanyTypeCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrCompanyTypeCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      }
    );
  }

  bindCustModelObj() {
    let tempReqObj: GenericObj = new GenericObj();
    tempReqObj.Code = CommonConstant.CustTypeCompany;
    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, tempReqObj).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if (this.CustModelObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );
  }
}

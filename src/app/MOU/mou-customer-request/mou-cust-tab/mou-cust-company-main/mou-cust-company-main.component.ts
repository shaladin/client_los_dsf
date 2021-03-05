import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustCompanyDataObj } from 'app/shared/model/MouCustCompanyDataObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-cust-company-main',
  templateUrl: './mou-cust-company-main.component.html',
  styleUrls: ['./mou-cust-company-main.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class MouCustCompanyMainComponent implements OnInit {

  @Input() MouCustId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataCompanyObj: MouCustCompanyDataObj = new MouCustCompanyDataObj();
  @Input() custType: any;
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();
  AppObj: AppObj = new AppObj();

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
  custModelReqObj = {
    MrCustTypeCode: ""
  };
  UserAccess: any;
  MaxDate: Date;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params['mouCustId'];
    });
  }

  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    this.parentForm.addControl(this.identifier, this.fb.group({
      CustNo: [''],
      CustName: [''],
      IndustryTypeCode: [''],
      CustModelCode: ['', [Validators.required, Validators.maxLength(50)]],
      CompanyBrandName: ['', Validators.maxLength(100)],
      MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      NumOfEmp: [0],
      IsAffiliated: [false],
      EstablishmentDt: ['', [Validators.required]],
      TaxIdNo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
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

    var custObj = { CustId: event.CustId };
    this.http.post(URLConstant.GetCustCompanyForCopyByCustId, custObj).subscribe(
      (response) => {
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CopyCustomer(response) {
    if (response["CustObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: response["CustObj"].CustNo,
        CustName: response["CustObj"].CustName,
        CustModelCode: response["CustObj"].MrCustModelCode,
        TaxIdNo: response["CustObj"].TaxIdNo,
        IsVip: response["CustObj"].IsVip
      });
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
      },
      (error) => {
        console.log(error);
      }
    );

  }

  bindCustData() {
    if (this.custDataCompanyObj.MouCustObj.MouCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: this.custDataCompanyObj.MouCustObj.CustNo,
        CustName: this.custDataCompanyObj.MouCustObj.CustName,
        CustModelCode: this.custDataCompanyObj.MouCustObj.CustModelCode,
        TaxIdNo: this.custDataCompanyObj.MouCustObj.TaxIdNo,
        IsVip: this.custDataCompanyObj.MouCustObj.IsVip
      });
      this.InputLookupCustomerObj.nameSelect = this.custDataCompanyObj.MouCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = { CustName: this.custDataCompanyObj.MouCustObj.CustName };
      if (this.custDataCompanyObj.MouCustObj.CustNo != undefined && this.custDataCompanyObj.MouCustObj.CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
      }
    }

    if (this.custDataCompanyObj.MouCustCompanyObj.MouCustCompanyId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        IndustryTypeCode: this.custDataCompanyObj.MouCustCompanyObj.IndustryTypeCode,
        CompanyBrandName: this.custDataCompanyObj.MouCustCompanyObj.CompanyBrandName,
        MrCompanyTypeCode: this.custDataCompanyObj.MouCustCompanyObj.MrCompanyTypeCode,
        NumOfEmp: this.custDataCompanyObj.MouCustCompanyObj.NumOfEmp,
        IsAffiliated: this.custDataCompanyObj.MouCustCompanyObj.IsAffiliated,
        EstablishmentDt: formatDate(this.custDataCompanyObj.MouCustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US')
      });
      this.setIndustryTypeName(this.custDataCompanyObj.MouCustCompanyObj.IndustryTypeCode);
    }
  }

  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReady = true;
    this.InputLookupCustomerObj.isReadonly = false;

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.setCriteriaLookupCustomer(CommonConstant.CustTypeCompany);
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
    this.custModelReqObj.MrCustTypeCode = CommonConstant.CustTypeCompany;
    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, this.custModelReqObj).toPromise().then(
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

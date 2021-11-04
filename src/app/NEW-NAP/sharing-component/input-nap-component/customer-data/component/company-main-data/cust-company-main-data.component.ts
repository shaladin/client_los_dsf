import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CustDataObj } from 'app/shared/model/cust-data-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustDataCompanyObj } from 'app/shared/model/cust-data-company-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResListKeyValueObj } from 'app/shared/model/response/generic/res-list-key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';

@Component({
  selector: 'app-cust-company-main-data',
  templateUrl: './cust-company-main-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class CustCompanyMainDataComponent implements OnInit {
  @Input() isLockMode: boolean = false;
  @Input() appId: number;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() custDataCompanyObj: CustDataCompanyObj = new CustDataCompanyObj();
  @Input() bizTemplateCode: string = "";
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();
  AppObj: AppObj = new AppObj();
  AppId: number;

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  refIndustryObj = {
    IndustryTypeCode: ""
  };
  selectedCustNo: string;
  selectedIndustryTypeCode: string;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: InputLookupObj;
  InputLookupIndustryTypeObj: InputLookupObj;
  CompanyTypeObj: Array<KeyValueObj>;
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  UserAccess: CurrentUserContext;
  MaxDate: Date;
  custModelReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
    });
  }

  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
        EstablishmentDt: ['', [Validators.required]],
        TaxIdNo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
        IsVip: [false]
      }));
    }
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

    this.http.post(URLConstant.GetCustCompanyForCopyByCustId, {Id : event.CustId}).subscribe(
      (response) => {
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      }
    );
  }

  CopyCustomer(response) {
    if (response["CustObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: response["CustObj"].CustNo,
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

    this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: industryTypeCode}).subscribe(
      (response) => {
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;
      }
    );
  }

  bindCustData() {
    if (this.custDataCompanyObj.AppCustObj.AppCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: this.custDataCompanyObj.AppCustObj.CustNo,
        CustModelCode: this.custDataCompanyObj.AppCustObj.MrCustModelCode,
        TaxIdNo: this.custDataCompanyObj.AppCustObj.TaxIdNo,
        IsVip: this.custDataCompanyObj.AppCustObj.IsVip
      });
      this.InputLookupCustomerObj.nameSelect = this.custDataCompanyObj.AppCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = { CustName: this.custDataCompanyObj.AppCustObj.CustName };
      if (this.custDataCompanyObj.AppCustObj.CustNo != undefined && this.custDataCompanyObj.AppCustObj.CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
      }
    }

    if (this.custDataCompanyObj.AppCustCompanyObj.AppCustCompanyId != 0) {
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

  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.setCriteriaLookupCustomer(CommonConstant.CustTypeCompany);

    if(this.isLockMode)
    {
      this.InputLookupIndustryTypeObj.isDisable = true;
    }

    var AppObj = { Id: this.AppId };
    this.http.post<AppObj>(URLConstant.GetAppById, AppObj).subscribe(
      (response) => {
        this.AppObj = response;

        if (this.AppObj.BizTemplateCode != CommonConstant.FCTR) {
          this.InputLookupCustomerObj.isReadonly = false;
        }

        this.InputLookupCustomerObj.isReady = true;
      },
      (error) => { }
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
    this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModelReqObj.MappingCode = CommonConstant.CustTypeCompany;
    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).subscribe(
      (response : ResListKeyValueObj) => {
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
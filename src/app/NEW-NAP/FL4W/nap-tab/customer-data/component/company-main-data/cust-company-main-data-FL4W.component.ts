import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { formatDate } from '@angular/common';
import { CustDataCompanyObj } from 'app/shared/model/CustDataCompanyObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResListKeyValueObj } from 'app/shared/model/Response/Generic/ResListKeyValueObj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';

@Component({
  selector: 'app-cust-company-main-data-FL4W',
  templateUrl: './cust-company-main-data-FL4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyMainDataFL4WComponent implements OnInit {

  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataCompanyObj: CustDataCompanyObj = new CustDataCompanyObj();
  @Input() custType: any;
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();

  businessDt: Date = new Date();
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
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  custModelReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private cookieService: CookieService) {

  }

  async ngOnInit(): Promise<void> {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    this.parentForm.addControl(this.identifier, this.fb.group({
      CustNo: [''],
      IndustryTypeCode: [''],
      CustModelCode: ['', [Validators.required]],
      CompanyBrandName: ['', Validators.maxLength(100)],
      MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      NumOfEmp: [0, [Validators.min(0)]],
      IsAffiliated: [false],
      EstablishmentDt: ['', [Validators.required]],
      TaxIdNo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
      IsVip: [false]
    }));

    this.initLookup();
    await this.bindCompanyTypeObj();
    await this.bindCustModelObj();
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
      });
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
      });
  }

  bindCustData() {
    if (this.custDataCompanyObj.AppCustObj != undefined) {
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

    if (this.custDataCompanyObj.AppCustCompanyObj != undefined) {
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
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;
    this.setCriteriaLookupCustomer(CommonConstant.CustTypeCompany);

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.required = true;
  }

  async bindCompanyTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCompanyType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
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

  async bindCustModelObj() {
    this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModelReqObj.MappingCode = CommonConstant.CustTypeCompany;
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).toPromise().then(
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

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
import { AppObj } from 'app/shared/model/app/app.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CustDataCompanyLtkmObj } from 'app/shared/model/ltkm/cust-data-company-ltkm-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { CustSetData } from 'app/NEW-NAP/sharing-component/main-data-component/components/CustSetData.Service';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';

@Component({
  selector: 'app-ltkm-cust-company-main-data-x',
  templateUrl: './cust-company-main-data-x.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class LtkmCustCompanyMainDataXComponent implements OnInit {
  @Input() isLockLookupCust: boolean = false;
  @Input() isLockMode: boolean = false;
  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() custDataCompanyObj: CustDataCompanyLtkmObj = new CustDataCompanyLtkmObj();
  @Input() custType: string;
  @Input() bizTemplateCode : string = "";
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();
  AppObj: AppObj = new AppObj();
  AppId: number;
  selectedCustNo: string;
  selectedIndustryTypeCode: string;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: InputLookupObj;
  InputLookupIndustryTypeObj: InputLookupObj;
  CompanyTypeObj: Array<KeyValueObj>;
  CustModelObj: Array<KeyValueObj>;
  custModelReqObj = {
    MrCustTypeCode: ""
  };
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  MaxDate: Date;

  npwpOrKtp:Array<string> = [CommonConstant.MrIdTypeCodeEKTP, CommonConstant.MrIdTypeCodeNPWP]
  isReadOnly:boolean = false


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
    });
  }

  ngOnInit() {
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
        TaxIdNo: ['',[Validators.required,Validators.maxLength(16),Validators.minLength(16), Validators.pattern("^[0-9]+$")]],
        IsVip: [false]
      }));
      this.isReadOnly = true
    }else{
      this.parentForm.addControl(this.identifier, this.fb.group({
        CustNo: [''],
        IndustryTypeCode: [''],
        CustModelCode: ['', [Validators.required, Validators.maxLength(50)]],
        CompanyBrandName: ['', Validators.maxLength(500)],
        MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
        NumOfEmp: [0],
        IsAffiliated: [false],
        EstablishmentDt: ['',[Validators.required]],
        TaxIdNo: ['', [Validators.required,Validators.maxLength(16),Validators.minLength(16), Validators.pattern("^[0-9]+$")]],
        IsVip: [false]
      }));
      this.isReadOnly = false
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

    this.http.post(URLConstant.GetCustCompanyLtkmForCopyByCustId, { Id: event.CustId }).subscribe(
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
        IsAffiliated: response["CustObj"].IsAffiliateWithMf,
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
      this.isReadOnly = true
    }

    if (response["CustCompanyObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        IndustryTypeCode: response["CustCompanyObj"].IndustryTypeCode,
        CompanyBrandName: response["CustCompanyObj"].CompanyBrandName,
        MrCompanyTypeCode: response["CustCompanyObj"].MrCompanyTypeCode,
        NumOfEmp: response["CustCompanyObj"].NumOfEmp,
        //IsAffiliated: response["CustCompanyObj"].IsAffiliated,
        EstablishmentDt: formatDate(response["CustCompanyObj"].EstablishmentDt, 'yyyy-MM-dd', 'en-US')
      });

      this.setIndustryTypeName(response["CustCompanyObj"].IndustryTypeCode);
    }
    this.parentForm.controls[this.identifier]['controls']["TaxIdNo"].setValidators([Validators.required,Validators.maxLength(16),Validators.minLength(16), Validators.pattern("^[0-9]+$")])
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

  setIndustryTypeName(industryTypeCode: string) {
    var reqTempObj: GenericObj = new GenericObj();
    reqTempObj.Code = industryTypeCode;
    this.http.post(URLConstant.GetRefIndustryTypeByCode, reqTempObj).subscribe(
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
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookUpExistingCustCompany.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookUpExistingCustCompany.json";

    if(this.isLockLookupCust){
      this.InputLookupCustomerObj.isReadonly = true;
      this.InputLookupCustomerObj.isDisable = true
    }else{
      this.InputLookupCustomerObj.isReadonly = false;
      this.InputLookupCustomerObj.isDisable = false
    }
    this.setCriteriaLookupCustomer(CommonConstant.CustTypeCompany);

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.isRequired = false;

    if(this.isLockMode)
    {
      this.InputLookupIndustryTypeObj.isDisable = true;
      this.InputLookupIndustryTypeObj.isRequired = false;
    }

    this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
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
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).subscribe(
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
    // let tempReqObj: GenericObj = new GenericObj();
    // tempReqObj.Code = CommonConstant.CustTypeCompany;
    let tempReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel,
      MappingCode: CommonConstant.CustTypeCompany
    };
    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReqObj).toPromise().then(
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

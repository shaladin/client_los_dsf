import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { ResponseAppCustCompletionCompanyDataObj } from 'app/shared/model/ResponseAppCustCompletionCompanyDataObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';

@Component({
  selector: 'app-cust-detail-company',
  templateUrl: './cust-detail-company.component.html',
  styleUrls: ['./cust-detail-company.component.scss']
})
export class CustDetailCompanyComponent implements OnInit {
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  lookupCustGrpObj: InputLookupObj = new InputLookupObj();
  lookupIndustryTypeObj: InputLookupObj = new InputLookupObj();
  AppCustGrpObj: AppCustGrpObj = new AppCustGrpObj();
  ListAppCustGrpObj: Array<AppCustGrpObj> = new Array<AppCustGrpObj>();
  AppCustObj: AppCustObj = new AppCustObj();
  AppCustCompanyObj: AppCustCompanyObj = new AppCustCompanyObj();
  businessDt: Date = new Date();
  CustModelObj: Array<KeyValueObj> = new Array();
  ddlCustModelObj: UcDropdownListObj = new UcDropdownListObj();
  industryTypeObj = {
    IndustryTypeCode: ""
  };

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService, private cookieService: CookieService) { }
  CustDetailForm = this.fb.group({
    NoOfEmployee: ['', Validators.required],
    IsAffiliateWithMF: [false],
    EstablishmentDate: ['', Validators.required],
    IndustryTypeCode: ['', Validators.required],
    MrCustModelCode: ['', Validators.required],
  })

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);

    this.lookupCustGrpObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.lookupCustGrpObj.urlEnviPaging = environment.FoundationR3Url;
    this.lookupCustGrpObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.isRequired = false;
    this.lookupCustGrpObj.isReady = true;

    this.lookupIndustryTypeObj = new InputLookupObj();
    this.lookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.lookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.lookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.lookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.lookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.lookupIndustryTypeObj.isReady = true;
    this.GetCustModel();
    this.GetData();
  }

  GetCustModel() {
    this.ddlCustModelObj.apiUrl = URLConstant.GetListActiveRefMasterWithMappingCodeAll;
    this.ddlCustModelObj.requestObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel, MappingCode: CommonConstant.CustTypeCompany };
  }

  GetIndustryType(event) {
    this.CustDetailForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }

  GetCustGrpData(event) {
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
  }

  SetData() {
    this.AppCustObj.AppCustId = this.AppCustId;
    this.AppCustObj.MrCustModelCode = this.CustDetailForm.controls.MrCustModelCode.value;
    this.AppCustObj.IsAffiliateWithMf = this.CustDetailForm.controls.IsAffiliateWithMF.value; 
   
    this.AppCustCompanyObj.IndustryTypeCode   = this.CustDetailForm.controls.IndustryTypeCode.value;
    this.AppCustCompanyObj.NumOfEmp = this.CustDetailForm.controls.NoOfEmployee.value;
    this.AppCustCompanyObj.EstablishmentDt = this.CustDetailForm.controls.EstablishmentDate.value;
  }

  SaveForm() {
    this.SetData();
    let requestObj = {
      AppCustObj: this.AppCustObj,
      AppCustCompanyObj: this.AppCustCompanyObj,
      AppCustGrpObjs: this.ListAppCustGrpObj
    }

    this.http.post(URLConstant.UpdateAppCustCompletionCompany, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit({ IsComplete: true });
      },
      error => {
        console.log(error);
      });
  }

  GetData() {
    this.http.post<ResponseAppCustCompletionCompanyDataObj>(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        if (response.AppCustCompanyObj.IndustryTypeCode != null) {
          this.industryTypeObj.IndustryTypeCode = response.AppCustCompanyObj.IndustryTypeCode;
          this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: response.AppCustCompanyObj.IndustryTypeCode}).subscribe(
            (response) => {
              this.lookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
              this.lookupIndustryTypeObj.jsonSelect = response;
            }
          );
        }

        this.CustDetailForm.patchValue({
          IsAffiliateWithMF : response.AppCustObj.IsAffiliateWithMf,
          NoOfEmployee : response.AppCustCompanyObj.NumOfEmp,
          EstablishmentDate : response.AppCustCompanyObj.EstablishmentDt != null ? formatDate(response.AppCustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
          IndustryTypeCode : response.AppCustCompanyObj.IndustryTypeCode,
          MrCustModelCode : response.AppCustObj.MrCustModelCode,
        })

        this.AppCustObj.RowVersion = response.AppCustObj.RowVersion;
        this.AppCustCompanyObj.RowVersion = response.AppCustCompanyObj.RowVersion;

        if (response.AppCustGrpObj != null && response.AppCustGrpObj.CustNo != "") {
          this.http.post(URLConstant.GetCustByCustNo, { TrxNo: response.AppCustGrpObj.CustNo }).subscribe(
            (responseCustGrp) => {
              this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
              this.lookupCustGrpObj.jsonSelect = { CustName: responseCustGrp["CustName"] };
              this.lookupCustGrpObj.isReady = true;
              this.GetCustGrpData({ CustNo: responseCustGrp["CustNo"] });
            });
        }
      }
    );
  }


}

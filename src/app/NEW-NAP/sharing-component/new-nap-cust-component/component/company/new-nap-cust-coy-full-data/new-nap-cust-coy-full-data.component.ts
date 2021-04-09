import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CustCompanyObj } from 'app/shared/model/CustCompanyObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResponseAppCustCompletionCompanyDataObj } from 'app/shared/model/ResponseAppCustCompletionCompanyDataObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-nap-cust-company-full-data',
  templateUrl: './new-nap-cust-coy-full-data.component.html',
  styles: []
})
export class NewNapCustCompanyFullDataComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() ParentForm: FormGroup;
  @Input() IsCompanyDataSubmitted: boolean;
  @Output() ResponseCustGrp: EventEmitter<any> = new EventEmitter<any>();
  lookupCustGrpObj: InputLookupObj = new InputLookupObj();
  lookupIndustryTypeObj: InputLookupObj = new InputLookupObj();
  AppCustGrpObj: AppCustGrpObj = new AppCustGrpObj();
  ListAppCustGrpObj: Array<AppCustGrpObj> = new Array<AppCustGrpObj>();
  AppCustObj: AppCustObj = new AppCustObj();
  AppCustCompanyObj: AppCustCompanyObj = new AppCustCompanyObj(); 
  businessDt: Date = new Date();
  CustModelObj: Array<KeyValueObj> = new Array();
  industryTypeObj = {
    IndustryTypeCode: ""
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private cookieService: CookieService
  ) { 
    this.IsCompanyDataSubmitted = false;
  }

  async ngOnInit() {
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
    await this.GetCustModel();
    if(this.AppCustId && this.AppCustId > 0){
      this.GetData();
    }
  }

  CopyCustCompanyFullData(custObj, custCompanyObj, custGrpObj){
    this.ParentForm.patchValue({
      NoOfEmployee: custCompanyObj.NumOfEmp,
      IsAffiliateWithMF: custObj.IsAffiliateWithMf,
      EstablishmentDate: formatDate(custCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US'),
      IndustryTypeCode: custCompanyObj.IndustryTypeCode,
      MrCustModelCode: custObj.MrCustModelCode
    });
    if(custGrpObj && custGrpObj[0].CustNo){
      this.http.post(URLConstant.GetCustByCustNo, {TrxNo: custGrpObj[0].CustNo}).toPromise().then(
        (responseCustGrp) => {
          this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
          this.lookupCustGrpObj.jsonSelect = {CustName: responseCustGrp["CustName"]};
          this.GetCustGrpData({CustNo:responseCustGrp["CustNo"]});
      });
    }
    this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: custCompanyObj.IndustryTypeCode }).toPromise().then(
      (response) => {
        this.lookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.lookupIndustryTypeObj.jsonSelect = response;     
      } 
    );
  }

  async GetCustModel()
  {
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel, MappingCode: CommonConstant.CustTypeCompany }).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  GetIndustryType(event){
    this.ParentForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }

  GetCustGrpData(event){
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
    this.ResponseCustGrp.emit(this.ListAppCustGrpObj);
  }

  GetData(){
    this.http.post<ResponseAppCustCompletionCompanyDataObj>(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, {Id: this.AppCustId}).subscribe(
      (response) => {
        if(response.AppCustCompanyObj.IndustryTypeCode != null){
          this.industryTypeObj.IndustryTypeCode =  response.AppCustCompanyObj.IndustryTypeCode;
          this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: response.AppCustCompanyObj.IndustryTypeCode}).subscribe(
            (response) => {
              this.lookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
              this.lookupIndustryTypeObj.jsonSelect = response;     
            } 
          );
        } 
      
        this.ParentForm.patchValue({
          IsAffiliateWithMF : response.AppCustObj.IsAffiliateWithMf,
          NoOfEmployee : response.AppCustCompanyObj.NumOfEmp,
          EstablishmentDate : response.AppCustCompanyObj.EstablishmentDt != null ? formatDate(response.AppCustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
          IndustryTypeCode : response.AppCustCompanyObj.IndustryTypeCode,
          MrCustModelCode : response.AppCustObj.MrCustModelCode,
          RowVersionAppCust: response.AppCustObj.RowVersion,
          RowVersionAppCustCompany: response.AppCustCompanyObj.RowVersion
        })
 
        this.AppCustObj.RowVersion = response.AppCustObj.RowVersion;
        this.AppCustCompanyObj.RowVersion = response.AppCustCompanyObj.RowVersion;

        if(response.AppCustGrpObj != null && response.AppCustGrpObj.CustNo != ""){
          this.http.post(URLConstant.GetCustByCustNo, {TrxNo: response.AppCustGrpObj.CustNo}).subscribe(
            (responseCustGrp) => {
              this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
              this.lookupCustGrpObj.jsonSelect = {CustName: responseCustGrp["CustName"]};
              this.lookupCustGrpObj.isReady = true;
              this.GetCustGrpData({CustNo:responseCustGrp["CustNo"]});
            });
        } 
      }
    );
  }
}

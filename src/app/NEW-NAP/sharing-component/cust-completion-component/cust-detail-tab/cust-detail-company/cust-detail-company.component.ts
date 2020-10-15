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
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment'; 

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
  industryTypeObj = {
    IndustryTypeCode: ""
  };
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) { }
  CustDetailForm = this.fb.group({
    NoOfEmployee: ['', Validators.required],
    IsAffiliateWithMF: [false],
    EstablishmentDate: ['', Validators.required],
    IndustryTypeCode: ['', Validators.required]

  })
  ngOnInit() {
    var context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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
    this.GetData();
  }

  GetIndustryType(event){
    this.CustDetailForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }
  GetCustGrpData(event){
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
  }
  SetData(){
    this.AppCustObj.AppCustId = this.AppCustId;
    this.AppCustObj.IsAffiliateWithMF = this.CustDetailForm.controls.IsAffiliateWithMF.value; 
   
    this.AppCustCompanyObj.IndustryTypeCode   = this.CustDetailForm.controls.IndustryTypeCode.value;
    this.AppCustCompanyObj.NumOfEmp = this.CustDetailForm.controls.NoOfEmployee.value;
    this.AppCustCompanyObj.EstablishmentDt = this.CustDetailForm.controls.EstablishmentDate.value; 
  }

  SaveForm(){
    this.SetData();
    let requestObj={
      AppCustObj: this.AppCustObj, 
      AppCustCompanyObj: this.AppCustCompanyObj,
      AppCustGrpObjs: this.ListAppCustGrpObj
    }

    this.http.post(URLConstant.UpdateAppCustCompletionCompany, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit();
      },
      error => {
        console.log(error);
      });
  }

  GetData(){
    this.http.post(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        if(response["IndustryTypeCode"] != null){
          this.industryTypeObj.IndustryTypeCode =  response["IndustryTypeCode"];
          this.http.post(URLConstant.GetRefIndustryTypeByCode, this.industryTypeObj).subscribe(
            (response) => {
              this.lookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
              this.lookupIndustryTypeObj.jsonSelect = response;     
            } 
          );
        } 
      
        this.CustDetailForm.patchValue({
          IsAffiliateWithMF : response["IsAffiliateWithMF"],
          NoOfEmployee : response["NumOfEmp"],
          EstablishmentDate : formatDate(response["EstablishmentDt"], 'yyyy-MM-dd', 'en-US') ,
          IndustryTypeCode : response["IndustryTypeCode"],
        })
 
        this.AppCustObj.RowVersion = response["AppCustRowVersion"];
        this.AppCustCompanyObj.RowVersion = response["AppCustCompanyRowVersion"];

        if(response["CustNoParent"] != ""){
          this.http.post(URLConstant.GetCustByCustNo, {CustNo: response["CustNoParent"]}).subscribe(
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

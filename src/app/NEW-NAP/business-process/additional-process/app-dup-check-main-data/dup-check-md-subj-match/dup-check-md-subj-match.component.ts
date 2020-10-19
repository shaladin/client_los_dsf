import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';

@Component({
  selector: 'app-dup-check-md-subj-match',
  templateUrl: './dup-check-md-subj-match.component.html',
  styleUrls: []
})
export class DupCheckMdSubjMatchComponent implements OnInit {

  appCustId: number;
  rowVersion: any;
  viewMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  listMasterCustDuplicate: any;
  listNegativeCustDuplicate: any;
  listAppCustDuplicate: any;
  appCustObj: AppCustObj;
  appCustPersonalObj: AppCustPersonalObj;
  appCustCompanyObj: AppCustCompanyObj;
  mrCustTypeCode: string;

  isLock: boolean = true;
  isMasterLock: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private location: Location) {
    this.route.queryParams.subscribe(params => {
      if (params['AppCustId'] != null)  this.appCustId = params['AppCustId'];
    });
  }

  ngOnInit() {
    this.getDupCheckData();

    this.http.post(URLConstant.GetAppCustMainDataByAppCustId, {"AppCustId": this.appCustId}).subscribe(
      response => {
        this.rowVersion = response['AppCustObj']['RowVersion'];
      }
    );
  }

  initViewMainInfo()
  {
    if(this.mrCustTypeCode == CommonConstant.CustTypePersonal)
      this.viewMainInfoObj.viewInput = "./assets/ucviewgeneric/viewDupCheckSubjectMatchPersonal.json";
    else if(this.mrCustTypeCode == CommonConstant.CustTypeCompany)
      this.viewMainInfoObj.viewInput = "./assets/ucviewgeneric/viewDupCheckSubjectMatchCompany.json";

    this.viewMainInfoObj.viewEnvironment = environment.losUrl;
    this.viewMainInfoObj.ddlEnvironments = [{ name: "AppNo", environment: environment.losR3Web }];
  }

  getDupCheckData(){
    this.http.post(URLConstant.GetAppCustMainDataByAppCustId, {"AppCustId": this.appCustId}).subscribe(
      response => {
        this.appCustObj = response['AppCustObj'];
        this.mrCustTypeCode = this.appCustObj.MrCustTypeCode;

        if(this.mrCustTypeCode == CommonConstant.CustTypePersonal)
        {
          this.appCustPersonalObj = response['AppCustPersonalObj'];
          var requestDupCheck = {
            "CustName": this.appCustObj.CustName,
            "MrCustTypeCode": this.appCustObj.MrCustTypeCode,
            "MrCustModelCode": this.appCustObj.CustModelCode,
            "MrIdTypeCode": this.appCustObj.MrIdTypeCode,
            "MrIdType": response['AppCustObj'].MrIdType,
            "IdNo": this.appCustObj.IdNo,
            "TaxIdNo": this.appCustObj.TaxIdNo,
            "BirthDt": this.appCustPersonalObj.BirthDt,
            "MotherMaidenName": this.appCustPersonalObj.MotherMaidenName,
            "MobilePhnNo1": this.appCustPersonalObj.MobilePhnNo1,          
            "RowVersion": response['AppCustObj'].RowVersion,
            "AppId": this.appCustObj.AppId
          }
        } 
        else if(this.mrCustTypeCode == CommonConstant.CustTypeCompany)
        {
          this.appCustCompanyObj = response['AppCustCompanyObj'];
          var requestDupCheck = {
            "CustName": this.appCustObj.CustName,
            "MrCustTypeCode": this.appCustObj.MrCustTypeCode,
            "MrCustModelCode": this.appCustObj.CustModelCode,
            "MrIdTypeCode": this.appCustObj.MrIdTypeCode,
            "MrIdType": response['AppCustObj'].MrIdType,
            "IdNo": this.appCustObj.IdNo,
            "TaxIdNo": this.appCustObj.TaxIdNo,
            "BirthDt" : this.appCustCompanyObj.EstablishmentDt,
            "MotherMaidenName" : "-",
            "MobilePhnNo1" : "-",
            "RowVersion": response['AppCustObj'].RowVersion,
            "AppId": this.appCustObj.AppId
          }
        }

        //List Cust Duplicate Duplicate Checking
        this.http.post(URLConstant.GetCustomerDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.listMasterCustDuplicate = response[CommonConstant.ReturnObj].CustDuplicate;
            if(response[CommonConstant.ReturnStatus] == CommonConstant.RuleBehaviourLock) 
            {
              this.isMasterLock = true;
              this.isLock = true;
            }
            else this.isMasterLock = false;
          }
        );

        //List App Cust Duplicate Checking
        this.http.post(URLConstant.MD_GetAppCustDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.listAppCustDuplicate = response[CommonConstant.ReturnObj];
            if(response[CommonConstant.ReturnStatus] == CommonConstant.RuleBehaviourLock) this.isLock = true;
            else if(!this.isMasterLock) this.isLock = false;
          }
        );

        this.initViewMainInfo();
      });
  }

  selectMasterCust(item){
    var AppDupCheckObj = {"AppCustId": this.appCustId, "CustNo": item.CustNo, RowVersion:this.rowVersion};
    this.http.post(URLConstant.MD_EditApplicantNoCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        this.buttonCancelOnClick();
      }
    );
  }

  selectAppCust(item){
    var AppDupCheckObj = {"AppCustId": this.appCustId, "ApplicantNo": item.ApplicantNo, RowVersion:this.rowVersion};
    this.http.post(URLConstant.MD_EditApplicantNoCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        this.buttonCancelOnClick();
      }
    );
  }
  
  buttonNewCustOnClick() {
    var AppDupCheckObj = {"AppCustId": this.appCustId, RowVersion:this.rowVersion};
    this.http.post(URLConstant.MD_EditApplicantNoCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        this.buttonCancelOnClick();
      }
    );
  }

  buttonCancelOnClick() {
    this.location.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustAddrObj } from 'app/shared/model/MouCustAddrObj.Model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { MouCustPersonalObj } from 'app/shared/model/MouCustPersonalObj.Model';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';

@Component({
  selector: 'app-similar-mou-personal-data',
  templateUrl: './similar-mou-personal-data.component.html',
  styleUrls: ['./similar-mou-personal-data.component.scss']
})
export class SimilarMouPersonalDataComponent implements OnInit {

  MouCustId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  AddAppDupCheckCustUrl = this.LOSUrl + URLConstant.AddAppDupCheckCust;
  MouCustObj: MouCustObj;
  MouCustPersonalObj: MouCustPersonalObj;
  MouCustAddrObj: MouCustAddrObj;
  ListCustomerDuplicate: any;
  ListNegativeCust: any;
  ListAppCustDuplicate: any;
  RowVersion: any;
  ListMouCustDuplicate: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  ngOnInit() {
    this.MouCustObj = new MouCustObj();
    this.MouCustPersonalObj = new MouCustPersonalObj();
    this.MouCustAddrObj = new MouCustAddrObj();

    //Get App Cust Data
    this.http.post(URLConstant.GetMouCustByMouCustId, {"Id": this.MouCustId}).subscribe(
      response => {
        this.MouCustObj = response['MouCustObj'];
        this.RowVersion = response['MouCustObj'].RowVersion;
        this.MouCustPersonalObj = response['MouCustPersonalObj'];
        this.MouCustAddrObj = response['MouCustAddrLegalObj'];

        let ReqDupCheckObj: DuplicateCustObj = new DuplicateCustObj();
        ReqDupCheckObj.CustName =  this.MouCustObj.CustName;
        ReqDupCheckObj.MrCustTypeCode = this.MouCustObj.MrCustTypeCode;
        ReqDupCheckObj.MrCustModelCode = this.MouCustObj.CustModelCode;
        ReqDupCheckObj.MrIdTypeCode = this.MouCustObj.MrIdTypeCode;
        ReqDupCheckObj.IdNo = this.MouCustObj.IdNo;
        ReqDupCheckObj.TaxIdNo =  this.MouCustObj.TaxIdNo;
        ReqDupCheckObj.BirthDt =  this.MouCustPersonalObj.BirthDt;
        ReqDupCheckObj.MobilePhnNo1 = this.MouCustPersonalObj.MobilePhnNo1;
        ReqDupCheckObj.RowVersion = this.RowVersion;
        ReqDupCheckObj.MotherMaidenName = this.MouCustPersonalObj.MotherMaidenName;
 
        //List Cust Duplicate And List Negative Cust Duplicate Checking
        this.http.post(URLConstant.GetCustomerAndNegativeCustDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListCustomerDuplicate = response[CommonConstant.ReturnObj].CustDuplicate;
            this.ListNegativeCust = response[CommonConstant.ReturnObj].NegativeCustDuplicate;
          });
            

        //List App Cust Duplicate Checking
        this.http.post(URLConstant.GetAppCustDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListAppCustDuplicate = response[CommonConstant.ReturnObj];
          });

          
        //List Mou Cust Duplicate Checking
        this.http.post(URLConstant.GetMouCustDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListMouCustDuplicate = response[CommonConstant.ReturnObj];
          });
      });
  }

  SelectCust(item) {
    var AppDupCheckObj = {"MouCustId": this.MouCustId, 
    "CustNo":item.CustNo, "ApplicantNo":item.ApplicantNo};
    this.http.post(URLConstant.EditCustNoMouCust, AppDupCheckObj).subscribe(
      response => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_EXIST_PERSONAL],{ "MouCustId": this.MouCustId, "WfTaskListId": this.WfTaskListId });
      });
  }

  NewCustomer(){
    this.http.post(URLConstant.EditCustNoMouCust, {"MouCustId": this.MouCustId, 
    "CustNo":this.MouCustObj.ApplicantNo, "ApplicantNo":this.MouCustObj.ApplicantNo}).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_EXIST_PERSONAL],{ "MouCustId": this.MouCustId, "WfTaskListId": this.WfTaskListId });
      });
  }

  back() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_PAGING],{});
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultH.Model';
import { environment } from 'environments/environment';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';

@Component({
  selector: 'app-cust-confirmation-subj-view',
  templateUrl: './cust-confirmation-subj-view.component.html'
})
export class CustConfirmationSubjViewComponent implements OnInit {

  VerfResultHId: number;
  AgrmntId: number;
  AppId: number;
  AgrmntNo: string;
  TaskListId: number;
  BizTemplateCode: string;
  VerfResultHList = new Array<VerfResultHObj>();
  AgrmntObj: AgrmntObj;
  AppObj: AppObj = new AppObj();
  LeadObj: LeadObj = new LeadObj();
  VerfResultObj: VerfResultObj;
  VerfResultHObj: VerfResultHObj = new VerfResultHObj();
  VerfResultHObjDetail: VerfResultHObj = new VerfResultHObj();
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();
  VerfResultDListObj = new Array<VerfResultDObj>();
  IsVerfDetail: boolean = false;
  cust: any;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_DETAIL;
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["VerfResultHId"] != null) {
        this.VerfResultHId = params["VerfResultHId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  ngOnInit() {
    this.GetData();
  }

  GetData() {
    var agrmntObj = {
      Id: this.AgrmntId
    };
    this.http.post<AgrmntObj>(URLConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response) => {
        this.AgrmntObj = response;

        var appObj = {
          Id: this.AgrmntObj.AppId
        };
        this.http.post<AppObj>(URLConstant.GetAppById, appObj).subscribe(
          (response) => {
            this.AppObj = response;
          });
        if (this.AgrmntObj.LeadId != null) {
          this.http.post<LeadObj>(URLConstant.GetLeadByLeadId, { Id: this.AgrmntObj.LeadId }).subscribe(
            (response) => {
              this.LeadObj = response;
            });
        }
      });

    this.http.post<VerfResultHObj>(URLConstant.GetVerfResultHById, {Id : this.VerfResultHId}).subscribe(
      (response) => {
        this.VerfResultHObj = response;

        var verfResultObj = {
          VerfResultId: this.VerfResultHObj.VerfResultId
        };
        this.http.post<VerfResultObj>(URLConstant.GetVerfResultById, {Id : this.VerfResultHObj.VerfResultId}).subscribe(
          (response) => {
            this.VerfResultObj = response;
          }
        );

        var verfResultHObj = {
          VerfResultId: this.VerfResultHObj.VerfResultId,
          MrVerfSubjectRelationCode: this.VerfResultHObj.MrVerfSubjectRelationCode
        };
        this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndSubjRelationCode, verfResultHObj).subscribe(
          (response) => {
            this.VerfResultHList = response["responseVerfResultHCustomObjs"];
          }
        );
      });
  }

  GetDetailVerf(TempVerfResultHId) {
    this.http.post<VerfResultHObj>(URLConstant.GetVerfResultHById, {Id : TempVerfResultHId}).subscribe(
      (response) => {
        this.VerfResultHObjDetail = response;
      });

    var verfResultDObj = {
      VerfResultHId: TempVerfResultHId
    };
    this.http.post(URLConstant.GetListVerfResultDInQuestionGrp, verfResultDObj).subscribe(
      (response) => {
        this.VerfResultDListObj = response[CommonConstant.ReturnObj];
        this.IsVerfDetail = true;
      });
  }

  BackVerfDetail() {
    this.IsVerfDetail = false;
  }

  openUrl(key:string) {
    if (key == "application") {
      AdInsHelper.OpenAppViewByAppId(this.AppObj.AppId);
    } else if (key == "lead") {
      AdInsHelper.OpenLeadViewByLeadId(this.AgrmntObj.LeadId);
    }
    else if (key == "agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntObj.AgrmntId);
    }else if( key == "customer"){
      this.CustNoObj.CustNo = this.AgrmntObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}

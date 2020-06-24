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

@Component({
  selector: 'app-cust-confirmation-subj-view',
  templateUrl: './cust-confirmation-subj-view.component.html',
  styleUrls: ['./cust-confirmation-subj-view.component.scss']
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
  AppObj: AppObj;
  VerfResultObj: VerfResultObj;
  VerfResultHObj: VerfResultHObj = new VerfResultHObj();
  VerfResultHObjDetail: VerfResultHObj = new VerfResultHObj();
  VerfResultDListObj = new Array<VerfResultDObj>();
  IsVerfDetail: boolean = false;
  appUrl: string;
  agrmntUrl: string;
  cust : any;
  custUrl : any;
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
    this.appUrl = environment.losR3Web + "/Nap/View/AppView?AppId=" + this.AppId;
    this.agrmntUrl = environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + this.AgrmntId;
     
    this.GetData();
  }

  GetData() {
    var agrmntObj = {
      AgrmntId: this.AgrmntId
    };
    this.http.post<AgrmntObj>(AdInsConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response) => {
        this.AgrmntObj = response;

        var appObj = {
          AppId: this.AgrmntObj.AppId
        };
        this.http.post<AppObj>(AdInsConstant.GetAppById, appObj).subscribe(
          (response) => {
            this.AppObj = response;
          },
          (error) => {
            console.log(error);
          }
        );
        var custObj = { CustNo: this.AgrmntObj.CustNo };
        this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
          (response) => {
            this.cust = response;
            this.custUrl = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" +this.cust.CustId;
          });

      },
      (error) => {
        console.log(error);
      }
    );

    var verfResultHObj = {
      VerfResultHId: this.VerfResultHId
    };
    this.http.post<VerfResultHObj>(AdInsConstant.GetVerfResultHById, verfResultHObj).subscribe(
      (response) => {
        this.VerfResultHObj = response;

        var verfResultObj = {
          VerfResultId: this.VerfResultHObj.VerfResultId
        };
        this.http.post<VerfResultObj>(AdInsConstant.GetVerfResultById, verfResultObj).subscribe(
          (response) => {
            this.VerfResultObj = response;
          },
          (error) => {
            console.log(error);
          }
        );

        var verfResultHObj = {
          VerfResultId: this.VerfResultHObj.VerfResultId,
          MrVerfSubjectRelationCode: this.VerfResultHObj.MrVerfSubjectRelationCode
        };
        this.http.post(AdInsConstant.GetVerfResultHsByVerfResultIdAndSubjRelationCode, verfResultHObj).subscribe(
          (response) => {
            this.VerfResultHList = response["responseVerfResultHCustomObjs"];
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetDetailVerf(TempVerfResultHId) {
    var verfResultHObj = {
      VerfResultHId: TempVerfResultHId
    };
    this.http.post<VerfResultHObj>(AdInsConstant.GetVerfResultHById, verfResultHObj).subscribe(
      (response) => {
        this.VerfResultHObjDetail = response;
      },
      (error) => {
        console.log(error);
      }
    );

    var verfResultDObj = {
      VerfResultHId: TempVerfResultHId
    };
    this.http.post(AdInsConstant.GetListVerfResultDInQuestionGrp, verfResultDObj).subscribe(
      (response) => {
        this.VerfResultDListObj = response["ReturnObject"];
        this.IsVerfDetail = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  BackVerfDetail() {
    this.IsVerfDetail = false;
  }

  openUrl(key) {
    if (key == "application") {
      window.open(environment.losR3Web + "/Nap/View/AppView?AppId=" + this.AppObj.AppId, "_blank");
    }
    else if (key == "agreement") {
      var bizTemplateCode = this.BizTemplateCode;

      if (bizTemplateCode == "CF4W" || bizTemplateCode == "CFRFN4W" || bizTemplateCode == "FACTORING") {
        window.open(environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + this.AgrmntObj.AgrmntId, "_blank");
      }
      else if (bizTemplateCode == "FL4W") {
        window.open(environment.losR3Web + "/Nap/FinanceLeasing/ViewAgrmnt?AgrmntId=" + this.AgrmntObj.AgrmntId, "_blank");
      }
    }
  }
}
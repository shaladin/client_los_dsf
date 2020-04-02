import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-cust-confirmation-subj-view',
  templateUrl: './cust-confirmation-subj-view.component.html',
  styleUrls: ['./cust-confirmation-subj-view.component.scss']
})
export class CustConfirmationSubjViewComponent implements OnInit {

  VerfResultHId: number;
  AgrmntId: number;
  VerfResultHList: any = [];
  AgrmntObj: any;
  AppObj: any;
  VerfResultObj: any;
  VerfResultHObj: any;
  VerfResultHObjDetail: any;
  VerfResultDListObj: any = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["VerfResultHId"] != null) {
        this.VerfResultHId = params["VerfResultHId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
    });
  }

  ngOnInit() {
    this.GetData();
  }

  GetData() {
    var agrmntObj = {
      AgrmntId: this.AgrmntId
    };
    this.http.post(AdInsConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response) => {
        this.AgrmntObj = response;

        var appObj = {
          AppId: this.AgrmntObj.AppId
        };
        this.http.post(AdInsConstant.GetAppByIds, appObj).subscribe(
          (response) => {
            this.AppObj = response;
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

    var verfResultHObj = {
      VerfResultHId: this.VerfResultHId
    };
    this.http.post(AdInsConstant.GetVerfResultHById, verfResultHObj).subscribe(
      (response) => {
        this.VerfResultHObj = response;

        var verfResultObj = {
          VerfResultId: this.VerfResultHObj.VerfResultId
        };
        this.http.post(AdInsConstant.GetVerfResultById, verfResultObj).subscribe(
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
            this.VerfResultHList = response;
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
    this.http.post(AdInsConstant.GetVerfResultHById, verfResultHObj).subscribe(
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
    this.http.post(AdInsConstant.GetVerfResultHById, verfResultDObj).subscribe(
      (response) => {
        this.VerfResultDListObj = response;
      },
      (error) => {
        console.log(error);
      }
    );

  }
}
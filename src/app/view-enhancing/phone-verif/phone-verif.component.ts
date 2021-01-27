import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-phone-verif',
  templateUrl: './phone-verif.component.html',
})
export class PhoneVerifComponent implements OnInit {

  isViewSubDetail: boolean = false;

  viewObj: any;

  appId: number = 0;
  verfResultHId: number = 0;

  appObj = {
    AppId: 0,
  };

  verfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodePhn,
  };

  verfResHObj = {
    VerfResultHId: 0,
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };

  verfResDObj = {
    VerfResultHId: 0,
  };


  phoneVerifObj: any;
  AppObj: AppObj = new AppObj();
  verifResultObj: any;
  verifResultHObj: any;
  verifResultHDetailObj: any;
  listVerifResultHObj: any;
  listVerifResultDObj: any;
  subjectName: string;
  arrValue = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];
      this.subjectName = params["Name"];
    });
  }

  async ngOnInit(): Promise<void> {
    this.appObj.AppId = this.appId;
    this.verfResHObj.VerfResultHId = this.verfResultHId;
    this.arrValue.push(this.appId);
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetVerfResultHData();
    await this.GetListVerfResulHtData(this.verfResHObj);
  }

  async GetAppData() {
    await this.http.post<AppObj>(URLConstant.GetAppById, this.appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post(URLConstant.GetVerfResultHById, this.verfResHObj).toPromise().then(
      (response) => {
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj) {
    await this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode, verfResHObj).toPromise().then(
      (response) => {
        this.listVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  ViewSubjDetail(VerfResultHId) {
    this.verifResultHDetailObj = this.listVerifResultHObj.filter(
      vrh => vrh.VerfResultHId === VerfResultHId);
    this.isViewSubDetail = true;
    this.verfResDObj.VerfResultHId = VerfResultHId;
    this.http.post(URLConstant.GetListVerfResultDInQuestionGrp, this.verfResDObj).subscribe(
      (response) => {
        this.listVerifResultDObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  BackSubj() {
    this.isViewSubDetail = false;
  }
}

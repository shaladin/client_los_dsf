import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-survey-subject-view-x',
  templateUrl: './survey-subject-view-x.component.html',
  providers: [NGXToastrService]
})
export class SurveySubjectViewXComponent implements OnInit {

  isViewSubDetail: boolean = false;
  getVerfResultUrl: any;
  getAppUrl: any;
  getListVerfResulHtUrl: any;
  getVerfResulHtUrl: any;
  getVerfResultDUrl: any;

  viewObj: any;

  appId: any;
  verfResultHId: any;

  appObj = {
    id: 0,
  };

  verfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodeSurvey
  };

  verfResHObj = {
    id: 0,
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };

  verfResDObj = {
    id: 0,
  };


  phoneVerifObj: any;
  AppObj: any;
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

  initUrl() {
    this.getAppUrl = URLConstant.GetAppById;
    this.getVerfResultUrl = URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.getListVerfResulHtUrl = URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode;
    this.getVerfResulHtUrl = URLConstant.GetVerfResultHById;
    this.getVerfResultDUrl = URLConstant.GetListVerfResultDInQuestionGrp;
  }

  async ngOnInit(): Promise<void> {
    this.initUrl();
    this.appObj.id = this.appId;
    this.verfResHObj.id = this.verfResultHId;
    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetVerfResultHData();
    await this.GetListVerfResulHtData(this.verfResHObj);
    await this.ViewSubjDetail(this.verfResultHId);
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post(this.getVerfResulHtUrl, this.verfResHObj).toPromise().then(
      (response) => {
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj) {
    await this.http.post(this.getListVerfResulHtUrl, verfResHObj).toPromise().then(
      (response) => {
        this.listVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  ViewSubjDetail(VerfResultHId) {
    // this.verifResultHDetailObj = this.listVerifResultHObj.filter(
    //   vrh => vrh.VerfResultHId === VerfResultHId);
    // this.isViewSubDetail = true;
    this.verfResDObj.id = VerfResultHId;
    this.http.post(this.getVerfResultDUrl, this.verfResDObj).subscribe(
      (response) => {
        this.listVerifResultDObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  BackSubj() {
    this.isViewSubDetail = false;
  }
}

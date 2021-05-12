import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqGetVerfResult4Obj, ReqGetVerfResultObj } from 'app/shared/model/VerfResult/ReqGetVerfResultObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';




@Component({
  selector: "phone-verification-subject-view",
  templateUrl: "./phone-verification-subject-view.component.html",
  providers: [NGXToastrService]
})
export class PhoneVerificationSubjectViewComponent implements OnInit {

  isViewSubDetail: boolean = false;
  appId: any;
  verfResultHId: any;
  IsViewReady: boolean = false;
  
  appObj = {
    AppId: 0,
  };

  verfResObj: ReqGetVerfResultObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodePhn,
  };

  verfResHObj: ReqGetVerfResult4Obj = {
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };

  verfResDObj = {
    VerfResultHId: 0,
  };


  phoneVerifObj: any;
  AppObj: any;
  verifResultObj: any;
  verifResultHObj: any;
  verifResultHDetailObj: any;
  listVerifResultHObj: any;
  listVerifResultDObj: any;
  subjectName: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];
      this.subjectName = params["Name"];
    });
  }

  async ngOnInit(): Promise<void> {
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetVerfResultHData();
    await this.GetListVerfResulHtData(this.verfResHObj);
  }

  async GetAppData() {
    var appObj = { Id: this.appId };
    await this.http.post(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
        this.IsViewReady = true;
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
    await this.http.post(URLConstant.GetVerfResultHById, {Id : this.verifResultObj.VerfResultId}).toPromise().then(
      (response) => {
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj: ReqGetVerfResult4Obj) {
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
    let verfResultDObj: GenericObj = new GenericObj();
    verfResultDObj.Id = VerfResultHId;
    this.http.post(URLConstant.GetListVerfResultDInQuestionGrp, verfResultDObj).subscribe(
      (response) => {
        this.listVerifResultDObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  BackSubj() {
    this.isViewSubDetail = false;
  }

  test(item) {
  }
}

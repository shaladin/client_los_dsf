import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqGetVerfResult4Obj, ReqGetVerfResultObj } from 'app/shared/model/VerfResult/ReqGetVerfResultObj.Model';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';

@Component({
  selector: 'app-phone-verif',
  templateUrl: './phone-verif.component.html',
})
export class PhoneVerifComponent implements OnInit {

  isViewSubDetail: boolean = false;

  viewObj: any;

  appId: number = 0;
  verfResultHId: number = 0;

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
  AppObj: AppObj = new AppObj();
  verifResultObj: VerfResultObj = new VerfResultObj();
  verifResultHObj: VerfResultHObj = new VerfResultHObj();
  verifResultHDetailObj: any;
  listVerifResultHObj: Array<VerfResultHObj> = new Array<VerfResultHObj>();
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
    this.arrValue.push(this.appId);
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetVerfResultHData();
    await this.GetListVerfResulHtData(this.verfResHObj);
  }

  async GetAppData() {
    let tempReq: GenericObj = new GenericObj();
    tempReq.Id = this.appId;
    await this.http.post<AppObj>(URLConstant.GetAppById, tempReq).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post<VerfResultObj>(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post<VerfResultHObj>(URLConstant.GetVerfResultHById, {Id : this.verifResultObj.VerfResultId}).toPromise().then(
      (response) => {
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj: ReqGetVerfResult4Obj) {
    await this.http.post<{ responseVerfResultHCustomObjs: Array<VerfResultHObj> }>(URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode, verfResHObj).toPromise().then(
      (response) => {
        this.listVerifResultHObj = response.responseVerfResultHCustomObjs;
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
}
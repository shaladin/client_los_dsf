import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqGetVerfResult4Obj, ReqGetVerfResultObj } from 'app/shared/model/VerfResult/ReqGetVerfResultObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';




@Component({
  selector: "phone-verification-subject-view",
  templateUrl: "./phone-verification-subject-view.component.html",
  providers: [NGXToastrService]
})
export class PhoneVerificationSubjectViewComponent implements OnInit {

  isViewSubDetail: boolean = false;
  appId: number = 0;
  IsViewReady: boolean = false;
  
  verfResObj: ReqGetVerfResultObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodePhn,
  };

  verfResHObj: ReqGetVerfResult4Obj = {
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };

  verifResultHDetailObj: any;
  listVerifResultHObj: Array<VerfResultHObj> = new Array();
  listVerifResultDObj: Array<any>;
  subjectName: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {

    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {        
        this.appId = params["AppId"];
      }
      if (params["Name"] != null) {        
        this.subjectName = params["Name"];
      }
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
    await this.http.post<AppObj>(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.verfResObj.TrxRefNo = response.AppNo;
        this.IsViewReady = true;
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post<VerfResultObj>(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, this.verfResObj).toPromise().then(
      (response) => {
        this.verfResHObj.VerfResultId = response.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post<VerfResultHObj>(URLConstant.GetVerfResultHById, {Id : this.verfResHObj.VerfResultId}).toPromise().then(
      (response) => {
        this.verfResHObj.MrVerfObjectCode = response.MrVerfObjectCode;
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
}

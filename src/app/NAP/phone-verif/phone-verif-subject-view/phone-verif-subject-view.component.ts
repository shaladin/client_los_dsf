import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { environment } from '../../../../environments/environment';
import { VerfResultObj } from '../../../shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';



@Component({
  selector: "phone-verif-subject-view",
  templateUrl: "./phone-verif-subject-view.component.html",
  providers: [NGXToastrService]
})
export class PhnVerifSubjectViewComponent implements OnInit {

  isViewSubDetail: boolean = false;
  getVerfResultUrl: any;
  getAppUrl: any;
  getListVerfResulHtUrl: any;
  getVerfResulHtUrl: any;

  viewObj: any;

  appId: any;
  verfResultHId: any;

  appObj = {
    AppId: 0,
  };

  verfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: "PHN_VERIF",
  };

  verfResHObj = {
    VerfResultHId: 0,
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };


  phoneVerifObj: any;
  AppObj: any;
  verifResultObj: any;
  verifResultHObj: any;
  verifResultHDetailObj: any;
  listVerifResultHObj: any;

  subjectName: string;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];
      this.subjectName = params["Name"];
    });
  }

  initUrl() {
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVerfResultUrl = AdInsConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.getListVerfResulHtUrl = AdInsConstant.GetVerfResultHsByVerfResultIdAndObjectCode;
    this.getVerfResulHtUrl = AdInsConstant.GetVerfResultHById;
  }

  async ngOnInit(): Promise<void> {
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.verfResHObj.VerfResultHId = this.verfResultHId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData(this.appObj);
    await this.GetVerfResultData(this.verfResObj);
    await this.GetVerfResultHData(this.verfResHObj);

  }

  async GetAppData(appObj) {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        console.log(response);
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  async GetVerfResultData(verfResObj) {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData(verfResHObj) {
    await this.http.post(this.getVerfResulHtUrl, this.verfResHObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj) {
    await this.http.post(this.getListVerfResulHtUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.listVerifResultHObj = response;
      }
    );
  }

  ViewSubjDetail(VerfResultHId) {
    this.verifResultHDetailObj = this.listVerifResultHObj.filter(
      vrh => vrh.VerfResultHId === VerfResultHId);
    this.isViewSubDetail == true;
  }

  BackSubj() {
    this.isViewSubDetail == false;
  }
}

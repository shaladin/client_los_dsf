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
  selector: "phone-verif-subject",
  templateUrl: "./phone-verif-subject.component.html",
  providers: [NGXToastrService]
})
export class PhnVerifSubjectComponent implements OnInit {

  getPhoneVerifSubjUrl: any;
  getVerfResultUrl: any;
  getAppUrl: any;
  addVerfResultUrl: any;

  ReturnHandlingForm = this.fb.group({
    IsAnyUpdate: [''],
    UpdateNotes: ['']
  });
  viewObj: any;

  appId: any;
  appObj = {
    AppId: 0,
  };
  verfResObj =
    {
      TrxRefNo: "",
      MrVerfTrxTypeCode: "PHN_VERIF",
    };
  phoneVerifObj: any;
  AppObj: any;
  verifResultObj: any;
  addVerifResultObj: VerfResultObj;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    });
  }

  initUrl() {
    this.getPhoneVerifSubjUrl = AdInsConstant.GetAppPhoneVerifSubjectListByAppId;
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVerfResultUrl = AdInsConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.addVerfResultUrl = AdInsConstant.AddVerfResult;
  }

  async ngOnInit(): Promise<void> {
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData(this.appObj);
    await this.GetVerfResultData(this.verfResObj);
    await this.GetPhnVerfSubjData(this.appObj);

  }

  //SaveForm() {
  //  if (this.isCalculated == false) {
  //    this.toastr.errorMessage("Please Calculate First");
  //  }
  //  else {
  //    this.calculating()
  //    if (this.maxAllocatedAmt < this.totalRsvFundAmt) {
  //      this.toastr.errorMessage("Total Reserved Fund Amount Must be Less Than Remaining Allocated Amount");
  //    }
  //    else {
  //      this.setAppReservedFundData();
  //      this.http.post(this.addEditVerfResultUrl, this.allAppReservedFundObj).subscribe(
  //        (response) => {
  //          console.log(response);
  //          this.toastr.successMessage(response["message"]);
  //        },
  //        (error) => {
  //          console.log(error);
  //        }
  //      );
  //    }
  //  }
  //}

  async GetAppData(appObj) {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        console.log(response);
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  GetPhnVerfSubjData(appObj) {
    this.http.post(this.getPhoneVerifSubjUrl, this.appObj).subscribe(
      (response) => {
        this.phoneVerifObj = response;
        console.log(this.phoneVerifObj);
      }
    );
  }

  async GetVerfResultData(verfResObj) {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultObj = response;

      }
    );
    if (this.verifResultObj == "") {
      var Business_Date = localStorage.getItem('BusinessDate');
      var datePipe = new DatePipe("en-US");
      var value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      var businessDt = new Date(value);

      var useraccess = localStorage.getItem('UserAccess');
      console.log(useraccess);
      this.addVerifResultObj = new VerfResultObj();

      this.addVerifResultObj.TrxRefNo = this.AppObj.AppNo;
      this.addVerifResultObj.VerfDt = businessDt;
      this.addVerifResultObj.EmpNo = "-";
      this.addVerifResultObj.MrVerfResultStatCode = "NEW";
      this.addVerifResultObj.MrVerfTrxTypeCode = "PHN_VERIF";
      this.addVerifResultObj.LobCode = this.AppObj.LobCode;
      this.addVerifResultObj.LobName = this.AppObj.LobCode;
      this.addVerifResultObj.Notes = "-";

      this.http.post(this.addVerfResultUrl, this.addVerifResultObj).subscribe(
        (response) => {
          console.log(response);
        }
      );
    }
  }





  test() {
    console.log(this.phoneVerifObj);
    window.open("http://localhost:4200", "_blank");
  }
}

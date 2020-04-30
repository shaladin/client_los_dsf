import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';
import { ReturnHandlingDObj } from '../../../../../shared/model/ReturnHandling/ReturnHandlingDObj.Model';



@Component({
  selector: 'app-return-handling-collateral-edit',
  templateUrl: './return-handling-collateral-edit.component.html',
  providers: [NGXToastrService]
})
export class ReturnHandlingCollateralEditComponent implements OnInit {

  getAppUrl: any;
  rtnHandlingDUrl: any;
  editRtnHandlingDUrl: any;
  getListAppCollateralUrl: any;
  isReturnHandling: boolean = false;

  ReturnHandlingForm = this.fb.group({
    ExecNotes: ['', Validators.maxLength(4000)],
  });
  viewObj: any;

  appId: any;
  returnHandlingDId: any;
  wfTaskListId: any;

  appObj = {
    AppId: 0,
  };

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
  };

  appCollObj = {
    AppCollateralId: 0,
  };

  appCollateralObj: any;
  AppObj: any;
  returnHandlingDObj: any;
  ReturnHandlingDData: ReturnHandlingDObj;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['ReturnHandlingDId'] != null) {
        this.returnHandlingDId = params['ReturnHandlingDId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  initUrl() {
    this.getListAppCollateralUrl = AdInsConstant.GetListAppCollateralByAppId;
    this.getAppUrl = AdInsConstant.GetAppById;
    this.rtnHandlingDUrl = AdInsConstant.GetReturnHandlingDByReturnHandlingDId;
    this.editRtnHandlingDUrl = AdInsConstant.EditReturnHandlingD;
  }

  async ngOnInit(): Promise<void> {
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData();
    await this.GetAppCollateralData();
    if (this.isReturnHandling == true) {
      this.GetReturnHandlingD();
    }
  }

  SaveForm() {
    if (this.isReturnHandling == false) {

    }
    if (this.isReturnHandling == true) {
      this.setReturnHandlingD();
      this.http.post(this.editRtnHandlingDUrl, this.ReturnHandlingDData).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

  setReturnHandlingD() {
    this.ReturnHandlingDData = new ReturnHandlingDObj();
    this.ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = "DONE";
    this.ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        console.log(response);
        this.AppObj = response;
      }
    );
  }

  GetAppCollateralData() {
    this.http.post(this.getListAppCollateralUrl, this.appObj).subscribe(
      (response) => {
        this.appCollateralObj = response["ReturnObject"];
        console.log(this.appCollateralObj);
      }
    );
  }


  async GetReturnHandlingD() {
    this.rtnHandlingDObj.ReturnHandlingDId = this.returnHandlingDId;
    await this.http.post(this.rtnHandlingDUrl, this.rtnHandlingDObj).toPromise().then(
      (response) => {
        console.log(response);
        this.returnHandlingDObj = response;

      }
    );
  }

  Delete(AppCollateralId) {
    if (confirm('Are you sure to delete this data?')) {
      this.appCollObj.AppCollateralId = AppCollateralId;
      this.http.post(AdInsConstant.DeleteAppCollateral, this.appCollObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.GetAppCollateralData();
        },
        (error) => {
          console.log(error);
        }
      );
    }

  }

  AddEdit(AppCollateralId) {
    if (this.isReturnHandling == false) {

    }
    if (this.isReturnHandling == true) {
      this.router.navigateByUrl("/Nap/AdditionalProcess/ReturnHandlingCollateral/Detail?AppId=" + this.appId + "&AppCollateralId=" + AppCollateralId + "&ReturnHandlingDId=" + this.returnHandlingDId + "&WfTaskListId=" + this.wfTaskListId);
    }

  }
}

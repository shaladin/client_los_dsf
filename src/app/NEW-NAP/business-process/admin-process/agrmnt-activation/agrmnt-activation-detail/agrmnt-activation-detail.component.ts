import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdminProcessService } from 'app/NEW-NAP/business-process/admin-process/admin-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-agrmnt-activation-detail',
  templateUrl: './agrmnt-activation-detail.component.html',
  providers: [AdminProcessService, NGXToastrService]
})
export class AgrmntActivationDetailComponent implements OnInit {
  arrValue = [];
  AssetObj: any;
  AppFees: Object;
  AppFinData: Object;
  listSelectedId: any = new Array();
  tempListId: any = new Array();
  tempData: any = new Array();
  arrAddCrit: any;
  arrCrit: any;
  AppId: number;
  isOverwrite: boolean;
  AgrmntNo: string;
  CreateDt: Date;
  WfTaskListId: number;
  TrxNo: string;
  AgrmntActForm: FormGroup;
  BizTemplateCode: string;
  IsEnd: boolean = false;
  constructor(private fb: FormBuilder, private toastr: NGXToastrService, private route: ActivatedRoute, private adminProcessSvc: AdminProcessService, private router: Router, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["WFTaskListId"];
      this.TrxNo = params["TrxNo"];
    });

    this.AgrmntActForm = fb.group({
      'CreateDt': [this.CreateDt, Validators.compose([Validators.required])],
      'AgrmntNo': [''],
      'isOverwrite': [this.isOverwrite]
    });
    this.AgrmntActForm.controls['AgrmntNo'].disable();
  }
  onChange() {
    console.log(this.CreateDt);
    if (this.isOverwrite == true) {
      this.AgrmntActForm.controls['AgrmntNo'].setValidators([Validators.required]);
      this.AgrmntActForm.controls['AgrmntNo'].updateValueAndValidity();
      this.AgrmntActForm.controls['AgrmntNo'].enable();
    }
    else {
      this.AgrmntActForm.controls['AgrmntNo'].clearValidators();
      this.AgrmntActForm.controls['AgrmntNo'].updateValueAndValidity();
      this.AgrmntActForm.controls['AgrmntNo'].disable();
      this.AgrmntActForm.patchValue({
        'AgrmntNo': ''
      });
    }
  }
  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.arrValue.push(this.AppId);
    this.ClaimTask(this.WfTaskListId);
    var obj = {
      AppId: this.AppId
    };

    this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
      console.log(response);
      this.AssetObj = response["ListAppAsset"];
      console.log(this.AssetObj);
    });

  }

  async ClaimTask(WfTaskListId) {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext["UserName"], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  addToTemp() {
    if (this.listSelectedId.length != 0) {
      for (var i = 0; i < this.listSelectedId.length; i++) {
        this.tempListId.push(this.listSelectedId[i]);
        var object = this.AssetObj.find(x => x.AppAssetId == this.listSelectedId[i]);
        this.tempData.push(object);
      }

      var obj = {
        AppId: this.AppId,
        ListAppAssetId: this.tempListId
      };

      this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
        this.AssetObj = response["ListAppAsset"];
        if (this.AssetObj.length == 0)
          this.IsEnd = true;
        // console.log(this.IsEnd);
        var objFinDataAndFee = {
          AppId: this.AppId,
          ListAppAssetId: this.tempListId,
          IsEnd: this.IsEnd
        };
        this.adminProcessSvc.GetAppFinDataAndFeeByAppIdAndListAppAssetId(objFinDataAndFee).subscribe((response) => {
          this.AppFees = response["ListAppFeeObj"];
          this.AppFinData = response["AppFinDataObj"];
        })
      });

      this.listSelectedId = new Array();

    } else {
      this.toastr.typeErrorCustom("Please select at least one Asset");
    }
  }
  Checked(AppAssetId: any, isChecked: any): void {
    if (isChecked) {
      this.listSelectedId.push(AppAssetId);
    } else {
      const index = this.listSelectedId.indexOf(AppAssetId)
      console.log(index);
      if (index > -1) { this.listSelectedId.splice(index, 1); }
    }
    console.log('Sel', this.listSelectedId);
  }
  Submit() {
    this.markFormTouched(this.AgrmntActForm);
    if (this.tempListId.length == 0) {
      this.toastr.typeErrorCustom("Please select at least one Asset");
      return;
    }
    if (this.AgrmntActForm.valid) {
      var Obj = {
        CreateDt: this.CreateDt,
        ListAppAssetId: this.tempListId,
        TaskListId: this.WfTaskListId,
        TransactionNo: this.TrxNo,
        AgreementNo: this.AgrmntNo,
        IsEnd: this.IsEnd
      }
      this.adminProcessSvc.SubmitAgrmntActivationByHuman(Obj).subscribe((response) => {
        var link = environment.losR3Web + "/Nap/AdminProcess/AgrmntActivation/Paging?BizTemplateCode=" + this.BizTemplateCode;
        this.router.navigate([]).then(result => { window.open(link, '_self'); });
      });
    }
  }

  deleteFromTemp(AppAssetId: string) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var index: number = this.tempListId.indexOf(AppAssetId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var obj = {
        AppId: this.AppId,
        ListAppAssetId: this.tempListId
      };

      this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
        this.AssetObj = response["ListAppAsset"];
      });

    }
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };

  Cancel() {
    var link = environment.losR3Web + "/Nap/AdminProcess/AgrmntActivation/Paging?BizTemplateCode=" + this.BizTemplateCode;
    this.router.navigate([]).then(result => { window.open(link, '_self'); });
  }
}

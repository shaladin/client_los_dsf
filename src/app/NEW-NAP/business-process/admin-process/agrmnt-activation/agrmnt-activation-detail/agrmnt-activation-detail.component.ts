import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdminProcessService } from 'app/NEW-NAP/business-process/admin-process/admin-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-agrmnt-activation-detail',
  templateUrl: './agrmnt-activation-detail.component.html',
  providers: [AdminProcessService]
})
export class AgrmntActivationDetailComponent implements OnInit {
  arrValue = [];
  AssetObj: any;
  AppFees: Object;
  AppFinData: Object;
  listSelectedId: any = new Array();
  AppId: number;
  isOverwrite: boolean;
  AgrmntNo: string;
  CreateDt: Date;
  WfTaskListId: number;
  TrxNo: string;
  AgrmntActForm: FormGroup;
  BizTemplateCode: string;
  IsEnd: boolean = false;
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();

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
    console.log("aaa")
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.arrValue.push(this.AppId);
    this.ClaimTask(this.WfTaskListId);

    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/AgrmntActivationTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.losUrl;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/AgrmntActivationTempPaging.json";
    this.tempPagingObj.isReady = true;
    this.tempPagingObj.isSearched = true;
    this.tempPagingObj.delay = 1000;
    this.tempPagingObj.isHideSearch = true;

    let whereValueObj = new WhereValueObj();
    whereValueObj.property = "AppId";
    whereValueObj.value = this.AppId;
    this.tempPagingObj.whereValue.push(whereValueObj);
  }

  async ClaimTask(WfTaskListId) {
    let currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext["UserName"], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
    this.IsEnd = false;
    if(this.listSelectedId.length == 0){
      this.AppFees = null;
      this.AppFinData = null;
    }else{
      let obj = {
        AppId: this.AppId,
        ListAppAssetId: this.listSelectedId
      };
  
      this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
        this.AssetObj = response["ListAppAsset"];
        if (this.AssetObj.length == 0)
          this.IsEnd = true;
        let objFinDataAndFee = {
          AppId: this.AppId,
          ListAppAssetId: this.listSelectedId,
          IsEnd: this.IsEnd
        };
        this.adminProcessSvc.GetAppFinDataAndFeeByAppIdAndListAppAssetId(objFinDataAndFee).subscribe((response) => {
          this.AppFees = response["ListAppFeeObj"];
          this.AppFinData = response["AppFinDataObj"];
        })
      });
    }

    
  }

  Submit() {
    this.markFormTouched(this.AgrmntActForm);
    if (this.listSelectedId.length == 0) {
      this.toastr.typeErrorCustom("Please select at least one Asset");
      return;
    }
    if (this.AgrmntActForm.valid) {
      let Obj = {
        CreateDt: this.CreateDt,
        ListAppAssetId: this.listSelectedId,
        TaskListId: this.WfTaskListId,
        TransactionNo: this.TrxNo,
        AgreementNo: this.AgrmntNo,
        IsEnd: this.IsEnd
      }
      this.adminProcessSvc.SubmitAgrmntActivationByHuman(Obj).subscribe((response) => {
        this.router.navigate(["/Nap/AdminProcess/AgrmntActivation/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode} });
      });
    }
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  }
}

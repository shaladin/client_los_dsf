import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdminProcessService, ReqAppAssetAgreementActivationObj } from 'app/NEW-NAP/business-process/admin-process/admin-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReqGetAppFinDataAndFeeObj } from 'app/shared/model/Request/NAP/AgrAct/ReqAppFinDataAndFee.model';
import { ResAgrmntActivationFinDataAndFeeObj, ResAppFeeObj, ResponseAppFinDataObj } from 'app/shared/model/Response/NAP/AgrAct/ResAgrmntActivationFinDataAndFeeObj.model';
import { ToastrService } from 'ngx-toastr';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-agrmnt-activation-detail',
  templateUrl: './agrmnt-activation-detail.component.html',
  providers: [AdminProcessService]
})
export class AgrmntActivationDetailComponent implements OnInit {
  AssetObj: any;
  AppFees: Array<ResAppFeeObj> = new Array<ResAppFeeObj>();
  AppFinData: ResponseAppFinDataObj = new ResponseAppFinDataObj();
  listSelectedId: Array<number> = new Array<number>();
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
  IsViewReady: boolean = false;

  getAppUrl: string = '';
  appObj = {
    AppId: 0,
  };
  AppObj: AppObj = new AppObj();
  businessDt: Date;
  toastRef: any;
  
  isNeedExtension: boolean = false;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_AGRMNT_ACT_PAGING;
  constructor(private fb: FormBuilder, private toastr: NGXToastrService, private route: ActivatedRoute, private adminProcessSvc: AdminProcessService, private router: Router, private http: HttpClient, private cookieService: CookieService, private toastrSvc: ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["WFTaskListId"];
      this.TrxNo = params["TrxNo"];
    });

    this.AgrmntActForm = this.fb.group({
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

  async ngOnInit() {
    await this.CheckApvResultExp();
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.ClaimTask(this.WfTaskListId);

    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/AgrmntActivationTempPaging.json";
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

  ngOnDestroy() {
    if(this.toastRef != undefined && this.toastRef != null){
      this.toastrSvc.clear(this.toastRef.toastId);
    }
  }

  async GetAppData() {
    this.appObj.AppId = this.AppId;
    this.getAppUrl = URLConstant.GetAppById;
    await this.http.post < AppObj > (this.getAppUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
      }
    );
  }
  async CheckApvResultExp() {
    //get bis date
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    await this.GetAppData();
    if (this.AppObj.CrdApvResultExpDt != null && this.AppObj.CrdApvResultExpDt != undefined) {
      if (this.businessDt > new Date(this.AppObj.CrdApvResultExpDt)) {
      this.isNeedExtension = true;
        this.toastRef = this.toastrSvc.error(null, "Need Extension", {
          disableTimeOut: true,
          tapToDismiss: false,
          closeButton: true
        });
      }
    }
  }

  async ClaimTask(WfTaskListId) {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
      let obj: ReqAppAssetAgreementActivationObj = {
        AppId: this.AppId,
        ListAppAssetId: this.listSelectedId
      };
  
      this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
        this.AssetObj = response["ListAppAsset"];
        if (this.AssetObj.length == 0)
          this.IsEnd = true;
        let objFinDataAndFee = new ReqGetAppFinDataAndFeeObj();
        objFinDataAndFee.AppId = this.AppId;
        objFinDataAndFee.ListAppAssetId = this.listSelectedId;
        objFinDataAndFee.IsEnd = this.IsEnd;
        this.adminProcessSvc.GetAppFinDataAndFeeByAppIdAndListAppAssetId(objFinDataAndFee).subscribe((response : ResAgrmntActivationFinDataAndFeeObj) => {
          this.AppFees = response.ListAppFeeObj;
          this.AppFinData = response.AppFinDataObj;
        })
      });
    }
  }

  Submit() {
    
    if(this.isNeedExtension){
      this.toastr.typeErrorCustom("Need Extension");
      return;
    }

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
        AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { BizTemplateCode: this.BizTemplateCode });
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

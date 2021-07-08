import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { CustomClaimWorkflowObj } from 'app/shared/model/Workflow/CustomClaimWorkflowObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { PreGoLiveOplService } from '../pre-go-live-opl.service';

@Component({
  selector: 'app-pre-go-live-opl-detail',
  templateUrl: './pre-go-live-opl-detail.component.html',
  styleUrls: []
})
export class PreGoLiveOplDetailComponent implements OnInit {
  ListItem: Array<any> = new Array<any>();
  ApvDt: string;
  AppId: number;
  WfTaskListIds: string;
  appTC: AppTCObj;
  ListAppTCObj: ListAppTCObj;
  
  
  ListAppAssetId: Array<number> = new Array<number>();

  IsCheckedAll: boolean = false;
  HasApproveFinal: boolean = false;
  
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  inputGridObj: InputGridObj = new InputGridObj();

  PreGoLiveForm = this.fb.group({
    EffDt: ['', [Validators.required]],
    Notes: ['', [Validators.maxLength(4000)]]
  });

  constructor(private preGoLiveOplService: PreGoLiveOplService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private http: HttpClient, 
    private cookieService: CookieService) {
      this.route.queryParams.subscribe(params => {
        if (params["AppId"] != null) {
          this.AppId = params["AppId"];
        }
        if (params["WfTaskListIds"] != null) {
          this.WfTaskListIds = params["WfTaskListIds"];
        }
      });
    }

  async ngOnInit() {
    this.claimTask();
    await this.SetMainInfo();
    await this.SetListItem();
    await this.SetTCInfo();
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
  }

  async SetListItem() {
    if(this.preGoLiveOplService.getList() !== undefined){
      if(this.preGoLiveOplService.getList().length > 0){
        this.preGoLiveOplService.getList().forEach(element => {
          this.ListItem.push(element);
          this.ListAppAssetId.push(element.AppAssetId);
        });
        this.ApvDt = formatDate(this.ListItem[0].ApvDt,'yyyy-MM-dd','en-US');
        this.preGoLiveOplService.clearList();
      }
      else{
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_OPL_PAGING], { BizTemplateCode: "OPL" });
      }
    }
    else{
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_OPL_PAGING], { BizTemplateCode: "OPL" });
    }
  }

  async SetTCInfo() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";

    var AppObj = {
      Id: this.AppId
    }

    await this.http.post(URLConstant.GetListTCbyAppId, AppObj).toPromise().then(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppTcs"]
      }
    );
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_OPL_PAGING], { BizTemplateCode: "OPL" });
  }

  SaveForm() {
    var WfTaskListIdNum : Array<number> = new Array<number>();
    var WfTaskListIdsStr = this.WfTaskListIds.split(";");
    for (let i = 0; i < WfTaskListIdsStr.length; i++) {
      const idString = WfTaskListIdsStr[i];
      WfTaskListIdNum.push(Number.parseInt(idString));
    }

    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.ListAppTCObj = new ListAppTCObj();
    this.ListAppTCObj["ListAppTcObj"] = new Array();

    for (var i = 0; i < this.PreGoLiveForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.PreGoLiveForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.PreGoLiveForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.PreGoLiveForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.PreGoLiveForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.PreGoLiveForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.PreGoLiveForm.getRawValue().TCList[i].IsChecked;
      this.appTC.IsWaived = this.PreGoLiveForm.getRawValue().TCList[i].IsWaived;
      this.appTC.ExpiredDt = this.PreGoLiveForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.PreGoLiveForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.PreGoLiveForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.PreGoLiveForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.PreGoLiveForm.value.TCList[i].Notes;
      this.appTC.RowVersion = this.PreGoLiveForm.value.TCList[i].RowVersion;

      var prmsDt = new Date(this.appTC.PromisedDt);
      var prmsDtForm = this.PreGoLiveForm.value.TCList[i].PromisedDt;

      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.ListAppTCObj["ListAppTcObj"].push(this.appTC);

    }
    
    var requestPreGoLiveObj = {
      EffDt: this.PreGoLiveForm.value.EffDt,
      Notes: this.PreGoLiveForm.value.Notes,
      AppAssetIds: this.ListAppAssetId,
      WfTaskListIds: WfTaskListIdNum,
      RListAppTcObj: this.ListAppTCObj
    }

    this.http.post(URLConstant.SubmitPreGoLiveOpl, requestPreGoLiveObj).subscribe(
      (response) => {
        this.toastr.successMessage("");
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_OPL_PAGING], { BizTemplateCode: "OPL" });
      }
    );
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
  
  claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: CustomClaimWorkflowObj = new CustomClaimWorkflowObj();
    wfClaimObj.listWFTaskListID = this.WfTaskListIds.split(";");
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimListTask, wfClaimObj).subscribe(
      (response) => {
      });
  }


}

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
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
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
    var requestPreGoLiveObj = {
      EffDt: this.PreGoLiveForm.value.EffDt,
      Notes: this.PreGoLiveForm.value.Notes,
      AppAssetIds: this.ListAppAssetId,
      WfTaskListIds: WfTaskListIdNum
    }

    this.http.post(URLConstant.SubmitPreGoLiveOpl, requestPreGoLiveObj).subscribe(
      (response: any) => {
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

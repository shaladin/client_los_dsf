import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent implements OnInit {
  readonly urlDetail: string = NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT_DETAIL;
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: any;
  arrValue: Array<number> = [];
  AppAssetList = [];
  tcForm: FormGroup = this.fb.group({
  });
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  dmsAppObj: DMSObj;
  mouCustNo: string;
  isDmsAppReady: boolean;

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
    });
  }

  async ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      AgrmntId: this.AgrmntId
    }
    this.claimTask();
    this.http.post(URLConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
      (response) => {
        this.AppAssetList = response[CommonConstant.ReturnObj];
      });
    await this.InitDms();
  }

  async InitDms() {
    this.isDmsReady = false;
    this.dmsObj = new DMSObj();
    this.dmsAppObj = new DMSObj();
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;

    this.dmsAppObj.User = currentUserContext.UserName;
    this.dmsAppObj.Role = currentUserContext.RoleCode;
    this.dmsAppObj.ViewCode = CommonConstant.DmsViewCodeApp;

    var agrObj = { AgrmntId: this.AgrmntId };
    var appObj = { AppId: this.AppId };

    let getAgr = await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
    let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
    let getApp = await this.http.post(URLConstant.GetAppById, appObj)
    forkJoin([getAgr, getAppCust, getApp]).subscribe(
      (response) => {
        this.agrNo = response[0]['AgrmntNo'];
        this.custNo = response[1]['CustNo'];
        this.appNo = response[2]['AppNo'];
        let mouId = response[2]['MouCustId'];

        if (this.custNo != null && this.custNo != '') {
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          this.dmsAppObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
        }
        else {
          this.dmsAppObj.MetadataParent = null;
        }
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));

        this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));

        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
        if (mouId != null && mouId != "") {
          let mouObj = { MouCustId: mouId };
          this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
            result => {
              this.mouCustNo = result['MouCustNo'];
              this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
              this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
              this.isDmsReady = true;
            }
          )
        }
        else {
          this.isDmsReady = true;
        }
      }
    );
  }

  testData() {
  }

  SaveForm() {
    var IsSave = false;
    if (this.AppAssetList.length != 0) {
      for (let i = 0; i < this.AppAssetList.length; i++) {
        if (this.AppAssetList[i].PurchaseOrderNo == undefined) {
          IsSave = false;
          this.toastr.typeErrorCustom("Please submit purchase order first!");
          break;
        } else {
          IsSave = true;
        }
      }
    } else {
      this.toastr.typeErrorCustom("Please submit purchase order first!");
    }

    if (IsSave) {
      var workflowModel: WorkflowApiObj = new WorkflowApiObj();
      workflowModel.TaskListId = this.TaskListId;
      workflowModel.ListValue = { "AgrmntId": this.AgrmntId.toString() };


      this.http.post(URLConstant.ResumeWorkflowPurchaseOrder, workflowModel).subscribe(
        (response) => {
          this.AppAssetList = response[CommonConstant.ReturnObj];
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PO_PAGING], {});
          this.toastr.successMessage(response["message"]);
        });
    }
  }
  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
  Cancel() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PO_PAGING], { "BizTemplateCode": BizTemplateCode });
  }
}

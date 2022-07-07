import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-app-after-approval-approval-detail',
  templateUrl: './edit-app-after-approval-approval-detail.component.html',
  styleUrls: ['./edit-app-after-approval-approval-detail.component.css']
})
export class EditAppAfterApprovalApprovalDetailComponent implements OnInit {

  EditAppAftApvTrxHId: number;
  ChangeSummaryObj: any;
  taskId: number;
  instanceId: number;
  ApvReqId: number;
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  IsReadySummary: boolean = false;
  arrValue = [];
  isViewReady: boolean = false;
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  RefMasterUsageCode = [];

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private toastr: NGXToastrService,
    private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["EditAppAftApvTrxHId"] != null) {
        this.EditAppAftApvTrxHId = params["EditAppAftApvTrxHId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId;

    await this.HoldTask(ApvHoldObj);

    await this.getData();
    this.setAssetUsage();
    this.IsReadySummary = true;
  }

  async HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{      
    
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
      }
    )
  }

  async getData()
  {
    let reqGetEditAppAftApv : GenericObj = new GenericObj();
    reqGetEditAppAftApv.Id = this.EditAppAftApvTrxHId;
    await this.http.post(URLConstant.GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId, reqGetEditAppAftApv).toPromise().then(
      (response) => {
        this.ChangeSummaryObj = response["ReturnObject"];
        
        this.arrValue.push(this.ChangeSummaryObj.EditAppAftApvTrxHObj.AgrmntId);
        this.isViewReady = true;
        this.initInputApprovalObj();
      });

    await this.http.post(URLConstant.GetListRefMasterByRefMasterTypeCodes, {Codes: [CommonConstant.RefMasterTypeCodeAssetUsage]}).toPromise().then(
      (response) => {
        this.RefMasterUsageCode = response["ReturnObject"];
      }
    );
  }

  initInputApprovalObj(){
    
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;
    
    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.InputApvObj.TrxNo = this.ChangeSummaryObj.EditAppAftApvTrxHObj.EditAppAftApvTrxNo;
    this.IsReady = true;
  }

  setAssetUsage()
  {
    for(let i = 0; i < this.ChangeSummaryObj.AssetDataObjs.length; i++)
    {
      var AssetDataObj = this.ChangeSummaryObj.AssetDataObjs[i];
      for(let j = 0; j < AssetDataObj.EditAppAftApvTrxDObjs.length; j++)
      {
        var EditAppAftApvTrxDObj = AssetDataObj.EditAppAftApvTrxDObjs[j];
        if(EditAppAftApvTrxDObj.ChangeItemCode == 'ASSET_DATA_MR_ASSET_USAGE_CODE')
        {
          EditAppAftApvTrxDObj.OldValue = this.RefMasterUsageCode.find(x => x.MasterCode === EditAppAftApvTrxDObj.OldValue).Descr
          EditAppAftApvTrxDObj.NewValue = this.RefMasterUsageCode.find(x => x.MasterCode === EditAppAftApvTrxDObj.NewValue).Descr

        }
      }
    }
  }

  onApprovalSubmited(event)
  {
    let ReqEditAppAfterApprovalCustomObj = {
      Tasks: event.Tasks
    }
    this.http.post(URLConstant.EditAppAfterApproval, ReqEditAppAfterApprovalCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
      }
  );
  }
  onCancelClick(event)
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
  }
}

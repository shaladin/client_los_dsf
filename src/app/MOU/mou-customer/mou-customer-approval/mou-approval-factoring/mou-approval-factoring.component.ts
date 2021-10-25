import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ApvViewInfo } from 'app/shared/model/ApvViewInfo.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';

@Component({
  selector: 'app-mou-approval-factoring',
  templateUrl: './mou-approval-factoring.component.html'
})
export class MouApprovalFactoringComponent implements OnInit {
  MouCustId: number;
  taskId: number;
  instanceId: number;
  inputObj: ApvViewInfo;
  MouType: string = "FACTORING";
  resultData: MouCustObj;
  MrCustTypeCode: string;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  dmsObj: DMSObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {

      if (params["MouCustId"] != null) {
        this.MouCustId = params["MouCustId"];
      }
      this.ApvReqId = params["ApvReqId"];
      this.taskId = params["TaskId"];
    });
  }


  async ngOnInit(): Promise<void> {
    let ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId;


    this.HoldTask(ApvHoldObj);
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });

    await this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        this.MrCustTypeCode = response.MrCustTypeCode;
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        if (this.SysConfigResultObj.ConfigValue == '1') {
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
          if (response['CustNo'] != null && response['CustNo'] != "") {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
          }
          else {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['ApplicantNo']));
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, response['MouCustNo']));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
        }

      }
    );
    this.initInputApprovalObj();
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_APPRV], {});
      }
    )
  }

  MouApprovalDataForm = this.fb.group({
  })

  onAvailableNextTask(event) { }
  
  onApprovalSubmited(event)
  { 
    let ReqMouApvCustomObj = {
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.MouApproval, ReqMouApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV],{});
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_APPRV], {});
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo = this.resultData.MouCustNo;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.IsReady = true;
  }
}

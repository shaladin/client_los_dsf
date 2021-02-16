import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ApvViewInfo } from 'app/shared/model/ApvViewInfo.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
@Component({
  selector: 'app-mou-approval-general',
  templateUrl: './mou-approval-general.component.html'
})
export class MouApprovalGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId: number;
  taskId: number;
  instanceId: number;
  MouType: string = CommonConstant.GENERAL;
  inputObj: ApvViewInfo;
  link: any;
  resultData: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  mouCustObject: MouCustObj = new MouCustObj();
  MrCustTypeCode: string;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  dmsObj: DMSObj;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {

      if (params["MouCustId"] != null) {
        this.MouCustId = params["MouCustId"];
      }
      this.ApvReqId = params["ApvReqId"];
      this.taskId = params["TaskId"];

      // this.inputObj = new ApvViewInfo();
      // this.inputObj.taskId = params["TaskId"];
      // this.inputObj.instanceId =  params["InstanceId"];
      // this.inputObj.approvalBaseUrl = environment.ApprovalR3Url;

    });
  }


  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    await this.http.post(URLConstant.GetMouCustById, this.mouCustObj).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        this.MrCustTypeCode = response.MrCustTypeCode;
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
        if(response['CustNo'] != null && response['CustNo'] != ""){
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
        }
        else{
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['ApplicantNo']));
        }
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, response['MouCustNo']));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
      }
    );
    this.initInputApprovalObj();
  }

  MouApprovalDataForm = this.fb.group({
  })

  onAvailableNextTask(event) {

  }

  onApprovalSubmited(event) {
    AdInsHelper.RedirectUrl(this.router, ["/Mou/Cust/Approval"], {});
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, ["/Mou/Cust/Approval"], {});
  }
  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }

  }
  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.EnvUrl = environment.FoundationR3Url;
    this.InputApvObj.PathUrlGetLevelVoting = URLConstant.GetLevelVoting;
    this.InputApvObj.PathUrlGetPossibleResult = URLConstant.GetPossibleResult;
    this.InputApvObj.PathUrlSubmitApproval = URLConstant.SubmitApproval;
    this.InputApvObj.PathUrlGetNextNodeMember = URLConstant.GetNextNodeMember;
    this.InputApvObj.PathUrlGetReasonActive = URLConstant.GetRefReasonActive;
    this.InputApvObj.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.TrxNo = this.resultData.MouCustNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}

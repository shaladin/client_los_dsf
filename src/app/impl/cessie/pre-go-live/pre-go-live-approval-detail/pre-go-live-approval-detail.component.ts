import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';

@Component({
  selector: 'cessie-pre-go-live-approval-detail',
  templateUrl: './pre-go-live-approval-detail.component.html'
})
export class CessiePreGoLiveApprovalDetailComponent implements OnInit {
  viewObj: string;
  TrxNo: string;
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  CessieHXId: number;
  appId: number;
  mrCustTypeCode: string;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.CessieHXId = params["CessieHXId"];
      this.taskId = params["TaskId"];
      this.ApvReqId = params["ApvReqId"];
      this.appId = params["AppId"];
      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = this.taskId;
      this.mrCustTypeCode = params["mrCustTypeCode"];
      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCessieMainInfoPreGoLive.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl + '/v1';
    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      () => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_PGL_APPRVL_PAGING], {});
      }
    )
  }

  onApprovalSubmited(event) {
    let ReqApvCustomObj = {
      Tasks: event.Tasks
    }

    this.http.post(URLConstantX.NewApproval, ReqApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_PGL_APPRVL_PAGING], {});
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_PGL_APPRVL_PAGING], { "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url + '/v1';
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo = this.TrxNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    else if (ev.Key == "customer") {
      var custObj = {
        CustNo: ev.ViewObj.CustNo
      };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          if(response['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
          } else if(response['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(response['CustId']);
          }
        }
      )
    }
    else if (ev.Key == "mou") {
      AdInsHelper.OpenMOUCustViewByMouCustId(ev.ViewObj.MouCustId);
    }
  }
}

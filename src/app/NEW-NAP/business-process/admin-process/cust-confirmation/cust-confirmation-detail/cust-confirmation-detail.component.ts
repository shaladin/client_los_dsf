import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CustCnfrmObj } from 'app/shared/model/CustCnfrm/CustCnfrm.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { ResAppCustForListCustMainDataObj, ResListCustMainDataObj } from 'app/shared/model/Response/NAP/CustMainData/ResListCustMainDataObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';

@Component({
  selector: 'app-cust-confirmation-detail',
  templateUrl: './cust-confirmation-detail.component.html'
})
export class CustConfirmationDetailComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  arrValue = [];
  AgrmntId: number;
  AppId: number;
  TaskListId: any;
  AgrmntNo: string;
  VerfResultList = new Array<VerfResultHObj>();
  CustNoObj: GenericObj = new GenericObj();
  IsSkip: boolean = false;
  appObj: AppObj = new AppObj();
  verfResultObj: VerfResultObj = new VerfResultObj();
  CustCnfrmObj: CustCnfrmObj = new CustCnfrmObj();
  BizTemplateCode: string;
  link: any;

  readonly ViewLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_VIEW;
  readonly DetailLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_DETAIL;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING;
  constructor(private route: ActivatedRoute, private http: HttpClient,
    private router: Router, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() {
    this.claimTask();
    this.arrValue.push(this.AgrmntId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustConfirmInfo.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.whereValue = this.arrValue;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
    ];

    await this.GetVerfResult();
  }

  async GetVerfResult(IsAdded: boolean = false) {
    await this.http.post(URLConstant.GetVerfResultHsByTrxRefNo, { TrxNo: this.AgrmntNo }).toPromise().then(
      async (response) => {
        this.VerfResultList = response["responseVerfResultHCustomObjs"];
        this.CustCnfrmObj.Phone = "-";
        this.CustCnfrmObj.MrCustCnfrmResultCode = "-";
        this.CustCnfrmObj.CnfmrNotes = "-";
        if (this.VerfResultList.length != 0) {
          this.CustCnfrmObj.Phone = this.VerfResultList[0].Phn;
          this.CustCnfrmObj.MrCustCnfrmResultCode = this.VerfResultList[0].MrVerfResultHStatCode;
          this.CustCnfrmObj.CnfmrNotes = this.VerfResultList[0].Notes;
        }
        this.CustCnfrmObj.AppId = this.AppId;
        this.CustCnfrmObj.AgrmntId = this.AgrmntId;
        if (this.VerfResultList.length == 0) {
          if (!IsAdded) {
            await this.AddNewVerfResult();
          }
        }
      });
  }

  async AddNewVerfResult() {
    var AppObj = {
      Id: this.AppId
    }
    await this.http.post<AppObj>(URLConstant.GetAppById, AppObj).toPromise().then(
      async (response) => {
        this.appObj = response;

        let flag = await this.GetListAppCustFamilyMainDataByAppId();

        let ListSubj: Array<string> = [];

        ListSubj.push(CommonConstant.RoleCustData);
        if (flag) ListSubj.push(CommonConstant.RoleFamilyData);

        this.verfResultObj.TrxRefNo = this.AgrmntNo;
        this.verfResultObj.EmpNo = "-";
        this.verfResultObj.MrVerfResultStatCode = CommonConstant.VerificationNew;
        this.verfResultObj.MrVerfTrxTypeCode = CommonConstant.VerfTrxTypeCodeCustConfirm;
        this.verfResultObj.LobCode = this.appObj.LobCode;
        this.verfResultObj.LobName = this.appObj.LobCode;
        this.verfResultObj.Notes = "-";
        this.verfResultObj.ListSubject = ListSubj;
        // console.log(this.verfResultObj);
        await this.http.post(URLConstant.AddVerfResultAndVerfResultH, this.verfResultObj).toPromise().then(
          async () => {
            await this.GetVerfResult(true);
          }
        );
      });
  }

  ListAppCustFamily: Array<ResAppCustForListCustMainDataObj> = new Array<ResAppCustForListCustMainDataObj>();
  async GetListAppCustFamilyMainDataByAppId() {
    let flag: boolean = false;
    await this.http.post(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.AppId, IsFamily: true }).toPromise().then(
      (response : ResListCustMainDataObj) => {
        this.ListAppCustFamily = response.ListAppCustObj;
        if (this.ListAppCustFamily.findIndex(x => x.MrCustRelationshipCode == CommonConstant.RoleFamilyData) > -1) flag = true;
      }
    );

    return flag;
  }

  SaveForm() {
    if (this.CustCnfrmObj.IsSkip == false) {
      for (var i = 0; i < this.VerfResultList.length; i++) {
        if (this.VerfResultList[i].MrVerfResultHStatCode == CommonConstant.VerificationFail || this.VerfResultList[i].MrVerfResultHStatCode == CommonConstant.VerificationNew) {
          this.toastr.warningMessage(ExceptionConstant.RESULT_CANNOT_NEW_OR_FAILED);
          return;
        }
      }
      var CustCnfrmWFObj = {
        RequestCustCnfrmObj: this.CustCnfrmObj,
        wfTaskListId: this.TaskListId
      };
      this.http.post(URLConstant.AddCustCnfrm, CustCnfrmWFObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { "BizTemplateCode": this.BizTemplateCode });
        });
    }
    else if (this.CustCnfrmObj.IsSkip == true) {
      var CustCnfrmWFObj = {
        RequestCustCnfrmObj: this.CustCnfrmObj,
        wfTaskListId: this.TaskListId
      };
      this.http.post(URLConstant.AddCustCnfrm, CustCnfrmWFObj).subscribe(
        () => {
          this.toastr.successMessage("Success !");
          AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { "BizTemplateCode": this.BizTemplateCode });
          // this.toastr.successMessage(response["message"]);
          // this.router.navigate(["/Nap/AdminProcess/CustConfirmation/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
        });
      // this.toastr.successMessage("Success !");
      // this.router.navigate(["/Nap/AdminProcess/CustConfirmation/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
    }
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.ViewObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
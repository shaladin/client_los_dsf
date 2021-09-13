import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcLookupObj } from 'app/shared/model/UcLookupObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-reassignment-detail',
  templateUrl: './task-reassignment-detail.component.html',
  styles: []
})
export class TaskReassignmentDetailComponent implements OnInit {
  WfTaskListId: any;
  WfActivityName: string;
  InputLookupObj: InputLookupObj;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  DDLRecomendation: any;
  IsReady: boolean;
  WfRoleCode: string;
  WfOfficeCode: string;

  //#region V2
  //#endregion
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  TaskReassignmentForm = this.fb.group({
    TaskReassignmentTrxId: [0],
    TaskReassignmentTrxNo: [''],
    WfRefNo: [''],
    WfCode: [''],
    WfName: [''],
    WfActivityCode: [''],
    WfActivityName: [''],
    CurrentUser: ['', [Validators.required]],
    OldCurrentUser: [''],
    OfficeCode: [''],
    ApvDt: [null],
    TaskReassignmentStat: [CommonConstant.TaskReassignmentApv],
    WfTaskListId: ['']
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      //#region v2 sementara
      if (params["Assignee"]) {
        this.TaskReassignmentForm.get("OldCurrentUser").patchValue(params["Assignee"]);
      }
      if (params["WfActivityCode"]) {
        this.TaskReassignmentForm.get("WfActivityCode").patchValue(params["WfActivityCode"]);
      }
      if (params["WfRefNo"]) {
        this.TaskReassignmentForm.get("WfRefNo").patchValue(params["WfRefNo"]);
      }
      if (params["WfName"]) {
        let WfRefNoSplit: Array<string> = params["WfName"].split(":");
        this.TaskReassignmentForm.get("WfCode").patchValue(WfRefNoSplit[0]);
        this.TaskReassignmentForm.get("WfName").patchValue(WfRefNoSplit[0]);
      }
      if (params["WfActivityName"]) {
        this.WfActivityName = params["WfActivityName"];
        this.TaskReassignmentForm.get("WfActivityName").patchValue(params["WfActivityName"]);
      }
      //#endregion
      if (params["WfTaskListId"]) {
        this.WfTaskListId = params["WfTaskListId"];
        this.TaskReassignmentForm.patchValue({
          WfTaskListId: this.WfTaskListId
        });
      }
    });
    this.InputLookupObj = new InputLookupObj();
    this.InputLookupObj.urlJson = "./assets/uclookup/lookupUserForReassignment.json";
    this.InputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupObj.pagingJson = "./assets/uclookup/lookupUserForReassignment.json";
    this.InputLookupObj.genericJson = "./assets/uclookup/lookupUserForReassignment.json";
  }

  async ngOnInit() {
    if (!environment.isCore) {
      this.http.post(URLConstant.GetTaskReassignmentDetail, { WfTaskListId: this.WfTaskListId }).pipe(
        map((response) => {
          this.TaskReassignmentForm.patchValue({
            WfRefNo: response["WfRefNo"],
            WfName: response["WfName"],
            WfActivityCode: response["WfActivityCode"],
            WfActivityName: response["WfActivityName"],
            OldCurrentUser: response["CurrentUser"],
            OfficeCode: response["OfficeCode"]
          });
          this.WfActivityName = response["WfActivityName"];
          this.WfRoleCode = response["RoleCode"];
          this.WfOfficeCode = response["OfficeCode"];
          return response;
        }),
        mergeMap((response) => {
          let Obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
          let getDDLRec = this.http.post(URLConstant.GetListActiveRefReason, Obj);
          let getUserRole = this.http.post(URLConstant.GetUserRoleByUsernameForReassignment, { Username: response["CurrentUser"] });
          return forkJoin([getUserRole, getDDLRec]);
        })
      ).toPromise().then(
        (response) => {

          this.DDLRecomendation = response[1][CommonConstant.ReturnObj];

          let criteriaList = new Array<CriteriaObj>();
          let criteriaObj = new CriteriaObj();
          criteriaObj.restriction = AdInsConstant.RestrictionEq;
          criteriaObj.propName = 'OO.ROLE_CODE'//'UR.REF_ROLE_ID';
          criteriaObj.value = this.WfRoleCode;//response[0]["RefRoleId"];
          criteriaList.push(criteriaObj);

          criteriaObj = new CriteriaObj();
          criteriaObj.restriction = AdInsConstant.RestrictionEq;
          criteriaObj.propName = 'OO.OFFICE_CODE';
          criteriaObj.value = this.WfOfficeCode;//response[0]["RefOfficeId"];
          criteriaList.push(criteriaObj);
          this.InputLookupObj.addCritInput = criteriaList;

          criteriaObj = new CriteriaObj();
          criteriaObj.restriction = AdInsConstant.RestrictionNeq;
          criteriaObj.propName = 'U.USERNAME';
          criteriaObj.value = this.TaskReassignmentForm.controls.OldCurrentUser.value;
          criteriaList.push(criteriaObj);
          this.InputLookupObj.addCritInput = criteriaList;

          this.initInputApprovalObj();
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
      return;
    }

    let Obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response: GenericListObj) => {
        this.DDLRecomendation = response[CommonConstant.ReturnObj];
      }
    )
    let userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let criteriaList = new Array<CriteriaObj>();
    let criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'OO.ROLE_CODE'//'UR.REF_ROLE_ID';
    criteriaObj.value = userAccess[CommonConstant.ROLE_CODE];
    this.WfRoleCode = userAccess[CommonConstant.ROLE_CODE];
    criteriaList.push(criteriaObj);

    criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'OO.OFFICE_CODE';
    this.WfOfficeCode = userAccess[CommonConstant.OFFICE_CODE];
    criteriaObj.value = this.WfOfficeCode;//response[0]["RefOfficeId"];
    this.TaskReassignmentForm.get("OfficeCode").patchValue(this.WfOfficeCode);
    criteriaList.push(criteriaObj);

    criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionNeq;
    criteriaObj.propName = 'U.USERNAME';
    criteriaObj.value = this.TaskReassignmentForm.get("OldCurrentUser").value;
    criteriaList.push(criteriaObj);
    this.InputLookupObj.addCritInput = criteriaList;

    this.initInputApprovalObj();

  }

  GetTargetUser(e) {
    this.TaskReassignmentForm.patchValue({
      CurrentUser: e.Username
    });
  }

  Back() {
    this.router.navigate([NavigationConstant.TASK_REASSIGN_PAGING]);
  }

  SaveForm() {
    let obj = this.TaskReassignmentForm.value;
    obj["RequestRFAObj"] = { RFAInfo: this.TaskReassignmentForm.controls.RFAInfo.value };
    if (obj["RequestRFAObj"] != undefined) {
      let urlApi: string = environment.isCore ? URLConstant.SubmitTaskReassignmentV2 : URLConstant.SubmitTaskReassignment;
      this.http.post(urlApi, obj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigate([NavigationConstant.TASK_REASSIGN_PAGING]);
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

  initInputApprovalObj() {

    let Attributes = [];
    let TypeCode = {
      "TypeCode": "RASGN_APV_TYPE",
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_TASK_RASGN;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_RASGN_APV_SCHM;
    this.InputObj.Reason = this.DDLRecomendation;
    this.InputObj.TrxNo = "-";
    this.IsReady = true;
  }
}

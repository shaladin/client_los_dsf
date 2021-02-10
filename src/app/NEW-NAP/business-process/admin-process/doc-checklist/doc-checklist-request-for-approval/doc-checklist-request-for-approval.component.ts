import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { RFADocChecklist } from '../../../../../shared/model/DocChecklist/RFADocChecklist.Model';
@Component({
  selector: 'app-doc-checklist-request-for-approval',
  templateUrl: './doc-checklist-request-for-approval.component.html'
})
export class DocChecklistRequestForApprovalComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: any;
  itemApprovedBy: any;
  itemReason: any;
  AppObj: any;
  AppNo: any;
  RFADocChecklist: any;
  TaskListId: any;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.TaskListId = params["TaskListId"];
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    await this.LoadRefReason();
    await this.GetAppData();
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    if (ev.Key == "customer") {
      AdInsHelper.OpenCustomerViewByCustId(ev.ViewObj.AppCustId);
    }
  }

  async LoadRefReason() {
    var refReasonObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeDocChecklist
    }
    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReason = response[CommonConstant.ReturnObj];
      }
    );
  }
  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    if (this.ApprovalCreateOutput != undefined) {
      this.RFADocChecklist = new RFADocChecklist();
      this.RFADocChecklist.TaskListId = this.TaskListId;
      this.RFADocChecklist.RowVersion = "";
      this.RFADocChecklist.RequestRFAObj = this.ApprovalCreateOutput
      this.http.post(URLConstant.CreateRFADocChecklist, this.RFADocChecklist).subscribe((response) => {
        this.router.navigateByUrl('/Nap/AdminProcess/DocChecklist/Paging?BizTemplateCode=' + localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE));
      });
    }
  }

  Cancel() {
    this.router.navigateByUrl('/Nap/AdminProcess/DocChecklist/Detail?AppId=' + this.AppId + '&TaskListId=' + this.TaskListId);
  }

  async GetAppData() {
    var appObj = {
      AppId: this.AppId,
    };
    await this.http.post(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        console.log(this.AppObj);
        this.AppNo = this.AppObj.AppNo;
        this.GetProdOfferingDCompt(this.AppObj.ProdOfferingCode);
      }
    );
  }


  GetProdOfferingDCompt(offeringCode) {
    var prodObj = {
      ProdOfferingCode: offeringCode,
      RefProdCompnt: CommonConstant.RefProdCompntDocChecklist
    };
    //this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, prodObj).subscribe(
    //  (response) => {
    //    var res = response;
    //    this.initInputApprovalObj(res["CompntValue"]);
    //  }
    //);
    this.initInputApprovalObj("APV_DOC_CHECKLIST_SCHM");
  }

  initInputApprovalObj(schemeCode) {
    this.InputObj = new UcInputRFAObj();
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": "DOC_CHCK_LIST_APV_TYPE",
      "Attributes": Attributes,
    };
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_DOC_CHCLIST_APV;
    this.InputObj.SchemeCode = schemeCode;
    this.InputObj.Reason = this.itemReason;
    this.InputObj.TrxNo = this.AppNo;
    this.IsReady = true;
  }

}

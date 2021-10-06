import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PoEntryComponent } from './po-entry/po-entry.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { FormBuilder } from '@angular/forms';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ToastrService } from 'ngx-toastr';
import { AgrmntTcObj } from 'app/shared/model/AgrmntTc/AgrmntTcObj.Model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/AgrmntTc/ReqSubmitAgrmntTcObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-purchase-order-detail',
  templateUrl: './new-purchase-order-detail.component.html',
  styles: []
})
export class NewPurchaseOrderDetailComponent implements OnInit {
  urlDetail: string;
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: any;
  arrValue: Array<number>;
  POList: Array<Object>;
  listAgrmntTcObj: Array<AgrmntTcObj>;
  agrmntTcObj: AgrmntTcObj;
  AppAssetList = [];
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  dmsAppObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  mouCustNo: string;
  TcForm = this.fb.group({});
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService,
    private toastrSvc: ToastrService
  ) {
    this.POList = new Array<Object>();
    this.arrValue = new Array<number>();
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
      else {
        this.lobCode = CommonConstant.CFNA;
      }
    });
  }

  async ngOnInit() {
    this.claimTask();
    // let appAssetObj : GenericObj = new GenericObj();
    // appAssetObj.Id = this.AgrmntId;
    // this.http.post(URLConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
    //   (response) => {
    //     this.AppAssetList = response[CommonConstant.ReturnObj];
    // });
    this.arrValue.push(this.AgrmntId);

    this.http.post(URLConstant.GetPurchaseOrderListForNewPOByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.POList = response["PurchaseOrderForNewPOObjs"];
        console.log("POList: " + JSON.stringify(this.POList));
      },
      (error) => {
        console.log(error);
      }
    );
    
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
    });
    await this.InitDms();
  }

  POEntryHandler(idx) {
    const modalPOEntry = this.modalService.open(PoEntryComponent);
    modalPOEntry.componentInstance.SupplCode = this.POList[idx]["SupplCode"];
    modalPOEntry.componentInstance.PurchaseOrderHId = this.POList[idx]["PurchaseOrderHId"];
    modalPOEntry.componentInstance.AppId = this.AppId;
    modalPOEntry.componentInstance.AgrmntId = this.POList[idx]["AgrmntId"];
    modalPOEntry.componentInstance.MouNo = this.POList[idx]["MouNo"];
    modalPOEntry.result.then(
      (response) => {
        this.spinner.show();
        this.http.post(URLConstant.GetPurchaseOrderListForNewPOByAppId, { Id: this.AppId }).toPromise().then(
          (response) => {
            this.POList = response["PurchaseOrderForNewPOObjs"];
          }
        ).catch(
          (error) => {
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch(
      (error) => {
      }
    );
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_NEW_PO_PAGING], { "BizTemplateCode": CommonConstant.CFNA });
  }

  checkValidExpDt(ExpirationDate: Date, PoNo: string, flag: boolean): boolean {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let bzDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    let tempExpDt = new Date(ExpirationDate);
    if (bzDt.getTime() > tempExpDt.getTime()) {
      flag = false;
      throw this.toastr.typeErrorCustom(PoNo + " Need Extension.");
    }
    return flag;
  }

  async Save() {
    let isPOResolved: boolean = true;
    for (const item of this.POList) {
      if (!item["PurchaseOrderNo"] || item["PurchaseOrderNo"] === "") {
        isPOResolved = false;
        break;
      }
      if (item["PurchaseOrderExpiredDt"]) {
        isPOResolved = this.checkValidExpDt(item["PurchaseOrderExpiredDt"], item["PurchaseOrderNo"], isPOResolved);
      }
    }
    if (!isPOResolved) {
      this.toastr.warningMessage("Please Resolve All Purchase Order");
    }
    else {
      var workflowModel = new WorkflowApiObj();
      workflowModel.TaskListId = this.TaskListId;
      workflowModel.ListValue = { "AgrmntId": this.AgrmntId.toString() };

      this.listAgrmntTcObj = new Array<AgrmntTcObj>();

    for (var i = 0; i < this.TcForm.value.TCList["length"]; i++) {
      this.agrmntTcObj = new AgrmntTcObj();
      this.agrmntTcObj.AgrmntId = this.TcForm.value.TCList[i].AgrmntId;
      this.agrmntTcObj.AgrmntTcId = this.TcForm.value.TCList[i].AgrmntTcId;
      this.agrmntTcObj.TcCode = this.TcForm.value.TCList[i].TcCode;
      this.agrmntTcObj.TcName = this.TcForm.value.TCList[i].TcName;
      this.agrmntTcObj.PriorTo = this.TcForm.value.TCList[i].PriorTo;
      this.agrmntTcObj.IsChecked = this.TcForm.getRawValue().TCList[i].IsChecked;
      this.agrmntTcObj.ExpiredDt = this.TcForm.getRawValue().TCList[i].ExpiredDt;
      this.agrmntTcObj.IsMandatory = this.TcForm.value.TCList[i].IsMandatory;
      this.agrmntTcObj.PromisedDt = this.TcForm.getRawValue().TCList[i].PromisedDt;
      this.agrmntTcObj.IsWaived = this.TcForm.getRawValue().TCList[i].IsWaived;
      this.agrmntTcObj.IsExpDtMandatory = this.TcForm.getRawValue().TCList[i].IsExpDtMandatory;
      this.agrmntTcObj.IsWaivable = this.TcForm.getRawValue().TCList[i].IsWaivable;
      this.agrmntTcObj.CheckedDt = this.TcForm.value.TCList[i].CheckedDt;
      this.agrmntTcObj.Notes = this.TcForm.value.TCList[i].Notes;
      this.agrmntTcObj.IsAdditional = this.TcForm.value.TCList[i].IsAdditional;
      this.listAgrmntTcObj.push(this.agrmntTcObj);
    }

    var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
    reqSubmitAgrmntTcObj.AgrmntId = this.AgrmntId;
    reqSubmitAgrmntTcObj.ListAgrmntTcObj = this.listAgrmntTcObj;

      await this.http.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj).toPromise().then(
        response => {
        }).catch(
          (error) => {
            console.log(error);
          }
      );
      var resumeUrl = environment.isCore ? URLConstant.ResumeWorkflowNewPurchaseOrderV2 : URLConstant.ResumeWorkflowNewPurchaseOrder
      this.http.post(resumeUrl, workflowModel).toPromise().then(
        (response) => {
          this.toastr.successMessage("Success");
          this.Cancel();
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );

    }
  }

  async InitDms() {
    if(this.SysConfigResultObj.ConfigValue == '1'){
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
  
      var agrObj = { Id: this.AgrmntId };
      var appObj = { Id: this.AppId };
  
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
            let mouObj = { Id: mouId };
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
  }

  claimTask(){
    if(environment.isCore){
        if(this.TaskListId != "" && this.TaskListId!= undefined){
            this.claimTaskService.ClaimTaskV2(this.TaskListId);
          }
      }
      else if (this.TaskListId > 0) {
         this.claimTaskService.ClaimTask(this.TaskListId);
      }
  }
}

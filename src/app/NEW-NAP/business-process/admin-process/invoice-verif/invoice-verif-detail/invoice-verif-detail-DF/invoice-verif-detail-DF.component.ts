import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppInvoiceFctrObj } from 'app/shared/model/AppInvoiceFctrObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CompleteTaskModel } from 'app/shared/model/Workflow/V2/CompleteTaskModelObj.model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'invoice-verif-detail-DF',
    templateUrl: './invoice-verif-detail-df.component.html'
})
export class InvoiceVerifDetailDFComponent implements OnInit {
    private stepper: Stepper;
    bizTemplateCode: string = "";
    viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
    AppId: number;
    WfTaskListId: any;
    TrxNo: string;
    token = localStorage.getItem(CommonConstant.TOKEN);
    LobCode: string;
    IsReady: boolean = false;
    appTC: AppTCObj;
    RlistAppTCObj: { ListAppTcObj: Array<AppTCObj> };

    InvoiceForm = this.fb.group({
        Invoices: this.fb.array([])
    });
    StepperIndex: number = 1;
    IsReturnOn: boolean;

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, 
                private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
        this.route.queryParams.subscribe(params => {
            if (params["AppId"] != null) {
            this.AppId = params["AppId"];
            }
            if (params["TaskListId"] != null) {
              this.WfTaskListId = params["TaskListId"];
            }
            if (params["TrxNo"] != null) {
              this.TrxNo = params["TrxNo"];
            }
        });
    }

    NextStep(ev: any) {
        this.IsReturnOn = ev.IsReturnOn;
        this.ChangeTab(ev.Step);
        this.stepper.next();
    }

    SaveForm() {
        var businessDt = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));

        this.RlistAppTCObj = {
            ListAppTcObj: []
        }
        this.RlistAppTCObj.ListAppTcObj = new Array();

        for (var i = 0; i < this.InvoiceForm.value.TCList["length"]; i++) {
            this.appTC = new AppTCObj();
            this.appTC.AppTcId = this.InvoiceForm.value.TCList[i].AppTcId;
            this.appTC.AppId = this.InvoiceForm.value.TCList[i].AppId;
            this.appTC.TcCode = this.InvoiceForm.value.TCList[i].TcCode;
            this.appTC.PriorTo = this.InvoiceForm.value.TCList[i].PriorTo;
            this.appTC.IsChecked = this.InvoiceForm.getRawValue().TCList[i].IsChecked;
            this.appTC.IsWaived = this.InvoiceForm.getRawValue().TCList[i].IsWaived;
            this.appTC.ExpiredDt = this.InvoiceForm.getRawValue().TCList[i].ExpiredDt;
            this.appTC.IsMandatory = this.InvoiceForm.value.TCList[i].IsMandatory;
            this.appTC.PromisedDt = this.InvoiceForm.getRawValue().TCList[i].PromisedDt;
            this.appTC.CheckedDt = this.InvoiceForm.value.TCList[i].CheckedDt;
            this.appTC.Notes = this.InvoiceForm.value.TCList[i].Notes;
            this.appTC.RowVersion = this.InvoiceForm.value.TCList[i].RowVersion;

            var prmsDt = new Date(this.appTC.PromisedDt);
            var prmsDtForm = this.InvoiceForm.value.TCList[i].PromisedDt;
            if (this.appTC.IsChecked == false) {
                if (prmsDtForm != null) {
                    if (prmsDt < businessDt) {
                        this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
                        return;
                    }
                }
            }
            this.RlistAppTCObj.ListAppTcObj.push(this.appTC);
        }
        this.httpClient.post(URLConstant.EditAppTc, this.RlistAppTCObj).subscribe(
            (response) => {
                this.toastr.successMessage(response["message"]);
                this.ResumeWf();
                // AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
            });
    }

    ChangeTab(Step) {
        switch (Step) {
            case "INVOICE":
                this.StepperIndex = 1;
                break;
            case "TC":
                this.StepperIndex = 2;
                break;
            default:
                break;
        }
    }

    async ngOnInit() {
        this.claimTask();
        this.stepper = new Stepper(document.querySelector('#stepper1'), {
            linear: false,
            animation: true
        })

        let reqApp: GenericObj = new GenericObj();
        reqApp.Id = this.AppId

        await this.httpClient.post<AppObj>(URLConstant.GetAppById, reqApp).toPromise().then(
            (response) => {
                this.LobCode = response.LobCode
                this.bizTemplateCode = response.BizTemplateCode
            });

        if (this.LobCode == "DLRFNCNG") {
            this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewInvoiceVerifDlrFinancing.json";
            this.viewGenericObj.ddlEnvironments = [
                {
                    name: "ApplicationNo",
                    environment: environment.losR3Web
                },
                {
                    name: "MouCustNo",
                    environment: environment.losR3Web
                },
            ];
            this.IsReady = true;
        } else {
            this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewInvoiceVerif.json";
            this.viewGenericObj.ddlEnvironments = [
                {
                    name: "ApplicationNo",
                    environment: environment.losR3Web
                },
                {
                    name: "MouCustNo",
                    environment: environment.losR3Web
                },
            ];
            this.IsReady = true;
        }
    }

    Cancel() {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], { "BizTemplateCode": this.bizTemplateCode });
    }

    claimTask(){
        if(environment.isCore){
            if(this.WfTaskListId != "" && this.WfTaskListId != undefined){
              this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
            }
          }else if (this.WfTaskListId > 0) {
            this.claimTaskService.ClaimTask(this.WfTaskListId);
          }
      }

    GetCallBack(ev) {
        if (ev.Key == "ViewProdOffering") {
            AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
        }
    }

    ResumeWf() {
        let requestObj;
        if(environment.isCore){
            requestObj = new CompleteTaskModel();
            requestObj.TaskId = this.WfTaskListId;
            requestObj.ReturnValue = this.IsReturnOn ? AdInsConstant.TextTrue : AdInsConstant.TextFalse;
        }else{
            requestObj = new WorkflowApiObj();
            requestObj.TaskListId = this.WfTaskListId;
            requestObj.ListValue["pBookmarkValue"] = CommonConstant.BOOKMARK_DONE;
        }
        
        let ResumeWorkflowUrl = environment.isCore ? URLConstant.CompleteTask : URLConstant.ResumeWorkflow;
        this.httpClient.post(ResumeWorkflowUrl, requestObj).subscribe(
            response => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
            }
        );
    }
}

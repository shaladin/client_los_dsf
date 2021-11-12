import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { AppInvoiceFctrObj } from 'app/shared/model/app-invoice-fctr-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ClaimWorkflowObj } from 'app/shared/model/workflow/claim-workflow-obj.model';
import { CompleteTaskModel } from 'app/shared/model/workflow/v2/complete-task-model-obj.model';
import { WorkflowApiObj } from 'app/shared/model/workflow/workflow-api-obj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';

@Component({
    selector: 'invoice-verif-detail-DF',
    templateUrl: './invoice-verif-detail-DF.component.html'
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

    InvoiceForm = this.fb.group({});
    StepperIndex: number = 1;
    IsReturnOn: boolean = false;

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
        let businessDt = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));

        this.RlistAppTCObj = {
            ListAppTcObj: []
        }
        this.RlistAppTCObj.ListAppTcObj = new Array();

        for (let i = 0; i < this.InvoiceForm.value.TCList["length"]; i++) {
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

            let prmsDt = new Date(this.appTC.PromisedDt);
            let prmsDtForm = this.InvoiceForm.value.TCList[i].PromisedDt;
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
                this.SaveInvoice();
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

        this.GetListVerifStatus();
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

    listRefReason: Array<KeyValueObj> = new Array();
    GetListVerifStatus() {
        let tempReq: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeInvoiceDataVerif };
        this.httpClient.post(URLConstant.GetListActiveRefReason, tempReq).toPromise().then(
            (response) => {
                this.listRefReason = response[CommonConstant.ReturnObj];
            }
        );
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

    GetlistInvoice(ev: Array<AppInvoiceFctrObj>){
        this.listInvoice = ev;
    }
    listInvoice: Array<AppInvoiceFctrObj>;
    ReturnHandlingHData: ReturnHandlingHObj = new ReturnHandlingHObj();
    SaveInvoice() {
        let fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        for (let i = 0; i < fa_listInvoice.length; i++) {
            let item = fa_listInvoice.at(i);
            this.listInvoice[i].Notes = item.get("InvoiceNotes").value;
            this.listInvoice[i].RowVersion = item.get("RowVersion").value;
        }

        this.ReturnHandlingHData.AppId = this.AppId;
        this.ReturnHandlingHData.WfTaskListId = this.WfTaskListId;

        if (this.IsReturnOn) {
            this.ReturnHandlingHData.ReturnBy = currentUserContext[CommonConstant.USER_NAME];
            this.ReturnHandlingHData.ReturnNotes = this.ReturnForm.controls.Notes.value;
            this.ReturnHandlingHData.ReturnFromTrxType = CommonConstant.VerfTrxTypeCodeInvoice;
        }

        let request = {
            Invoices: this.listInvoice,
            TaskListId: this.WfTaskListId,
            IsDF: false,
            IsReturn: this.IsReturnOn,
            ReturnHandlingHObj: this.ReturnHandlingHData
        };

        let UpdateAppInvoiceDlfnUrl = environment.isCore ? URLConstant.UpdateAppInvoiceDlfnV2_1 : URLConstant.UpdateAppInvoiceDlfn;
        this.httpClient.post(UpdateAppInvoiceDlfnUrl, request).subscribe((response) => {
            if (response["StatusCode"] != "200") return;
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], { "BizTemplateCode": this.bizTemplateCode });
        });
    }

    ReturnForm = this.fb.group({
        Reason: ['', [Validators.required]],
        Notes: ['', [Validators.required]],
        ReasonDesc: ['']
    });
    switchForm() {
        if (this.IsReturnOn) {
            this.ReturnForm.reset();
            this.IsReturnOn = false;
        } else {
            this.ReturnForm.patchValue({
                Reason: ''
            });
            this.IsReturnOn = true;
        }
        this.ReturnForm.updateValueAndValidity();
    }
    onChangeReason(ev) {
        this.ReturnForm.patchValue({
            ReasonDesc: ev.target.selectedOptions[0].text
        });
    }
}

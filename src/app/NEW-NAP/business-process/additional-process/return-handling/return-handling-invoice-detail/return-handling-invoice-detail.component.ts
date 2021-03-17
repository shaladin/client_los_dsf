import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppInvoiceFctrObj } from 'app/shared/model/AppInvoiceFctrObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-return-handling-invoice-detail',
  templateUrl: './return-handling-invoice-detail.component.html'
})
export class ReturnHandlingInvoiceDetailComponent implements OnInit {

  ReturnHandlingHId: number;
  ReturnHandlingDObj: any;
  AppId: number;
  IsReturnHandling: boolean;
  IsDetail: boolean = false;
  WfTaskListId: number;
  inputGridObj: InputGridObj;
  listInvoice: any;
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  IsDisableCustFctr: boolean = true;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  MouCustLookupObj: InputLookupObj = new InputLookupObj();
  AppInvoiceFctrObj: AppInvoiceFctrObj = new AppInvoiceFctrObj();
  ReturnHandlingDData: ReturnHandlingDObj = new ReturnHandlingDObj();

  RHInvoiceForm = this.fb.group({
    AppInvoiceFctrId: [''],
    CustomerFactoringName: ['', Validators.required],
    InvoiceNo: ['', Validators.required],
    InvoiceAmt: ['', Validators.required],
    InvoiceDueDt: ['', Validators.required],
    RowVersion: [],
    ExecNotes: ['']
  })

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params['ReturnHandlingHId'] != null) {
        this.ReturnHandlingHId = params['ReturnHandlingHId'];
        this.IsReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewInvoiceVerif.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
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

    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridInvoiceData.json";

    this.MouCustLookupObj.urlJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.MouCustLookupObj.urlEnviPaging = environment.losUrl;
    this.MouCustLookupObj.pagingJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.genericJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";

    this.MakeViewReturnInfoObj();
    this.GetListInvoice();
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.ReturnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingInvoice
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.ReturnHandlingDObj = response;
        });
    }
  }

  CallbackHandler(event: any) {
    if (event.Key == "Edit") {
      this.IsDetail = true;
      this.GetAppInvoiceFctrData(event.RowObj.AppInvoiceFctrId);
    } else if (event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }

  GetListInvoice() {
    this.http.post(URLConstant.GetListAppInvoiceFctrByAppId, { AppId: this.AppId }).subscribe((response) => {
      this.inputGridObj.resultData = {
        Data: ""
      }
      this.inputGridObj.resultData["Data"] = new Array();
      this.inputGridObj.resultData.Data = response["AppInvoiceFctrObjs"];
      this.listInvoice = this.inputGridObj.resultData.Data;
    });
  }

  GetAppInvoiceFctrData(AppInvoiceFctrId: number) {
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        this.http.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, { MouCustId: response["MouCustId"] }).subscribe(
          (response2) => {
            if (response2["length"] > 0) {
              this.IsDisableCustFctr = false;
              this.RHInvoiceForm.controls.CustomerFactoringName.clearValidators();
              this.RHInvoiceForm.controls.CustomerFactoringName.updateValueAndValidity();
            } else {
              this.IsDisableCustFctr = true;
            }
          });
      });

    this.http.post(URLConstant.GetAppInvoiceFctrByAppInvoiceFctrId, { AppInvoiceFctrId: AppInvoiceFctrId }).subscribe(
      (response: AppInvoiceFctrObj) => {
        this.RHInvoiceForm.patchValue({
          AppInvoiceFctrId: response.AppInvoiceFctrId,
          CustomerFactoringName: response.CustomerFactoringName,
          InvoiceNo: response.InvoiceNo,
          InvoiceAmt: response.InvoiceAmt,
          InvoiceDueDt: formatDate(response.InvoiceDueDt, 'yyyy-MM-dd', 'en-US'),
          RowVersion: response.RowVersion
        })
      });
  }

  SaveForm() {
    this.AppInvoiceFctrObj = this.RHInvoiceForm.value;
    this.AppInvoiceFctrObj.InvoiceStat = "NEW";
    this.AppInvoiceFctrObj.IsApproved = true;
    this.http.post(URLConstant.EditAppInvoiceFctr, this.AppInvoiceFctrObj).subscribe(
      (response) => {
        this.GetListInvoice();
        this.toastr.successMessage(response["message"]);
        this.CancelEdit();
      })
  }

  CancelEdit() {
    this.IsDetail = false;
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_INVOICE_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }

  SubmitReturnHandling() {
    this.ReturnHandlingDData.ReturnHandlingDId = this.ReturnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.ReturnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.ReturnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = this.ReturnHandlingDObj.ReturnStat;
    this.ReturnHandlingDData.ReturnHandlingNotes = this.ReturnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.RHInvoiceForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.WfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.ReturnHandlingDObj.RowVersion;

    this.http.post(URLConstant.EditReturnHandlingD, this.ReturnHandlingDData).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_INVOICE_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }
}

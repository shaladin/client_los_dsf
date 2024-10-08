import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppObj } from 'app/shared/model/App/App.Model';
import { environment } from 'environments/environment';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AppInvoiceFctrObj } from 'app/shared/model/app-invoice-fctr-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { ResDisbInfo } from 'app/shared/model/response/app-invoice/res-app-invoice-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';

@Component({
  selector: 'app-invoice-verif-detail-x',
  templateUrl: './invoice-verif-detail-x.component.html'
})
export class InvoiceVerifDetailXComponent implements OnInit {

  @Input() IsFromReturnHandling: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listInvoice: Array<AppInvoiceFctrObj>;
  verifStatCode: RefMasterObj;
  BusinessDate: Date;
  Username: string;
  AppId: number;
  WfTaskListId: any;
  TrxNo: string;
  OsPlafondAmt: number;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsReturnOn: boolean = false;
  listRefReason: Array<KeyValueObj> = new Array();
  ReturnHandlingHData: ReturnHandlingHObj = new ReturnHandlingHObj();
  IsReady: boolean = false;
  LobCode: string;
  AccName: string;
  BankName: string;
  AccNo: string;
  MrMouTypeCode: string;

  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([]),
    Reason: [''],
    Notes: [''],
    ReasonDesc: ['']
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
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
    this.BusinessDate = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.Username = currentUserContext[CommonConstant.USER_NAME];
  }

  async ngOnInit() {
    this.claimTask();

    await this.httpClient.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.LobCode = response.LobCode
      }
    );

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
    }
    else {
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

    this.GetListVerifStatus();
    const request = {
      Id: this.AppId
    }

    this.httpClient.post<ResDisbInfo>(URLConstant.GetDisbInfoByAppId, request).subscribe(
      (response) => {
        if (response.DisbInfoId != 0) {
          this.AccName = response.AccName;
          this.AccNo = response.AccNo;
          this.httpClient.post(URLConstant.GetRefBankByBankCodeAsync, { Code: response.BankCode }).subscribe(
            (responseBank) => {
              this.BankName = responseBank["BankName"];
            });
        }
      });

    this.httpClient.post(URLConstantX.GetMouCustByAppIdX, request).subscribe((response) => {
      this.OsPlafondAmt = response["PlafondAmt"];
      this.MrMouTypeCode = response["MrMouTypeCode"];

      if (this.MrMouTypeCode == CommonConstant.FACTORING) {
        this.httpClient.post(URLConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
          this.listInvoice = response["AppInvoiceFctrObjs"];
          var totalInvoice = 0;
          for (let i = 0; i < this.listInvoice.length; i++) {
            var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
            fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
            totalInvoice += this.listInvoice[i].InvoiceAmt;
          }
          // this.OsPlafondAmt = this.PlafondAmt - totalInvoice;
        });
      }
      else {
        var DisbAmt = 0;
        this.httpClient.post(URLConstant.GetListAppInvoiceXAppInvoiceDlrFncngHByAppId, { Id: this.AppId }).subscribe(
          (response) => {
            this.listInvoice = response["AppInvoiceDlrFncngHObj"];
            for (let i = 0; i < this.listInvoice.length; i++) {
              var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
              fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
            }
            DisbAmt = this.listInvoice[0].DisbAmt;
            // this.OsPlafondAmt = this.PlafondAmt - DisbAmt;
          });
      }
    })
  }

  AddInvoiceControl(obj) {
    return this.fb.group({
      InvoiceNo: obj.InvoiceNo,
      CustName: obj.CustomerFactoringName,
      InvoiceAmt: obj.InvoiceAmt,
      InvoiceNotes: obj.InvoiceNotes,
      InvoiceDt: obj.InvoiceDueDt,
      RowVersion: obj.RowVersion,
    })
  }

  GetListVerifStatus() {
    let tempReq: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeInvoiceDataVerif };
    this.httpClient.post(URLConstant.GetListActiveRefReason, tempReq).toPromise().then(
      (response) => {
        this.listRefReason = response[CommonConstant.ReturnObj];
      });
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], { BizTemplateCode: 'FCTR' });
  }

  SaveData() {
    if (this.MrMouTypeCode == CommonConstant.FACTORING) {
      var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray
      for (let i = 0; i < fa_listInvoice.length; i++) {
        var item = fa_listInvoice.at(i);
        this.listInvoice[i].Notes = item.get("InvoiceNotes").value;
        this.listInvoice[i].RowVersion = item.get("RowVersion").value;
      }

      this.ReturnHandlingHData.AppId = this.AppId;
      this.ReturnHandlingHData.WfTaskListId = this.WfTaskListId;
      if (this.IsReturnOn) {
        this.ReturnHandlingHData.ReturnBy = this.Username;
        this.ReturnHandlingHData.ReturnNotes = this.InvoiceForm.controls.Notes.value;
        this.ReturnHandlingHData.ReturnFromTrxType = CommonConstant.VerfTrxTypeCodeInvoice;
      }

      var request = {
        Invoices: this.listInvoice,
        IsReturn: this.IsReturnOn,
        ReturnHandlingHObj: this.ReturnHandlingHData
      };

      let UpdateAppInvoiceFctrUrl = environment.isCore ? URLConstant.UpdateAppInvoiceFctrV2 : URLConstant.UpdateAppInvoiceFctr;
      this.httpClient.post(UpdateAppInvoiceFctrUrl, request).subscribe(
        (response) => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], { BizTemplateCode: 'FCTR' });
        });
    }

  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  switchForm() {
    if (this.IsReturnOn) {
      this.InvoiceForm.patchValue({
        Reason: [],
        Notes: []
      });
      this.IsReturnOn = false;
      this.InvoiceForm.controls.Notes.clearValidators();
      this.InvoiceForm.controls.Reason.clearValidators();
    } else {
      this.IsReturnOn = true;
      this.InvoiceForm.controls.Notes.setValidators(Validators.required)
      this.InvoiceForm.controls.Reason.setValidators(Validators.required)
    }
    this.InvoiceForm.controls.Notes.updateValueAndValidity();
    this.InvoiceForm.controls.Reason.updateValueAndValidity();
  }

  onChangeReason(ev) {
    this.InvoiceForm.patchValue({
      ReasonDesc: ev.target.selectedOptions[0].text
    });
  }

  claimTask() {
    if (environment.isCore) {
      if (this.WfTaskListId != "" && this.WfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    } else if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
  }
}

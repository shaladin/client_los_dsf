import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppInvoiceFctrObj } from 'app/shared/model/AppInvoiceFctrObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ResDisbInfo, ResGetAllNtfAppAmt } from 'app/shared/model/Response/AppInvoice/ResAppInvoiceObj.model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CookieService } from 'ngx-cookie';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';

@Component({
  selector: 'invoice-verif-detail-list-of-invoice',
  templateUrl: './invoice-verif-detail-list-of-invoice.component.html'
})
export class InvoiceVerifDetailListOfInvoiceComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  bizTemplateCode: string = "";
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listInvoice: Array<AppInvoiceFctrObj>;
  verifStatCode: RefMasterObj;
  BusinessDate: Date;
  Username: string;
  WfTaskListId: number;
  TrxNo: string;
  PlafondAmt: number;
  OsPlafondAmt: number;
  MrMouTypeCode: string;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsReturnOn: boolean = false;
  listRefReason: Array<KeyValueObj> = new Array();
  ReturnHandlingHData: ReturnHandlingHObj = new ReturnHandlingHObj();
  LobCode: string;
  IsReady: boolean = false;
  AccName: string;
  BankName: string;
  AccNo: string;

  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([])
  });

  ReturnForm = this.fb.group({
    Reason: ['', [Validators.required]],
    Notes: ['', [Validators.required]],
    ReasonDesc: ['']
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["TaskListId"];
      this.TrxNo = params["TrxNo"];
    });

    this.BusinessDate = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.Username = currentUserContext[CommonConstant.USER_NAME];
  }

  async ngOnInit() {
    this.claimTask();

    let appIdObj: GenericObj = new GenericObj();
    appIdObj.Id = this.AppId;

    await this.httpClient.post<AppObj>(URLConstant.GetAppById, appIdObj).toPromise().then(
      (response) => {
        this.LobCode = response.LobCode
        this.bizTemplateCode = response.BizTemplateCode
      }

    );

    this.GetListVerifStatus();
    let request: GenericObj = new GenericObj();
    request.Id = this.AppId;
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

    this.httpClient.post(URLConstant.GetMouCustByAppId, request).subscribe((responseMou) => {
      this.PlafondAmt = responseMou["PlafondAmt"];
      this.MrMouTypeCode = responseMou["MrMouTypeCode"];

      if (this.MrMouTypeCode == CommonConstant.FACTORING) {
        this.httpClient.post(URLConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
          this.listInvoice = response["AppInvoiceFctrObjs"];
          var totalInvoice = 0;
          for (let i = 0; i < this.listInvoice.length; i++) {
            var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
            fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
            totalInvoice += this.listInvoice[i].InvoiceAmt;
          }
          this.OsPlafondAmt = this.PlafondAmt - totalInvoice;
        });
      } else {
        let GetByMouCustId: GenericObj = new GenericObj();
        GetByMouCustId.Id = responseMou["MouCustId"];

        this.httpClient.post(URLConstant.GetListAppInvoiceAppInvoiceDlrFncngHByAppId, { Id: this.AppId }).subscribe(
          (response) => {
            this.listInvoice = response["AppInvoiceDlrFncngHObj"];
            var totalInvoiceDF = 0;
            for (let i = 0; i < this.listInvoice.length; i++) {
              var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
              fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
              if(this.listInvoice[i].IsApproved == true)
              {
                totalInvoiceDF += this.listInvoice[i].InvoiceAmt;
              }
            }
            // this.httpClient.post<ResGetAllNtfAppAmt>(URLConstant.GetAllNtfAppAmtByMouCustId, { Id : GetByMouCustId.Id }).subscribe(
            //   (responseNtfAmt) => {
            //     this.OsPlafondAmt = this.PlafondAmt - responseNtfAmt.NtfAmt;
            //   }
            // )

            this.OsPlafondAmt = this.PlafondAmt - totalInvoiceDF;
          });
      }
    })
  }

  AddInvoiceControl(obj) {
    return this.fb.group({
      InvoiceNo: obj.InvoiceNo,
      CustName: obj.CustomerFactoringName,
      InvoiceAmt: obj.InvoiceAmt,
      InvoiceNotes: obj.Notes,
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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {"BizTemplateCode":this.bizTemplateCode});
  }
  SaveData() {
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
      this.ReturnHandlingHData.ReturnNotes = this.ReturnForm.controls.Notes.value;
      this.ReturnHandlingHData.ReturnFromTrxType = CommonConstant.VerfTrxTypeCodeInvoice;
    }

    var request = {
      Invoices: this.listInvoice,
      TaskListId: this.WfTaskListId,
      IsDF: true,
      IsReturn: this.IsReturnOn,
      ReturnHandlingHObj: this.ReturnHandlingHData
    };

    this.httpClient.post(URLConstant.UpdateAppInvoiceDlfn, request).subscribe(() => {
      if (this.IsReturnOn) {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], { "BizTemplateCode": this.bizTemplateCode });
      } else {
        this.outputTab.emit();
      }
    });
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  switchForm() {
    if (this.IsReturnOn) {
      this.ReturnForm.reset();
      this.IsReturnOn = false;
    } else {
      this.ReturnForm.patchValue({
        Reason:''
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

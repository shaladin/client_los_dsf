import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
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
  listVerificationStatus: Array<KeyValueObj>;
  verifStatCode: RefMasterObj;
  BusinessDate: Date;
  Username: string;
  WfTaskListId: string;
  TrxNo: string;
  PlafondAmt: number;
  OsPlafondAmt: number;
  MrMouTypeCode: string;
  token = localStorage.getItem(CommonConstant.TOKEN);
  LobCode: string;
  IsReady: boolean = false;
  AccName: string;
  BankName: string;
  AccNo: string;


  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["TaskListId"];
      this.TrxNo = params["TrxNo"];
    });
    this.BusinessDate = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
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
            for (let i = 0; i < this.listInvoice.length; i++) {
              var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
              fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
            }
            this.httpClient.post<ResGetAllNtfAppAmt>(URLConstant.GetAllNtfAppAmtByMouCustId, { Id : GetByMouCustId.Id }).subscribe(
              (responseNtfAmt) => {
                this.OsPlafondAmt = this.PlafondAmt - responseNtfAmt.NtfAmt;
              }
            )
          });
      }
    })
  }

  AddInvoiceControl(obj) {
    return this.fb.group({
      InvoiceNo: obj.InvoiceNo,
      CustName: obj.CustomerFactoringName,
      InvoiceAmt: obj.InvoiceAmt,
      Verification: obj.IsApproved == true ? CommonConstant.InvoiceStatApv : CommonConstant.InvoiceStatRjc,
      InvoiceNotes: obj.Notes,
      InvoiceDt: obj.InvoiceDueDt,
      RowVersion: obj.RowVersion,
    })
  }

  GetListVerifStatus() {
    this.httpClient.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { Code: CommonConstant.INV_VERF_RESULT_STAT }).subscribe((response) => {
      this.listVerificationStatus = response[CommonConstant.ReturnObj];
    })
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {"BizTemplateCode":this.bizTemplateCode});
  }
  SaveData() {
    var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray
    for (let i = 0; i < fa_listInvoice.length; i++) {
      var item = fa_listInvoice.at(i);
      this.listInvoice[i].IsApproved = item.get("Verification").value == "APV" ? true : false;
      this.listInvoice[i].InvoiceStat = item.get("Verification").value;
      this.listInvoice[i].Notes = item.get("InvoiceNotes").value;
      this.listInvoice[i].RowVersion = item.get("RowVersion").value;
    }
    var request = { Invoices: this.listInvoice, TaskListId: this.WfTaskListId, IsDF: true };

    this.httpClient.post(URLConstant.UpdateAppInvoiceDlfn, request).subscribe(() => {
      this.outputTab.emit();
    });
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }
  Calculate(i) {
    var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
    var item = fa_listInvoice.at(i);
    if (item.get("Verification").value == "APV") {
      this.OsPlafondAmt -= item.get("InvoiceAmt").value;
    }
    else {
      this.OsPlafondAmt += item.get("InvoiceAmt").value;
    }
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}

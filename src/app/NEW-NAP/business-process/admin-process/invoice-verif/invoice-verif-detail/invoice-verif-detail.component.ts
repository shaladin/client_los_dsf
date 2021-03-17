import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';

@Component({
  selector: 'app-invoice-verif-detail',
  templateUrl: './invoice-verif-detail.component.html'
})
export class InvoiceVerifDetailComponent implements OnInit {

  @Input() IsFromReturnHandling: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listInvoice: any;
  verifStatCode: RefMasterObj;
  BusinessDate: any;
  Username: any;
  AppId: number;
  WfTaskListId: number;
  TrxNo: string;
  PlafondAmt: any;
  OsPlafondAmt: any;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsReturnOn: boolean = false;
  listRefReason: Array<KeyValueObj> = new Array();
  ReturnHandlingHData: ReturnHandlingHObj = new ReturnHandlingHObj();

  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([]),
    Reason: [''],
    Notes: [''],
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

  ngOnInit() {
    this.claimTask();
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

    this.GetListVerifStatus();
    var request = {
      AppId: this.AppId
    }

    this.httpClient.post(URLConstant.GetMouCustByAppId, request).subscribe((response) => {
      this.PlafondAmt = response["PlafondAmt"];

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
    this.httpClient.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeInvoiceDataVerif }).toPromise().then(
      (response) => {
        this.listRefReason = response[CommonConstant.ReturnObj];
      });
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
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
    if(this.IsReturnOn){
      this.ReturnHandlingHData.ReturnBy = this.Username;
      this.ReturnHandlingHData.ReturnNotes = this.InvoiceForm.controls.Notes.value;
      this.ReturnHandlingHData.ReturnFromTrxType = CommonConstant.VerfTrxTypeCodeInvoice;
    }

    var request = { 
      Invoices: this.listInvoice,
      IsReturn: this.IsReturnOn,
      ReturnHandlingHObj : this.ReturnHandlingHData
    };

    this.httpClient.post(URLConstant.UpdateAppInvoiceFctr, request).subscribe((response) => {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
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

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  switchForm(){
    if(this.IsReturnOn){
      this.InvoiceForm.patchValue({
        Reason: [],
        Notes: []
      });
      this.IsReturnOn = false;
      this.InvoiceForm.controls.Notes.clearValidators();
      this.InvoiceForm.controls.Reason.clearValidators();
    }else{
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
}

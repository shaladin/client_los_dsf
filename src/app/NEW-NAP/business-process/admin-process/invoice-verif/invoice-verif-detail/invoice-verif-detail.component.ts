import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray } from '@angular/forms';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-invoice-verif-detail',
  templateUrl: './invoice-verif-detail.component.html'
})
export class InvoiceVerifDetailComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listInvoice: any;
  listVerificationStatus: any;
  verifStatCode: RefMasterObj;
  BusinessDate: any;
  Username: any;
  AppId: any;
  WfTaskListId: string;
  TrxNo: string;
  PlafondAmt: any;
  OsPlafondAmt: any;
  token = localStorage.getItem(CommonConstant.TOKEN);

  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["TaskListId"];
      this.TrxNo = params["TrxNo"];
    });
    this.BusinessDate = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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
      Verification: this.listVerificationStatus[0].Key,
      InvoiceNotes: obj.InvoiceNotes,
      InvoiceDt: obj.InvoiceDueDt,
      RowVersion: obj.RowVersion,
    })
  }

  GetListVerifStatus() {
    this.httpClient.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { statusGrpCode: CommonConstant.INV_VERF_RESULT_STAT }).subscribe((response) => {
      this.listVerificationStatus = response[CommonConstant.ReturnObj];
    })
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/InvoiceVerif/Paging"], {});
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

    var request = { Invoices: this.listInvoice, TaskListId: this.WfTaskListId };
    this.httpClient.post(URLConstant.UpdateAppInvoiceFctr, request).subscribe((response) => {
      AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/InvoiceVerif/Paging"], {});
    });

  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
  }
}

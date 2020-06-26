import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';

@Component({
  selector: 'app-invoice-verif-detail',
  templateUrl: './invoice-verif-detail.component.html',
  styleUrls: ['./invoice-verif-detail.component.scss']
})
export class InvoiceVerifDetailComponent implements OnInit {

  viewObj: any;
  listInvoice: any;
  listVerificationStatus: any;
  verifStatCode: RefMasterObj;
  BusinessDate : any;
  Username : any;
  AppId : any;
  WfTaskListId: string;
  TrxNo: string;
  PlafondAmt : any;
  OsPlafondAmt : any;

  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient,private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["TaskListId"];
      this.TrxNo = params["TrxNo"];
    });
    this.BusinessDate = new Date(localStorage.getItem("BusinessDateRaw"));
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    this.Username = currentUserContext["UserName"];
   }

  ngOnInit() {
    this.claimTask();
    console.log("test");
    this.viewObj = "./assets/ucviewgeneric/viewInvoiceVerif.json";

    this.listVerificationStatus = [{ Key: "APV", Value: "Approve" }, { Key: "RJC", Value: "Reject" }];

    var request = {
      AppId : this.AppId
    }

    this.httpClient.post(AdInsConstant.GetMouCustByAppId, request).subscribe((response) => {
      console.log(response);
      this.PlafondAmt = response["PlafondAmt"];

      this.httpClient.post(AdInsConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
        console.log(response);
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
      InvoiceDt : obj.InvoiceDueDt
    })
  }

  Cancel()
  {
    this.router.navigate(["/Nap/AdminProcess/InvoiceVerif/Paging"]);
  }
  SaveData()
  {
    var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray
    for (let i = 0; i < fa_listInvoice.length; i++) {
      var item = fa_listInvoice.at(i);
      this.listInvoice[i].IsApproved = item.get("Verification").value == "APV" ? true : false ;
      this.listInvoice[i].InvoiceStat = item.get("Verification").value;
      this.listInvoice[i].Notes = item.get("InvoiceNotes").value;
    }
    
    var request = {Invoices : this.listInvoice, TaskListId : this.WfTaskListId};
    console.log(request);
    this.httpClient.post(AdInsConstant.UpdateAppInvoiceFctr, request).subscribe((response) => {
      console.log(response);
      this.router.navigate(["/Nap/AdminProcess/InvoiceVerif/Paging"]);
    });
    
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId;
    wfClaimObj.pUserID = currentUserContext["UserName"];
    this.httpClient.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
  Calculate(i)
  {
    var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
    var item = fa_listInvoice.at(i);
    if (item.get("Verification").value == "APV")
    {
      this.OsPlafondAmt -= item.get("InvoiceAmt").value;
    }
    else
    {
      this.OsPlafondAmt += item.get("InvoiceAmt").value;
    }
  }
}

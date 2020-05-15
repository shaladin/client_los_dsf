import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray } from '@angular/forms';
import { formatDate } from '@angular/common';

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
  WfTaskListId: number;
  TrxNo: string;
  
  InvoiceForm = this.fb.group({
    Invoices: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient,private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["WFTaskListId"];
      this.TrxNo = params["TrxNo"];
    });
    this.BusinessDate = new Date(localStorage.getItem("BusinessDateRaw"));
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    this.Username = currentUserContext["UserName"];
   }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewInvoiceVerif.json";

    this.listVerificationStatus = [{ Key: "APV", Value: "Approve" }, { Key: "RJC", VAlue: "Reject" }];

    var request = {
      AppId : this.AppId
    }
    this.httpClient.post(AdInsConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
      console.log(response);
      this.listInvoice = response;
      for (let i = 0; i < this.listInvoice.length; i++) {
        var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
        fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
      }
    });

    this.httpClient.post(AdInsConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
      console.log(response);
      this.listInvoice = response;
      for (let i = 0; i < this.listInvoice.length; i++) {
        var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
        fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
      }
    });
  }

  AddInvoiceControl(obj) {
    return this.fb.group({
      InvoiceNo: obj.InvoiceNo,
      CustName: obj.CustName,
      InvoiceAmt: obj.InvoiceAmt,
      Verification: this.listVerificationStatus[0].Key,
      InvoiceNotes: obj.InvoiceNotes
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
      this.listInvoice[i].IsApproved = item.get("IsChecked").value;
      this.listInvoice[i].InvoiceStat = item.get("Verification").value;
      this.listInvoice[i].Notes = item.get("InvoiceNotes").value;
    }
    
    var request = {Invoices : this.listInvoice};

    this.httpClient.post(AdInsConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
      console.log(response);
      this.router.navigate(["/Nap/AdminProcess/InvoiceVerif/Paging"]);
    });
    
  }
}

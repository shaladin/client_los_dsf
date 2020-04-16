import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';

import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AppInvoiceFctrObj } from 'app/shared/model/AppInvoiceFctrObj.Model';

@Component({
  selector: 'app-invoice-data-add',
  templateUrl: './invoice-data-add.component.html',
  styleUrls: ['./invoice-data-add.component.scss'],
  providers:[NGXToastrService]
})
export class InvoiceDataAddComponent implements OnInit {

  http: any;
  inputPagingObj: UcPagingObj;
  invoiceObj: AppInvoiceFctrObj;
  AppFctrId: any;
  addUrl: string;
  dataobj: Object;
  total: any;


  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.route.queryParams.subscribe(params => {
      if (params['AppFctrId'] != null) {
        this.AppFctrId = params['AppFctrId'];
      }
    });
  }

  InvoiceForm = this.fb.group({
    AppFctrId:[''],
    CustomerFactoringName:['',Validators.required],
    InvoiceNo:['',Validators.required],
    InvoiceAmt: ['',Validators.required],
    InvoiceDueDt: ['',Validators.required],
    IsApproved: [false],
    Notes: [''],
    RowVersion: ['']
  })

  ngOnInit() {
    this.GetListAppInvoiceFctr();
  }

  GetListAppInvoiceFctr() {
    var obj = {
      AppFctrId: this.AppFctrId,
    }
    var getListUrl = AdInsConstant.GetListAppInvoiceFctrByAppFctrId;
    this.httpClient.post(getListUrl, obj).subscribe(
      (response) => {
        console.log(response);
        this.dataobj = response['ReturnObject'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm(){
    this.invoiceObj = new AppInvoiceFctrObj();
    this.invoiceObj = this.InvoiceForm.value;
    
    this.invoiceObj.RowVersion = "";
    this.invoiceObj.AppFctrId = this.AppFctrId;
    console.log(this.invoiceObj);
    this.invoiceObj.AppInvoiceFctrId = "0";
    this.httpClient.post(AdInsConstant.AddAppInvoiceFctr, this.invoiceObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      });
  }

  DeleteInvoice(event) {
    this.invoiceObj = new AppInvoiceFctrObj();

    this.invoiceObj.AppInvoiceFctrId = event;
 

    console.log(event);
    this.addUrl = AdInsConstant.DeleteAppInvoiceFctr;
    this.httpClient.post(this.addUrl,this.invoiceObj).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      });
  }

//   getTotal() {
//     let total = 0;
//     for (var i = 0; i < this.items.length; i++) {
//         if (this.items[i].amount) {
//             total += this.items[i].amount;
//             this.totalamount = total;
//         }
//     }
//     return total;
// }
}

import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  inputPagingObj: any;
  AgrmntId: any;
  invoiceDataList: Object;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params["AgrmntId"];
    });
  }

  ngOnInit() {
    this.GetListInvoiceData();
  }

  GetListInvoiceData() {
    var obj = {
      AgrmntId: this.AgrmntId
    }
    var getListUrl = AdInsConstant.GetListAppInvoiceFctrByAgrmntId;
    this.http.post(getListUrl, obj).subscribe(
      (response) => {
        console.log(response);
        this.invoiceDataList = response['ReturnObject'];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ToDetail(ev) {
    console.log(ev);
    this.router.navigate(["/AdminProcess/Invoice/Detail"], { queryParams: { "AppInvoiceFctrId": ev } });
  }
}

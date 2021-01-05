import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html'
})
export class InvoiceViewComponent implements OnInit {
  inputPagingObj: any;
  invoiceDataList: Object;
  @Input() AppId: number;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient) {

  }

  ngOnInit() {
    this.GetListInvoiceData();
  }

  GetListInvoiceData() {
    var obj = {
      AppId: this.AppId
    }
    var getListUrl = URLConstant.GetListAppInvoiceFctrByAppId;
    this.http.post(getListUrl, obj).subscribe(
      (response) => {
        this.invoiceDataList = response['AppInvoiceFctrObjs'];

      });
  }
  ToDetail(ev) {
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/Invoice/Detail"], { "AppInvoiceFctrId": ev });
  }
}

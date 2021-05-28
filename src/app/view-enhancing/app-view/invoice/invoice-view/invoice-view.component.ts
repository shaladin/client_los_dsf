import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html'
})
export class InvoiceViewComponent implements OnInit {
  inputPagingObj: any;
  invoiceDataList: Object;
  @Input() AppId: number;
  appObj:any;
  listAppInvoiceDlrFncngD:any;
  IsShowDetail:boolean=false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient) {

  }

  ngOnInit() {
    this.GetListInvoiceData();
  }

  GetListInvoiceData() {
    var obj = {
      Id: this.AppId
    }
    this.http.post(URLConstant.GetAppById, obj).subscribe(
      (responseApp) => {
        this.appObj = responseApp;
        var url = URLConstant.GetListAppInvoiceFctrByAppId;
        if (responseApp["BizTemplateCode"] == CommonConstant.FCTR) {
          url = URLConstant.GetListAppInvoiceFctrByAppId;
          this.http.post(url, obj).subscribe(
            (response) => {
              this.invoiceDataList = response['AppInvoiceFctrObjs'];
            });
        } else {
          url = URLConstant.GetListAppInvoiceAppInvoiceDlrFncngHByAppId
          this.http.post(url, obj).subscribe(
            (response) => {
              this.invoiceDataList = response['AppInvoiceDlrFncngHObj'];
            });
        }
      }
    )
  }
  ToDetail(ev) {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_INVOICE_DETAIL], { "AppInvoiceFctrId": ev });
  }
  
  showDetailInvoiceData(appInvoiceDlrFncngHId){
    console.log("CEK")
    var reqObj = {
      Id:appInvoiceDlrFncngHId
    }
    this.http.post(URLConstant.GetListAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId, reqObj).subscribe(
      (response)=>{
        this.listAppInvoiceDlrFncngD = response["ReturnObject"].AppInvoiceDlrFncngD;
        this.IsShowDetail = true;
      }
    )
  }
  hideDetailInvoiceData(){
    this.IsShowDetail = false;
  }
}


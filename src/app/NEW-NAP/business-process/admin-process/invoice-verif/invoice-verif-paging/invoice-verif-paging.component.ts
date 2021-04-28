import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-invoice-verif-paging',
  templateUrl: './invoice-verif-paging.component.html'
})
export class InvoiceVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerif.json";
  }

  getEvent(ev) {
    if(ev.Key == "prodOff"){
      let GetProduct = new GenericObj();
      GetProduct.Code = ev.RowObj.ProdOfferingCode;
      this.http.post(URLConstant.GetProdOfferingHByCode, GetProduct).subscribe(
        response => {
          window.open(environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + response['ProdOfferingHId'], '_blank');
        });
    }
  }
}

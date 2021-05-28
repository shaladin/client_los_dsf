import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice-verif-paging',
  templateUrl: './invoice-verif-paging.component.html'
})
export class InvoiceVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.bizTemplateCode = params["BizTemplateCode"];
    });
  }

  ngOnInit() {
    if (this.bizTemplateCode == "DF") {
      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifDF.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifDF.json";
    }
    else{
      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerif.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerif.json";
    }
    
  }

  getEvent(ev) {
    if(ev.Key == "prodOff"){
      let GetProduct = new GenericObj();
      GetProduct.Code = ev.RowObj.ProdOfferingCode;
      this.http.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).subscribe(
        response => {
          window.open(environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + response.Id, '_blank');
        });
    }
  }
}

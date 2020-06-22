import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice-verif-paging',
  templateUrl: './invoice-verif-paging.component.html',
  styleUrls: ['./invoice-verif-paging.component.scss']
})
export class InvoiceVerifPagingComponent implements OnInit {

  inputPagingObj: any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.inputPagingObj = new UcpagingModule();
    this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerif.json";
  }

  getEvent(ev) {
    if(ev.Key == "prodOff"){
      this.http.post(AdInsConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          window.open(environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + response['ProdOfferingHId'], '_blank');
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}

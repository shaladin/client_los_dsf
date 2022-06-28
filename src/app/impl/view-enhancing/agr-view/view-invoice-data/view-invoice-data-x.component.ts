import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import {ViewPurchaseOrderDetailXComponent} from '../view-purchase-order-detail/view-purchase-order-detail-x.component';

@Component({
  selector: 'app-view-invoice-data-x',
  templateUrl: './view-invoice-data-x.component.html'
})
export class ViewInvoiceDataXComponent implements OnInit {

  @Input() AgrmntId: number = 0;
  @Input() BizTemplateCode: string;
  constructor(private http: HttpClient, private modalService: NgbModal) {

  }

  AppAssetListAndInvoiceXForView: [];
  IsHidden: boolean = true;
  AppId: number;
  SupplCode: string = "";

  async ngOnInit() {

    if(this.BizTemplateCode == CommonConstant.CFNA){
      await this.http.post(URLConstantX.GetAppCollateralListAndInvoiceXForView, {Id: this.AgrmntId}).toPromise().then(
          (response) => {
            this.AppAssetListAndInvoiceXForView = response[CommonConstant.ReturnObj];
            console.log(response)
        });
    }else{
      await this.http.post(URLConstantX.GetAppAssetListAndInvoiceXForView, {Id: this.AgrmntId}).toPromise().then(
        (response) => {
          this.AppAssetListAndInvoiceXForView = response[CommonConstant.ReturnObj];
        });
    }
  }

  getValue(event){
    this.IsHidden = event;
  }

}

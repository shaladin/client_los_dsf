import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import {ViewPurchaseOrderDetailXComponent} from '../view-purchase-order-detail/view-purchase-order-detail-x.component';

@Component({
  selector: 'app-view-purchase-order-list-x',
  templateUrl: './view-purchase-order-list-x.component.html'
})
export class ViewPurchaseOrderListXComponent implements OnInit {

  @Input() AgrmntId: number = 0;
  @Input() BizTemplateCode: string;
  constructor(private http: HttpClient, private modalService: NgbModal) {

  }

  AppAssetList = [];
  IsHidden: boolean = true;
  AppId: number;
  SupplCode: string = "";

  viewPurchaseOrderDetailHandler(item){

    const modalPODetail = this.modalService.open(ViewPurchaseOrderDetailXComponent);
    modalPODetail.componentInstance.AgrmntId = item.AgrmntId;
    modalPODetail.componentInstance.AppId = item.AppId;
    modalPODetail.componentInstance.SupplCode = item.SupplCode;
    modalPODetail.componentInstance.LobCode = this.BizTemplateCode;
    modalPODetail.result.then().catch((error) => {
    });
  }

  async ngOnInit() {
    let reqAppAssetObj = {
      Id: this.AgrmntId
    }
    await this.http.post(URLConstant.GetAppAssetListByAgrmntId, reqAppAssetObj).toPromise().then(
    (response) => {
      this.AppAssetList = response[CommonConstant.ReturnObj];
    });
  }

  getValue(event){
    this.IsHidden = event;
  }

}

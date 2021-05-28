import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewDeliveryOrderAssetDetailComponent } from '../view-delivery-order-asset-detail/view-delivery-order-asset-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';

@Component({
  selector: 'app-view-delivery-order-detail',
  templateUrl: './view-delivery-order-detail.component.html',
  styleUrls: ['./view-delivery-order-detail.component.scss']
})
export class ViewDeliveryOrderDetailComponent implements OnInit {
  DOHId: number;
  assetDetailList: Array<AppAssetObj>;
  doData: DeliveryOrderHObj;

  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal, private spinner: NgxSpinnerService) {
    this.route.queryParams.subscribe(params => {
      if (params['DOHId'] != null) {
        this.DOHId = params['DOHId'];
      }
    });
  }

  async ngOnInit(){
    // var doObj = new DeliveryOrderHObj();
    // doObj.DeliveryOrderHId = this.DOHId;
    var doObj = { Id: this.DOHId };
    this.http.post(URLConstant.GetListAppAssetByDOHId, doObj).subscribe(
      (response) => { 
       this.assetDetailList = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetDeliveryOrderHByDeliveryOrderHId, { Id: this.DOHId }).subscribe(
      (response:any) => { 
        this.doData = response;
      });
  }

  openModal(appAssetId) {
    const modalMouFee = this.modalService.open(ViewDeliveryOrderAssetDetailComponent);
    modalMouFee.componentInstance.AppAssetId = appAssetId;
    modalMouFee.result.then(
      (response) => {
        this.spinner.show();
        // this.spinner.hide();
      }
    ).catch((error) => {
    });
  }
}

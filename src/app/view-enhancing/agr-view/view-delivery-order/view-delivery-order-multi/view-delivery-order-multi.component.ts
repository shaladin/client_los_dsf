import { Component, Input, OnInit } from '@angular/core';
import { DeliveryOrderHObj } from 'app/shared/model/delivery-order-h-obj.model';

@Component({
  selector: 'app-view-delivery-order-multi',
  templateUrl: './view-delivery-order-multi.component.html'
})
export class ViewDeliveryOrderMultiComponent implements OnInit {
  @Input() doList: Array<DeliveryOrderHObj>;
  @Input() appId: number;
  doDetail: boolean = false;
  doDetailObj: DeliveryOrderHObj;

  readonly showBackButton: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  editDOHandler(index: number) {
    this.doDetailObj = this.doList[index];
    this.doDetail = true;
  }

  backButton(event){
    this.doDetail = event;
  }
}

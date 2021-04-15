import { Component, OnInit, Input } from '@angular/core';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';

@Component({
  selector: 'app-offering-office-mbr',
  templateUrl: './offering-office-mbr.component.html'
})
export class OfferingOfficeMbrComponent implements OnInit {

  isOn: boolean;
  @Input() ProdOfferingHId: number;
  @Input() ProdHId: number;
  ListOfficeMemberObj: Array<string> = new Array<string>();
  
  constructor() { }

  ngOnInit() {
    this.isOn = true;
    this.ListOfficeMemberObj = [];
  }

  ChangeComponent(ev: ProdOfficePassingObj){
    console.log("YEET")
    this.isOn = ev.isOn;
    this.ListOfficeMemberObj = ev.result;
  }
}

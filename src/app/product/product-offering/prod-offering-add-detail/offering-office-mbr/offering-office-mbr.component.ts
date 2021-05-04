import { Component, OnInit, Input } from '@angular/core';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';

@Component({
  selector: 'app-offering-office-mbr',
  templateUrl: './offering-office-mbr.component.html'
})
export class OfferingOfficeMbrComponent implements OnInit {

  IsOn: boolean;
  @Input() ProdOfferingHId: number;
  @Input() ProdHId: number;
  ListOfficeMemberObj: Array<string> = new Array<string>();
  
  constructor() { }

  ngOnInit() {
    this.IsOn = true;
    this.ListOfficeMemberObj = [];
  }

  ChangeComponent(ev: ProdOfficePassingObj){
    this.IsOn = ev.isOn;
    this.ListOfficeMemberObj = ev.result;
  }
}

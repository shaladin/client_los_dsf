import { Component, OnInit, Input } from '@angular/core';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';

@Component({
  selector: 'app-ho-office-mbr',
  templateUrl: './ho-office-mbr.component.html'
})
export class HoOfficeMbrComponent implements OnInit {
  @Input() ProdHId: number;
  isOn: boolean;
  ListOfficeMemberObj: Array<string> = new Array<string>();

  constructor() { }

  ngOnInit() {
    this.isOn = true;
    this.ListOfficeMemberObj = [];
  }

  ChangeComponent(ev: ProdOfficePassingObj) {
    this.isOn = ev.isOn;
    this.ListOfficeMemberObj = ev.result;
  }
}

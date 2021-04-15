import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offering-office-mbr',
  templateUrl: './offering-office-mbr.component.html'
})
export class OfferingOfficeMbrComponent implements OnInit {

  isOn: boolean;
  @Input() ProdOfferingHId: number;
  ListOfficeMemberObj: any = {};
  
  constructor() { }

  ngOnInit() {
    this.isOn = true;
    this.ListOfficeMemberObj["ProdOfferingHId"]= this.ProdOfferingHId;
    this.ListOfficeMemberObj["result"] = [];
  }

  ChangeComponent(ev: any){
    this.isOn = ev.isOn;
    this.ListOfficeMemberObj["result"] = ev.result;
  }
}

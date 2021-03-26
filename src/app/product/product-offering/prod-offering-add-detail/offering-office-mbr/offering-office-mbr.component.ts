import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offering-office-mbr',
  templateUrl: './offering-office-mbr.component.html'
})
export class OfferingOfficeMbrComponent implements OnInit {

  isOn: any;
  @Input() objInput: any;
  @Input() ProdHId: any;
  ListOfficeMemberObj: any = {};
  
  constructor() { }

  ngOnInit() {
    console.log("BBBBBBBBBBB");
    this.isOn = true;
    this.ListOfficeMemberObj["param"]=this.objInput["param"];
    this.ListOfficeMemberObj["result"] = [];
  }

  GetSearchedOfficeObjOutput(ev: any){
  }

  ChangeComponent(ev: any){
    this.isOn = ev.isOn;
    this.ListOfficeMemberObj["result"] = ev.result;
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ho-office-mbr',
  templateUrl: './ho-office-mbr.component.html'
})
export class HoOfficeMbrComponent implements OnInit {
  isOn: any;
  @Input() objInput: any;
  ListOfficeMemberObj: any = {};
  
  constructor() { }

  ngOnInit() {
    this.isOn = true;
    this.ListOfficeMemberObj["ProdHId"]=this.objInput["ProdHId"];
    this.ListOfficeMemberObj["result"] = [];
  }

  ChangeComponent(ev: any){
    this.isOn = ev.isOn;
    this.ListOfficeMemberObj["result"] = ev.result;
  }
}

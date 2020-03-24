import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commission-add',
  templateUrl: './commission-add.component.html',
  styleUrls: ['./commission-add.component.scss']
})
export class CommissionAddComponent implements OnInit {

  constructor() { }
  
  viewProdMainInfoObj;
  FormInputObj: any = {};
  ngOnInit() {
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    
    this.FormInputObj["title"] = "List Supplier Commission Data";
    this.FormInputObj["content"] = "Supplier";
  }

  GetData(ev){
    console.log(ev);
  }

}

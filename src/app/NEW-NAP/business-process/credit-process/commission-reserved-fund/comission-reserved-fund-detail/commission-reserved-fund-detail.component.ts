import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commission-reserved-fund-detail',
  templateUrl: './commission-reserved-fund-detail.component.html',
  styleUrls: []
})
export class CommissionReservedFundDetailComponent implements OnInit {

  appId;
  constructor(
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    });
  }

  viewProdMainInfoObj;
  ngOnInit() {
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    
  }

  isTab1;
  isTab2;
  EnterTab(type){
    if (type == "tab1") {
      this.isTab1 = true;
      this.isTab2 = false;
    }
    if (type == "tab2") {
      this.isTab1 = false;
      this.isTab2 = true;
    }
  }
}

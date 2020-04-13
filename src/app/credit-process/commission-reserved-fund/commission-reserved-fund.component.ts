import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-commission-reserved-fund',
  templateUrl: './commission-reserved-fund.component.html',
  styleUrls: ['./commission-reserved-fund.component.scss']
})
export class CommissionReservedFundComponent implements OnInit {

  appId;
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private toastr: NGXToastrService, 
    private fb: FormBuilder) {

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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-app-add-detail',
  templateUrl: './app-add-detail.component.html',
  styleUrls: ['./app-add-detail.component.scss'],
  providers: [NGXToastrService]
})
export class AppAddDetailComponent implements OnInit {

  param;
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private toastr: NGXToastrService) { 
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.param = params["AppId"];
      }
    });
  }

  viewProdMainInfoObj;
  ngOnInit() {
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
  }

  isTab1: boolean = false;
  isTab2: boolean = true;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  EnterTab(type){
    if(type == "tab1"){
      this.isTab1 = true;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
    }
    if(type == "tab2"){
      this.isTab1 = false;
      this.isTab2 = true;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
    }
    if(type == "tab3"){
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = true;
      this.isTab4 = false;
      this.isTab5 = false;
    }
    if(type == "tab4"){
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = true;
      this.isTab5 = false;
    }
    if(type == "tab5"){
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = true;
    }
  }
}

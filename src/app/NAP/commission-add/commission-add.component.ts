import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commission-add',
  templateUrl: './commission-add.component.html',
  styleUrls: ['./commission-add.component.scss']
})
export class CommissionAddComponent implements OnInit {

  AppId;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });
  }
  
  viewProdMainInfoObj;
  viewIncomeInfoObj;
  tempViewIncomeInfoObj;
  FormGetObj;
  FormInputObjSupplier: any = {};
  FormInputObjSupplierEmpl: any = {};
  FormInputObjReferantor: any = {};
  ngOnInit() {
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";

    this.viewIncomeInfoObj = {
      UppingRate: 1,
      InsuranceIncome: 2,
      LifeInsuranceIncome: 3,
      MaxAllocatedAmount: 4,
      RemainingAllocatedAmount: 5,
      Other: [12, 23, 34, 45]
    };
    // console.log("View Income Info");
    // console.log(this.viewIncomeInfoObj);

    this.FormInputObjSupplier["title"] = "List Supplier Commission Data";
    this.FormInputObjSupplier["content"] = "Supplier";
    this.FormInputObjSupplier["AppId"] = this.AppId;
    this.FormInputObjSupplier["url"] = "";

    this.FormInputObjSupplierEmpl["title"] = "List Supplier Employee Commission Data";
    this.FormInputObjSupplierEmpl["content"] = "Supplier Employee";
    this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
    this.FormInputObjSupplierEmpl["url"] = "";

    this.FormInputObjReferantor["title"] = "List Referantor Commission Data";
    this.FormInputObjReferantor["content"] = "Referantor";
    this.FormInputObjReferantor["AppId"] = this.AppId;
    this.FormInputObjReferantor["url"] = "";
  }

  GetData(ev){
    console.log(ev);
    this.FormGetObj = ev;
  }

  CalculateTotal(){
    
  }

}

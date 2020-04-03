import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

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
  OnForm1;
  OnForm2;
  OnForm3;
  ngOnInit() {
    this.OnForm1 = false;
    this.OnForm2 = false;
    this.OnForm3 = false;

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

    this.GetContentName("Supplier");
    this.GetContentName("Referantor");

  }

  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  GetContentName(content){
    var url;
    var obj;
    if(content == "Supplier"){
      url = environment.losUrl + AdInsConstant.GetAppAssetListByAppIdForCommision;
      obj={
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.GetDDLContent(response["ReturnObject"], "Supplier");
          this.GetContentName("Supplier Employee");
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(content == "Supplier Employee"){
      url = environment.losUrl + AdInsConstant.GetListAppAssetSupplEmpByListAppAssetId;
      obj={
        AppAssetId: this.AppAssetIdList,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.GetDDLContent(response["ReturnObject"], "Supplier Employee");
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(content == "Referantor"){
      url = environment.losUrl + AdInsConstant.GetAppReferantorByAppId;
      obj={
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.GetDDLContent(response, "Referantor");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  AppAssetIdList = new Array();
  GetDDLContent(ReturnObject, content){
    if(content == "Referantor"){
      var KVPObj;
      KVPObj = {
        Key: ReturnObject.ReferantorCode,
        Value: ReturnObject.ReferantorName
      };   
      this.ContentObjReferantor.push(KVPObj);
    }else{
      for(var i = 0;i<ReturnObject.length;i++){
        var KVPObj;
        if(content == "Supplier"){
          KVPObj = {
            Key: ReturnObject[i].FullAssetCode,
            Value: ReturnObject[i].FullAssetName
          };
          this.ContentObjSupplier.push(KVPObj);
          this.AppAssetIdList.push(ReturnObject[i].AppAssetId);
        }else if(content == "Supplier Employee"){
          KVPObj = {
            Key: ReturnObject[i].SupplEmpNo,
            Value: ReturnObject[i].SupplEmpName
          };
          this.ContentObjSupplierEmp.push(KVPObj);
        }
      }
    }
    console.log("cek ddl data");
    console.log(this.ContentObjSupplier);
    console.log(this.ContentObjSupplierEmp);
    console.log(this.ContentObjReferantor);
    this.GetFormAddDynamicObj(content);
  }
  
  GetFormAddDynamicObj(content){
    if(content == "Supplier"){
      this.FormInputObjSupplier["title"] = "List Supplier Commission Data";
      this.FormInputObjSupplier["content"] = "Supplier";
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.OnForm1 = true;
    }else if(content == "Supplier Employee"){
      this.FormInputObjSupplierEmpl["title"] = "List Supplier Employee Commission Data";
      this.FormInputObjSupplierEmpl["content"] = "Supplier Employee";
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      this.OnForm2 = true;
    }else if(content == "Referantor"){
      this.FormInputObjReferantor["title"] = "List Referantor Commission Data";
      this.FormInputObjReferantor["content"] = "Referantor";
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.OnForm3 = true;
    }
  }

  GetData(ev){
    console.log(ev);
    this.FormGetObj = ev;
  }

  CalculateTotal(){
    
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ProdHObj } from 'app/shared/model/Product/ProdHObj.model';

@Component({
  selector: 'app-prod-ho-add-detail',
  templateUrl: './prod-ho-add-detail.component.html'
})
export class ProdHoAddDetailComponent implements OnInit {

  param: any;
  mode: string = "add";
  key: any;
  criteria: CriteriaObj[] = [];
  objPassing: any = {};
  source: string = "";
  ResultResponse: any;
  ProdHOBj: any;
  UrlBackEnd: any;
  type: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  RefProductHOForm = this.fb.group({
    ProdCode: [''],
    ProdName: [''],
    StatusCode: [''],
    ProdDescr: [''],
    StartDt: [''],
    EndDt: [''],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.objPassing["ProdId"] = params["ProdId"];
      this.objPassing["ProdHId"] = params["ProdHId"];
      this.objPassing["mode"] = params["mode"];
      this.objPassing["url"] = URLConstant.GetProductDetailComponentInfo;
      this.source = params["source"];
      this.key = params["key"];
    })
  }

  ngOnInit() {
    if(this.source == "return")
    {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformationReturn.json";
    }
    else{
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";
    }
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.whereValue.push(this.objPassing.ProdHId)
    
    this.ProdHOBj=new ProdHObj();
    this.ProdHOBj.ProdHId = this.objPassing.ProdHId;
    this.UrlBackEnd = URLConstant.GetProductMainInfo;
    this.http.post(this.UrlBackEnd, this.ProdHOBj).subscribe(
      (response) => {
        this.ResultResponse = response;
        this.RefProductHOForm.patchValue({
          ProdCode: this.ResultResponse.ProdCode,
          ProdName: this.ResultResponse.ProdName,
          ProdDescr: this.ResultResponse.ProdDescr,
          StatusCode: this.ResultResponse.StatusCode,
          StartDt: formatDate(this.ResultResponse.StartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.ResultResponse.EndDt, 'yyyy-MM-dd', 'en-US')
        });
      }
    );
  }

  EnterTab(type) {
    this.type = type;
  }
}

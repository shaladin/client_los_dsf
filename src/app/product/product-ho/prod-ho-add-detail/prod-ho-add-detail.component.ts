import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResGetProductHObj } from 'app/shared/model/Response/Product/ResGetProdObj.model';

@Component({
  selector: 'app-prod-ho-add-detail',
  templateUrl: './prod-ho-add-detail.component.html'
})
export class ProdHoAddDetailComponent implements OnInit {
  mode: string = "add";
  ProdId: number;
  ProdHId: number;
  source: string = "";
  type: string;
  GenericByIdObj : GenericObj = new GenericObj();
  ResultResponse: ResGetProductHObj = new ResGetProductHObj();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.ProdHId = params["ProdHId"];
      this.ProdId = params["ProdId"];
      this.source = params["source"];
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
    this.viewGenericObj.whereValue.push(this.ProdHId)
    
    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.GetProdHById, this.GenericByIdObj).subscribe(
      (response : ResGetProductHObj) => {
        this.ResultResponse = response;
      }
    );
  }

  EnterTab(type) {
    this.type = type;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResGetProdOfferingHObj } from 'app/shared/model/Response/Product/ResGetProdOfferingObj.model';
@Component({
  selector: 'app-prod-offering-add-detail',
  templateUrl: './prod-offering-add-detail.component.html'
})
export class ProdOfferingAddDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              private http: HttpClient,
              private fb:FormBuilder) { 
    this.route.queryParams.subscribe(params => {
      this.objPassing["ProdOfferingHId"] = params["ProdOfferingHId"];
      this.objPassing["ProdOfferingId"] = params["ProdOfferingId"];
      this.objPassing["mode"] = params["mode"];
      this.source = params["source"];
      this.objPassing["url"] = URLConstant.GetProdOfferingDetailInfo;
    })
  }

  source:string ="";
  param: string;
  resultData : ResGetProdOfferingHObj = new ResGetProdOfferingHObj();
  ProdOfferingHId: number;
  ProdHId: number;
  isGeneralData: boolean = true;
  isProdCompnt: boolean = false;
  isOfficeMbr: boolean = false;

  objPassing: any = {};

  ProdOfferingForm = this.fb.group({
    ProdName: [''],
    ProdOfferingCode: [''],
    ProdOfferingName: [''],
    ProdOfferingDescr: [''],
    StartDt: [''],
    EndDt: [''],
    ProdOfferingStat: [''],
    ReturnNotes: ['']
  });

  ngOnInit() {
    this.http.post(URLConstant.GetProductOfferingMainInfo, {Id: this.objPassing.ProdOfferingHId}).subscribe(
      (response : ResGetProdOfferingHObj) => {
        this.resultData = response;
        this.ProdHId = response.ProdHId;
        this.ProdOfferingForm.patchValue({
          ProdOfferingCode : this.resultData.ProdOfferingCode,
          ProdOfferingName : this.resultData.ProdOfferingName,
          ProdOfferingDescr : this.resultData.ProdOfferingDescr,
          StartDt : formatDate(this.resultData.StartDt,'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.resultData.EndDt,'yyyy-MM-dd', 'en-US'),
          ProdOfferingStat : this.resultData.ProdOfferingStat,
          ReturnNotes : this.resultData.ReturnNotes
        })
      }
    );
  }

  EnterTab(type){
    if(type == "general"){
      this.isGeneralData = true;
      this.isProdCompnt = false;
      this.isOfficeMbr = false;
    }

    if(type == "prodCompnt"){
      this.isGeneralData = false;
      this.isProdCompnt = true;
      this.isOfficeMbr = false;
    }

    if(type == "officeMbr"){
      this.isGeneralData = false;
      this.isProdCompnt = false;
      this.isOfficeMbr = true;
    }
  }
}

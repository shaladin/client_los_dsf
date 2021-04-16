import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResGetProdOfferingHObj } from 'app/shared/model/Response/Product/ResGetProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
@Component({
  selector: 'app-prod-offering-add-detail',
  templateUrl: './prod-offering-add-detail.component.html'
})
export class ProdOfferingAddDetailComponent implements OnInit {
  ProdOfferingHId: number;
  ProdOfferingId: number;
  ProdHId: number;
  IsGeneralData: boolean = true;
  IsProdCompnt: boolean = false;
  IsOfficeMbr: boolean = false;
  GenericByIdObj: GenericObj = new GenericObj();
  ResGetProdOffHObj : ResGetProdOfferingHObj = new ResGetProdOfferingHObj();
  Source:string ="";

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

  constructor(private route: ActivatedRoute, 
              private http: HttpClient,
              private fb:FormBuilder) { 
    this.route.queryParams.subscribe(params => {
      this.ProdOfferingHId = params["ProdOfferingHId"];
      this.ProdOfferingId = params["ProdOfferingId"];
      this.Source = params["source"];
    })
  }

  ngOnInit() {
    this.GenericByIdObj.Id = this.ProdOfferingHId
    this.http.post(URLConstant.GetProdOfferingHById, this.GenericByIdObj).subscribe(
      (response : ResGetProdOfferingHObj) => {
        this.ResGetProdOffHObj = response;
        this.ProdHId = response.ProdHId;
        this.ProdOfferingForm.patchValue({
          ProdOfferingCode : this.ResGetProdOffHObj.ProdOfferingCode,
          ProdOfferingName : this.ResGetProdOffHObj.ProdOfferingName,
          ProdOfferingDescr : this.ResGetProdOffHObj.ProdOfferingDescr,
          StartDt : formatDate(this.ResGetProdOffHObj.StartDt,'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.ResGetProdOffHObj.EndDt,'yyyy-MM-dd', 'en-US'),
          ProdOfferingStat : this.ResGetProdOffHObj.ProdOfferingStat,
          ReturnNotes : this.ResGetProdOffHObj.ReturnNotes
        })
      }
    );
  }

  EnterTab(type){
    if(type == "general"){
      this.IsGeneralData = true;
      this.IsProdCompnt = false;
      this.IsOfficeMbr = false;
    }

    if(type == "prodCompnt"){
      this.IsGeneralData = false;
      this.IsProdCompnt = true;
      this.IsOfficeMbr = false;
    }

    if(type == "officeMbr"){
      this.IsGeneralData = false;
      this.IsProdCompnt = false;
      this.IsOfficeMbr = true;
    }
  }
}

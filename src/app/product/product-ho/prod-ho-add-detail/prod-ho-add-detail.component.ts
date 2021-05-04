import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-prod-ho-add-detail',
  templateUrl: './prod-ho-add-detail.component.html'
})
export class ProdHoAddDetailComponent implements OnInit {
  ProdId: number;
  ProdHId: number;
  Source: string = "";
  Type: string;
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.ProdHId = params["ProdHId"];
      this.ProdId = params["ProdId"];
      this.Source = params["source"];
    })
  }

  ngOnInit() {
    if(this.Source == "return")
    {
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformationReturn.json";
    }
    else{
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";
    }
    this.ViewGenericObj.whereValue.push(this.ProdHId);
  }

  EnterTab(type: string) {
    this.Type = type;
  }
}

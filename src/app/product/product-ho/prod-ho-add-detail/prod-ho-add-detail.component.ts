import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

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
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(
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
    this.viewGenericObj.whereValue.push(this.ProdHId);
  }

  EnterTab(type) {
    this.type = type;
  }
}

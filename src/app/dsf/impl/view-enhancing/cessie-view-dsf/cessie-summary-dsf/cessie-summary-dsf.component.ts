import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'cessie-summary-view-dsf',
  templateUrl: './cessie-summary-dsf.component.html'
})
export class CessieSummaryDsfComponent implements OnInit {
  @Input() CessieHXId: number;

  IsReady: boolean = false;
  viewGenericSummaryInfoObj: UcViewGenericObj = new UcViewGenericObj();
  viewGenericSummaryDisbInfoObj: UcViewGenericObj = new UcViewGenericObj();


  constructor() {
  }

  ngOnInit() {
    this.viewGenericSummaryInfoObj.viewInput = "./assets/ucviewgeneric/viewCessieSummaryInfo.json";
    this.viewGenericSummaryInfoObj.viewEnvironment = environment.losUrl + '/v1';
    this.viewGenericSummaryDisbInfoObj.viewInput = "./assets/dsf/ucviewgeneric/viewCessieSummaryDisbInfoDsf.json";
    this.viewGenericSummaryDisbInfoObj.viewEnvironment = environment.losUrl + '/v1';
    this.IsReady = true;
  }
}

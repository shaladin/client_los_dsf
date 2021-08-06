import { Component, Input, OnInit } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'cessie-summary-view',
  templateUrl: './cessie-summary.component.html'
})

export class CessieSummaryComponent implements OnInit {
  @Input() CessieHXId: number;

  IsReady: boolean = false;
  viewGenericSummaryInfoObj: UcViewGenericObj = new UcViewGenericObj();
  viewGenericSummaryDisbInfoObj: UcViewGenericObj = new UcViewGenericObj();


  constructor() {
  }

  ngOnInit() {
    this.viewGenericSummaryInfoObj.viewInput = "./assets/ucviewgeneric/viewCessieSummaryInfo.json";
    this.viewGenericSummaryDisbInfoObj.viewInput = "./assets/ucviewgeneric/viewCessieSummaryDisbInfo.json";
    this.IsReady = true;
  }
}

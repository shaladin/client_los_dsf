import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-contract-summary-view',
  templateUrl: './pefindo-contract-summary-view.component.html',
  styleUrls: ['./pefindo-contract-summary-view.component.css']
})
export class PefindoContractSummaryViewComponent implements OnInit {

  @Input() ContractsSummary: any;

  constructor() { }

  ngOnInit() {
  }

}

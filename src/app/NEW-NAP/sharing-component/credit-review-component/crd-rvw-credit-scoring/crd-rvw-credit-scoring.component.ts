import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-credit-scoring',
  templateUrl: './crd-rvw-credit-scoring.component.html',
  styleUrls: ['./crd-rvw-credit-scoring.component.scss']
})
export class CrdRvwCreditScoringComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  
  constructor() { }

  ngOnInit() {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ScoringResultDObj } from 'app/shared/model/scoring-result-d-obj.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';

@Component({
  selector: 'app-crd-rvw-credit-scoring',
  templateUrl: './crd-rvw-credit-scoring.component.html',
  styleUrls: ['./crd-rvw-credit-scoring.component.scss']
})
export class CrdRvwCreditScoringComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  @Input() scoringResultHObj: ScoringResultHObj = new ScoringResultHObj();
  @Input() ListScoringResultDObj: Array<ScoringResultDObj> = new Array<ScoringResultDObj>();
  
  constructor() { }

  ngOnInit() {
  }

}

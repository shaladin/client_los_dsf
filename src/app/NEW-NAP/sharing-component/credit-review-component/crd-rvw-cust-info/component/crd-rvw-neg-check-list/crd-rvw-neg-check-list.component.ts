import { Component, Input, OnInit } from '@angular/core';
import { NegCustObj } from 'app/shared/model/CreditReview/NegCustObj.Model';

@Component({
  selector: 'app-crd-rvw-neg-check-list',
  templateUrl: './crd-rvw-neg-check-list.component.html',
  styleUrls: ['./crd-rvw-neg-check-list.component.scss']
})
export class CrdRvwNegCheckListComponent implements OnInit {

  constructor() { }

  @Input() ListNegCust: Array<NegCustObj> = new Array<NegCustObj>();
  ngOnInit() {
  }

}

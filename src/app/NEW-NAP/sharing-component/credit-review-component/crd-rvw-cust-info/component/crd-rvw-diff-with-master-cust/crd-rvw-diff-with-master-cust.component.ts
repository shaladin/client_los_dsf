import { Component, Input, OnInit } from '@angular/core';
import { CrdRvwDiffAppToMasterCustObj } from 'app/shared/model/credit-review/crd-rvw-diff-app-to-master-cust-obj.model';

@Component({
  selector: 'app-crd-rvw-diff-with-master-cust',
  templateUrl: './crd-rvw-diff-with-master-cust.component.html',
  styleUrls: ['./crd-rvw-diff-with-master-cust.component.scss']
})
export class CrdRvwDiffWithMasterCustComponent implements OnInit {

  @Input() ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> = new Array<CrdRvwDiffAppToMasterCustObj>();
  constructor() { }

  ngOnInit() {
  }

}

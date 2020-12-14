import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-dealer-info',
  templateUrl: './crd-rvw-dealer-info.component.html',
  styleUrls: ['./crd-rvw-dealer-info.component.scss']
})
export class CrdRvwDealerInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

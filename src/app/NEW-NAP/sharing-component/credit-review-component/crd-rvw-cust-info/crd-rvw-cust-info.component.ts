import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-cust-info',
  templateUrl: './crd-rvw-cust-info.component.html',
  styleUrls: ['./crd-rvw-cust-info.component.scss']
})
export class CrdRvwCustInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

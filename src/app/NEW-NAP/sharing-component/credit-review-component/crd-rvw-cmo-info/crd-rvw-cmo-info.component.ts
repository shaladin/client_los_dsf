import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-cmo-info',
  templateUrl: './crd-rvw-cmo-info.component.html',
  styleUrls: ['./crd-rvw-cmo-info.component.scss']
})
export class CrdRvwCmoInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

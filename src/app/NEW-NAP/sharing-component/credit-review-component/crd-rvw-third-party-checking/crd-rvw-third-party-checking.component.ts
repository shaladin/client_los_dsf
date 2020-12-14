import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-third-party-checking',
  templateUrl: './crd-rvw-third-party-checking.component.html',
  styleUrls: ['./crd-rvw-third-party-checking.component.scss']
})
export class CrdRvwThirdPartyCheckingComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

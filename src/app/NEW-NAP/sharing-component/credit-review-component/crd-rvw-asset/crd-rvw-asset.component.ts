import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-asset',
  templateUrl: './crd-rvw-asset.component.html',
  styleUrls: ['./crd-rvw-asset.component.scss']
})
export class CrdRvwAssetComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  constructor() { }

  ngOnInit() {
  }

}

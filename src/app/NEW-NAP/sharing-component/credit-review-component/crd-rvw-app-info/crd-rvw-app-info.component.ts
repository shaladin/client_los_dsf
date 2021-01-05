import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-app-info',
  templateUrl: './crd-rvw-app-info.component.html',
  styleUrls: ['./crd-rvw-app-info.component.scss']
})
export class CrdRvwAppInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  
  constructor() { }

  ngOnInit() {
  }

}

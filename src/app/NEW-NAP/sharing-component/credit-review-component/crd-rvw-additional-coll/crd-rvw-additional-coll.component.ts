import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-additional-coll',
  templateUrl: './crd-rvw-additional-coll.component.html',
  styleUrls: ['./crd-rvw-additional-coll.component.scss']
})
export class CrdRvwAdditionalCollComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  
  constructor() { }

  ngOnInit() {
  }

}

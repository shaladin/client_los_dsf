import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-fam-guar',
  templateUrl: './crd-rvw-fam-guar.component.html',
  styleUrls: ['./crd-rvw-fam-guar.component.scss']
})
export class CrdRvwFamGuarComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

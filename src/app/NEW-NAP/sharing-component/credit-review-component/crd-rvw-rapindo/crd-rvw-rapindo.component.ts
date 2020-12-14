import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-rapindo',
  templateUrl: './crd-rvw-rapindo.component.html',
  styleUrls: ['./crd-rvw-rapindo.component.scss']
})
export class CrdRvwRapindoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

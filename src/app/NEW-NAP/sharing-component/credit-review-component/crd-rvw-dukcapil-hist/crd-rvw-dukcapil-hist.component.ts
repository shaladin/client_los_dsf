import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-dukcapil-hist',
  templateUrl: './crd-rvw-dukcapil-hist.component.html',
  styleUrls: ['./crd-rvw-dukcapil-hist.component.scss']
})
export class CrdRvwDukcapilHistComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-legal-doc',
  templateUrl: './crd-rvw-legal-doc.component.html',
  styleUrls: ['./crd-rvw-legal-doc.component.scss']
})
export class CrdRvwLegalDocComponent implements OnInit {

  constructor() { }

  ListLegalDoc: Array<any> = new Array<any>();
  ngOnInit() {
  }

}

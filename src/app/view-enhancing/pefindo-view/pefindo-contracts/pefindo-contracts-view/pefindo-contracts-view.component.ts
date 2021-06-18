import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-contracts-view',
  templateUrl: './pefindo-contracts-view.component.html',
  styleUrls: ['./pefindo-contracts-view.component.css']
})
export class PefindoContractsViewComponent implements OnInit {

  @Input() Contracts: any;

  constructor() { }

  ngOnInit() {
  }

}

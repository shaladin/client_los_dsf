import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-dashboard-view',
  templateUrl: './pefindo-dashboard-view.component.html',
  styleUrls: ['./pefindo-dashboard-view.component.css']
})
export class PefindoDashboardViewComponent implements OnInit {

  @Input() PefindoData: any;

  constructor() { }

  ngOnInit() {
  }

}

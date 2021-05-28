import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-personal-info-coy-view',
  templateUrl: './pefindo-personal-info-coy-view.component.html',
  styleUrls: ['./pefindo-personal-info-coy-view.component.css']
})
export class PefindoPersonalInfoCoyViewComponent implements OnInit {

  @Input() PefindoData: any;

  constructor() { }

  ngOnInit() {
  }

}

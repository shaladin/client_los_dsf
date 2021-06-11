import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-personal-info-view',
  templateUrl: './pefindo-personal-info-view.component.html',
  styleUrls: ['./pefindo-personal-info-view.component.css']
})
export class PefindoPersonalInfoViewComponent implements OnInit {

  @Input() PefindoData: any;

  constructor() { }

  ngOnInit() {
  }

}

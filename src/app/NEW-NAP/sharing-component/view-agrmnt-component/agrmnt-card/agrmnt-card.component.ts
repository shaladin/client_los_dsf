import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agrmnt-card',
  templateUrl: './agrmnt-card.component.html'
})
export class AgrmntCardComponent implements OnInit {

  constructor() { }
  viewAgrCardMainInfo : string;
  ngOnInit() {
    this.viewAgrCardMainInfo = "./assets/ucviewgeneric/viewAgrCardMainInfo.json";
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-agrmnt',
  templateUrl: './view-agrmnt.component.html' 
})
export class ViewAgrmntComponent implements OnInit {

  constructor() { }
  viewAgrMainInfo : string;
  ngOnInit() {
    this.viewAgrMainInfo = "./assets/ucviewgeneric/viewAgrMainInfo.json";
  }

}

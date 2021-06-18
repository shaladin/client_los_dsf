import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-other-data-view',
  templateUrl: './pefindo-other-data-view.component.html',
  styleUrls: ['./pefindo-other-data-view.component.css']
})
export class PefindoOtherDataViewComponent implements OnInit {

  @Input() OtherData: any;

  constructor() { }

  ngOnInit() {
  }

}

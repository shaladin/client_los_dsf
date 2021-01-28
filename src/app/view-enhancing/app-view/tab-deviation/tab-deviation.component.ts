import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-deviation',
  templateUrl: './tab-deviation.component.html',
  styleUrls: []
})
export class TabDeviationComponent implements OnInit {
  @Input() AppId: number;
  @Input() Type: string;
  
  constructor() { }

  ngOnInit() {
  }
}
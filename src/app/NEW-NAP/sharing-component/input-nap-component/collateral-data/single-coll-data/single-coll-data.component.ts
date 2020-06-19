import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-single-coll-data',
  templateUrl: './single-coll-data.component.html',
  styleUrls: ['./single-coll-data.component.scss']
})
export class SingleCollDataComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  AppCollateralId: number = 0;
  mode: string = "add";

  constructor() { }

  ngOnInit() {

  }

  Next() {
    this.outputTab.emit();
  }

  Cancel(){
    this.outputCancel.emit();
  }
}

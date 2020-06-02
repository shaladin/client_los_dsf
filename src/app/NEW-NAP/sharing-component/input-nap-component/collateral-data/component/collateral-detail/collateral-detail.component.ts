import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-collateral-detail',
  templateUrl: './collateral-detail.component.html',
  styleUrls: ['./collateral-detail.component.scss']
})
export class CollateralDetailComponent implements OnInit {

  @Input() mode: string = "add";
  @Output() outputValue: EventEmitter<number> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.mode);
  }

  save(){
    this.outputValue.emit();
  }

}

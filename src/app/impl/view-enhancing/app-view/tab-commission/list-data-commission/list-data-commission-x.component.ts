import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-data-commission-x',
  templateUrl: './list-data-commission-x.component.html',
})
export class ListDataCommissionXComponent implements OnInit {

  @Input() FormInputObj;
  @Input() DictCalcMethod: { [id: string]: string } = {};
  constructor() { }

  ngOnInit() {
  }

}

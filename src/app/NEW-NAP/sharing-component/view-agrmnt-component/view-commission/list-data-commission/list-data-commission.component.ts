import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-data-commission-agrmnt',
  templateUrl: './list-data-commission.component.html',
  styleUrls: ['./list-data-commission.component.scss']
})
export class ListDataCommissionComponent implements OnInit {

  @Input() FormInputObj;
  constructor() { }

  ngOnInit() {
    // console.log(this.FormInputObj);
  }

}

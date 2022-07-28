import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-comm-after-approval-for-list-data',
  templateUrl: './edit-comm-after-approval-for-list-data.component.html',
  styleUrls: ['./edit-comm-after-approval-for-list-data.component.css']
})
export class EditCommAfterApprovalForListDataComponent implements OnInit {
  @Input() FormInputObj;
  @Input() DictCalcMethod: { [id: string]: string } = {};
  @Input() Condition:string="";
  constructor() { }

  ngOnInit() {
  }

}

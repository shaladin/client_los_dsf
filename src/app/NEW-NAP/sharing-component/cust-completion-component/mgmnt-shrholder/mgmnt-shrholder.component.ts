import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mgmnt-shrholder',
  templateUrl: './mgmnt-shrholder.component.html',
  styleUrls: ['./mgmnt-shrholder.component.scss']
})
export class MgmntShrholderComponent implements OnInit {
  @Input() AppId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  @Output() OutputCancel: EventEmitter<any> = new EventEmitter();

  inputGridObj: InputGridObj = new InputGridObj();
  ListShareholder: Array<any> = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridShareholderCustCompletion.json";
    this.loadShareholderListData();
  }

  saveAndContinue() {
    this.OutputTab.emit({IsComplete: true});
  }

  loadShareholderListData() {
    this.http.post(URLConstant.GetAppCustAndListShareholderByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.ListShareholder = this.inputGridObj.resultData.Data;
      }
    );
  }
}
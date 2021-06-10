import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-family-tab',
  templateUrl: './family-tab.component.html',
  styleUrls: ['./family-tab.component.scss']
})
export class FamilyTabComponent implements OnInit {
  @Input() AppId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  @Output() OutputCancel: EventEmitter<any> = new EventEmitter();

  inputGridObj: InputGridObj = new InputGridObj();
  listFamily: Array<any> = new Array();
  resultData: Array<any> = new Array();
  closeResult: string;
  appCustId: number;
  inputMode: string = "ADD";
  custDataObj: CustDataObj;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridFamilyCustCompletion.json";
    this.loadFamilyListData();
  }

  saveAndContinue() {
    this.OutputTab.emit({IsComplete: true});
  }

  loadFamilyListData() {
    this.http.post(URLConstant.GetAppCustAndListFamilyByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.listFamily = this.inputGridObj.resultData.Data;
      }
    );
  }
}
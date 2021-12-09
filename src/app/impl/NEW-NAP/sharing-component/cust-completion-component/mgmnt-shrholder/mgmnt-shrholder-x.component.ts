import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-mgmnt-shrholder-x',
  templateUrl: './mgmnt-shrholder-x.component.html'
})
export class MgmntShrholderXComponent implements OnInit {
  @Input() AppId: number;
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  @Output() OutputCancel: EventEmitter<any> = new EventEmitter();

  inputGridObj: InputGridObj = new InputGridObj();
  ListShareholder: Array<any> = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/impl/ucgridview/gridShareholderCustCompletionX.json";
    this.loadShareholderListData();
  }

  saveAndContinue() {
    this.OutputTab.emit({IsComplete: true});
  }

  loadShareholderListData() {
    this.http.post<AppCustCompanyObj>(URLConstant.GetAppCustCompanyByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.http.post(URLConstantX.GetListManagementShareholderForListPagingByParentAppCustCompanyId, { Id: response.AppCustCompanyId }).subscribe(
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
    );
  }
}
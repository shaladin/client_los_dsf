import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { HttpClient } from '@angular/common/http';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { LtkmCustCompanyMgmntShrholderObj } from 'app/shared/model/ltkm/ltkm-cust-company-mgmnt-shrholder-obj.model';

@Component({
  selector: 'app-ltkm-mgmnt-shrholder',
  templateUrl: './mgmnt-shrholder.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmMgmntShrholderComponent implements OnInit {
  @Input() isLockMode: boolean = false;
  // @Input() AppId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  @Output() OutputCancel: EventEmitter<any> = new EventEmitter();

  @Input() listLtkmCustCompanyManagementShareholderObj: Array<LtkmCustCompanyMgmntShrholderObj> = new Array<LtkmCustCompanyMgmntShrholderObj>();
  inputGridObj: InputGridObj = new InputGridObj();

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridShareholderCustCompletion.json";

    this.loadShareholderListData();
  }

  saveAndContinue() {
    this.OutputTab.emit({IsComplete: true});
  }

  loadShareholderListData() {
    this.inputGridObj.resultData = {
      Data: ""
    }
    this.inputGridObj.resultData["Data"] = new Array<LtkmCustCompanyMgmntShrholderObj>();
    this.inputGridObj.resultData.Data = this.listLtkmCustCompanyManagementShareholderObj;
  }
}

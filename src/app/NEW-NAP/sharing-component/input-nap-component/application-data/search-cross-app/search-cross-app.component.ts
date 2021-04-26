import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UCSearchComponent } from '@adins/ucsearch';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-search-cross-app',
  templateUrl: './search-cross-app.component.html'
})
export class SearchCrossAppComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Output() objTempOutput: EventEmitter<any> = new EventEmitter();
  @Input() ListCrossAppObjInput: any;
  constructor(
    private modalService: NgbModal,
  ) { }

  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  tempData = [];
  arrAddCrit;
  ngOnInit() {
    this.MakeAddToTempObj();
    this.tempData = new Array();
  }

  getListTemp(ev) {
    this.tempData = ev.TempListObj;
  }
  addCritAppId;
  MakeAddToTempObj() {
    this.arrAddCrit = new Array();
    this.addCritAppId = new CriteriaObj();
    this.addCritAppId.DataType = "numeric";
    this.addCritAppId.propName = "ap.APP_ID";
    this.addCritAppId.restriction = AdInsConstant.RestrictionNotIn;
    this.addCritAppId.listValue = [this.ListCrossAppObjInput["appId"]];
    this.arrAddCrit.push(this.addCritAppId);

    if (this.ListCrossAppObjInput["result"].length > 0) {
      var addCrit = new CriteriaObj();
      addCrit.DataType = "string";
      addCrit.propName = "ag.AGRMNT_NO";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListCrossAppObjInput["result"];
      this.arrAddCrit.push(addCrit);
    }

    var addCrit = new CriteriaObj();
    addCrit.DataType = "string";
    addCrit.propName = "ag.AGRMNT_STAT";
    addCrit.restriction = AdInsConstant.RestrictionNotIn;
    addCrit.listValue = [CommonConstant.AgrmntStatCancel, CommonConstant.AgrmntStatReject, CommonConstant.AgrmntStatPaid, CommonConstant.AgrmntStatExpired];
    this.arrAddCrit.push(addCrit);

    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/CrossAppTempPaging.json";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/CrossAppTempPaging.json";
    this.tempPagingObj.addCritInput = this.arrAddCrit;
    this.tempPagingObj.isReady = true;
  }

  SaveToTemp() {
    this.objTempOutput.emit(this.tempData);
    this.modalService.dismissAll();
  }
}

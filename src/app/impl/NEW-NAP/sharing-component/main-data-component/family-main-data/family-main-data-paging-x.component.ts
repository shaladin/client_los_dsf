import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { CustDataObj } from 'app/shared/model/cust-data-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
@Component({
  selector: 'app-family-main-data-paging-x',
  templateUrl: './family-main-data-paging-x.component.html',
  styleUrls: []
})
export class FamilyMainDataPagingXComponent implements OnInit {

  @Input() appId: number;
  @Input() isMarried: boolean = false;
  @Input() isEditNap1: boolean = false;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();  

  isDetail: boolean = false;
  inputGridObj: InputGridObj;
  listFamily: Array<any> = new Array();
  closeResult: string;
  appCustId: number;
  inputMode: string = "ADD";
  custDataObj: CustDataObj;
  custMainDataMode: string;
  critCust: Array<string> = new Array<string>();

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchFamilyMainData.json";

    this.custMainDataMode = CommonConstant.CustMainDataModeFamily;
    this.loadGuarantorListData();
  }

  add() {
    this.inputMode = "ADD";
    this.isDetail = true;
    this.appCustId = 0;
  }

  saveAndContinue() {
    if(this.isMarried){
      this.loadGuarantorListData();
      if(this.listFamily.length == 0 || this.listFamily.find(x=>x.MrCustRelationshipCode == 'SPOUSE') == null){
        this.toastr.warningMessage(ExceptionConstant.MUST_INPUT_SPOUSE_DATA)
        return;
      }
    }
    if(this.listFamily.find(x=>x.MrCustModelCode == null || x.MrCustModelCode == "") != null){
      this.toastr.warningMessage(ExceptionConstant.MUST_COMPLETE_FAMILY_DATA)
      return;
    }
    this.outputTab.emit();
  }

  
  close() {
    this.loadGuarantorListData();
    this.isDetail = false;
  }

  cancel() {
    this.outputCancel.emit();
  }

  event(ev) {
    if (ev.Key == "edit") {
      this.isDetail = true;
      this.inputMode="EDIT";
      this.appCustId = ev.RowObj.AppCustId;
      this.critCust = this.critCust.filter((value) => value != ev.RowObj.CustNo);
    }    
    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        this.http.post(URLConstant.DeleteAppCustMainData, { Id: ev.RowObj.AppCustId }).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.loadGuarantorListData();
          }
        );
      }
    }
  }

  loadGuarantorListData() {
    let reqByIdObj: GenericObj = new GenericObj();
    reqByIdObj.Id = this.appId;
    this.http.post(URLConstant.GetAppCustAndListFamilyByAppId, reqByIdObj).subscribe(
      (response: GenericListObj) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.listFamily = this.inputGridObj.resultData.Data;
        this.critCust = this.SetListCustNo(response.ReturnObject);
      }
    );
  }

  SetListCustNo(listCust: Array<any>): Array<string> {
    let tempListCustNo: Array<string> = new Array();
    let listCustNo: Array<string> = listCust.map(x => x.CustNo);
    for (let index = 0; index < listCustNo.length; index++) {
      const element: string = listCustNo[index];
      if (element) tempListCustNo.push(element);
    }
    return tempListCustNo;
  }
}

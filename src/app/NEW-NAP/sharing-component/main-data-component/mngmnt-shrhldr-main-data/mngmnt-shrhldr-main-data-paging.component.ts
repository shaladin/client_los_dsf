import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { ResListCustMainDataObj } from 'app/shared/model/Response/NAP/CustMainData/ResListCustMainDataObj.model';

@Component({
  selector: 'app-mngmnt-shrhldr-main-data-paging',
  templateUrl: './mngmnt-shrhldr-main-data-paging.component.html',
  styleUrls: []
})
export class MngmntShrhldrMainDataPagingComponent implements OnInit {

  @Input() appId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  isDetail: boolean = false;
  inputGridObj: InputGridObj;
  listMgmntShrholder: Array<any> = new Array();
  closeResult: string;
  appCustId: number;
  inputMode: string = "ADD";
  custDataObj: CustDataObj;
  custMainDataMode: string;

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridMgmntShrholderMainData.json";
    this.custMainDataMode = CommonConstant.CustMainDataModeMgmntShrholder;
    this.loadMgmntShrholderListData();
  }

  add() {
    this.inputMode = "ADD";
    this.isDetail = true;
    this.appCustId = null; 
  }

  CekRelationshipCode(){
    let flag: boolean = false;

    for (let index = 0; index < this.listMgmntShrholder.length; index++) {
      const element = this.listMgmntShrholder[index];
      if (element.IsExistingCust && element.MrCustRelationshipCode == "") {
        flag = true;
        this.toastr.warningMessage("Please input Cust Relationship for " + element.CustName);
      }
    }
    return flag;
  }

  async saveAndContinue() {
    await this.http.post(URLConstant.CheckAppCustShareholderMandatoryData, {AppId: this.appId}).toPromise().then(
      (response) => {
        if(response["StatusCode"] != 200){          
          this.toastr.warningMessage(response["Message"]);
          return;
        }
      }
    );

    if(this.CekRelationshipCode()) return;
    
    if(this.listMgmntShrholder.length == 0 || this.listMgmntShrholder.find(x=>x.IsOwner == true) == null){
      this.toastr.warningMessage(ExceptionConstant.MUST_INPUT_OWNER_DATA)
      return;
    }
    if(this.listMgmntShrholder.length == 0 || this.listMgmntShrholder.find(x=>x.IsActive == true && x.IsSigner == true && x.MrCustTypeCode == CommonConstant.CustTypePersonal) == null){
      this.toastr.warningMessage(ExceptionConstant.MUST_INPUT_ACTIVE_SIGNER);
      return false;
    }

    if(this.listMgmntShrholder.length > 0 && this.listMgmntShrholder.find(x=>x.MrCustModelCode == null || x.MrCustModelCode == "") != null){
      this.toastr.warningMessage(ExceptionConstant.COMPLETE_SHAREHOLDER_COMPANY_MODEL)
      return;
    }

    if(this.listMgmntShrholder.length > 0 && this.listMgmntShrholder.find(x=>x.MrCustRelationshipCode == null || x.MrCustRelationshipCode == "") != null){
      this.toastr.warningMessage(ExceptionConstant.MUST_COMPLETE_SHAREHOLDER_DATA)
      return;
    }

    var totalSharePrcnt = 0;

    for(let i = 0; i < this.listMgmntShrholder.length; i++){
      totalSharePrcnt += this.listMgmntShrholder[i].SharePrcnt;
    }

    if(totalSharePrcnt != 100){
      this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_MUST_100);
      return;
    }
    
    // this.outputTab.emit();
  }

  cancel() {
    this.outputCancel.emit();
  }

  event(ev) {
    if (ev.Key == "edit") {
      this.isDetail = true;
      this.inputMode="EDIT";
      this.appCustId = ev.RowObj.AppCustId;
    }

    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        this.http.post(URLConstant.DeleteAppCustMainData, { Id: ev.RowObj.AppCustId }).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.loadMgmntShrholderListData();
          }
        );
      }
    }
  }

  loadMgmntShrholderListData() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    this.custDataObj.IsShareholder = true;
    this.http.post(URLConstant.GetListAppCustMainDataByAppId, this.custDataObj).subscribe(
      (response : ResListCustMainDataObj) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response['ListAppCustObj'];
        this.listMgmntShrholder = this.inputGridObj.resultData.Data;
      }
    );
  }

  close() {
    this.loadMgmntShrholderListData();
    this.isDetail = false;
  }
}

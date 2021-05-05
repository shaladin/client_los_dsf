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
  selector: 'app-guarantor-main-data-paging',
  templateUrl: './guarantor-main-data-paging.component.html',
  styleUrls: []
})
export class GuarantorMainDataPagingComponent implements OnInit {

  @Input() appId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  isDetail: boolean = false;
  inputGridObj: InputGridObj;
  listGuarantor: Array<any> = new Array();
  resultData: Array<any> = new Array();
  closeResult: string;
  appCustId: number;
  inputMode: string = "ADD";
  custDataObj: CustDataObj;
  custMainDataMode: string;

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchGuarantorMainData.json";
    this.custMainDataMode = CommonConstant.CustMainDataModeGuarantor;
    this.loadGuarantorListData();
  }

  add() {
    this.inputMode = "ADD";
    this.isDetail = true;
    this.appCustId = null; 
  }

  saveAndContinue() {
    for (let i = 0; i < this.listGuarantor.length; i++) {
      for (let j = i+1; j < this.listGuarantor.length; j++) {
        if (this.listGuarantor[i]["CustName"] == this.listGuarantor[j]["CustName"] ) {
          this.toastr.warningMessage("Guarantor No " + (i+1) + ExceptionConstant.CANT_HAVE_THE_SAME_GUARANTOR_MEMBER + (j+1));
          return;
        }
      }
    }
    this.outputTab.emit();
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
            this.loadGuarantorListData();
          }
        );
      }
    }
  }

  loadGuarantorListData() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    this.custDataObj.IsGuarantor = true;
    this.http.post(URLConstant.GetListAppCustMainDataByAppId, this.custDataObj).subscribe(
      (response : ResListCustMainDataObj) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response['ListAppCustObj'];
        this.listGuarantor = this.inputGridObj.resultData.Data;
      }
    );
  }

  close() {
    this.loadGuarantorListData();
    this.isDetail = false;
  }

}

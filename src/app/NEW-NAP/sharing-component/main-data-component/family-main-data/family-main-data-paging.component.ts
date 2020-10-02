import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';

@Component({
  selector: 'app-family-main-data-paging',
  templateUrl: './family-main-data-paging.component.html',
  styleUrls: []
})
export class FamilyMainDataPagingComponent implements OnInit {

  @Input() appId: number;
  @Input() isMarried: boolean = false;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  inputGridObj: InputGridObj;
  result: Array<any> = new Array();
  resultData: Array<any> = new Array();
  closeResult: string;
  appCustId: number;
  inputMode: string;
  custDataObj: CustDataObj;
  custMainDataMode: string;

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchFamilyMainData.json";
    this.inputGridObj.deleteUrl = URLConstant.DeleteAppCustMainData;

    this.custMainDataMode = CommonConstant.CustMainDataModeFamily;
    this.loadGuarantorListData();
  }

  add(content) {
    this.inputMode = "ADD";
    this.open(content);
    this.appCustId = null;
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  saveAndContinue() {
    if(this.isMarried){
      this.loadGuarantorListData();
      if(this.result == undefined || this.result.find(x=>x.MrRelationshipCustCode == 'SPOUSE') == null){
        this.toastr.warningMessage("Please Input Spouse Data!")
        return;
      }
    }
    this.outputTab.emit();
  }

  cancel() {
    this.outputCancel.emit();
  }

  event(content, ev) {
    if (ev.Key == "edit") {
      this.inputMode="EDIT";
      this.appCustId = ev.RowObj.AppCustId;
      this.open(content);
    }
  }

  loadGuarantorListData() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    this.custDataObj.IsFamily = true;
    this.http.post(URLConstant.GetListAppCustMainDataByAppId, this.custDataObj).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.result = this.inputGridObj.resultData.Data;
      }
    );
  }

  close() {
    this.loadGuarantorListData();
    this.modalService.dismissAll();
  }
}

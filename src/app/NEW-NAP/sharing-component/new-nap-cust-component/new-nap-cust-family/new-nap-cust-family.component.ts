import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CustDataObj } from 'app/shared/model/cust-data-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ResListCustMainDataObj } from 'app/shared/model/response/nap/cust-main-data/res-list-cust-main-data-obj.model';
@Component({
  selector: 'app-new-nap-cust-family',
  templateUrl: './new-nap-cust-family.component.html',
  styleUrls: []
})
export class NewNapCustFamilyComponent implements OnInit {

  @Input() appId: number;
  @Input() isMainCustMarried: boolean = false;
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

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  async ngOnInit() : Promise<void> {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchFamilyMainData.json";

    this.custMainDataMode = CommonConstant.CustMainDataModeFamily;
    await this.loadGuarantorListData();
  }

  add() {
    this.inputMode = "ADD";
    this.isDetail = true;
    this.appCustId = 0;
  }

  async saveAndContinue() {
    await this.loadGuarantorListData();
    var spouse = this.listFamily.find(x => x.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse);
    if((this.listFamily.length == 0 || spouse == null) && this.isMainCustMarried){
      this.toastr.warningMessage(ExceptionConstant.MUST_INPUT_SPOUSE_DATA)
      return;
    }

    if(spouse != null && !this.isMainCustMarried){
      this.toastr.warningMessage(ExceptionConstant.CANT_HAVE_SPOUSE);
      return;    
    }
    
    this.outputTab.emit();
  }

  
  async close() {
    await this.loadGuarantorListData();
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
    }    
    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        this.http.post(URLConstant.DeleteAllAppCust, {AppCustId: ev.RowObj.AppCustId}).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.loadGuarantorListData();
          }
        );
      }
    }
  }

  async loadGuarantorListData() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    this.custDataObj.IsFamily = true;
    await this.http.post(URLConstant.GetListAppCustMainDataByAppId, this.custDataObj).toPromise().then(
      (response : ResListCustMainDataObj) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response['ListAppCustObj'];
        this.listFamily = this.inputGridObj.resultData.Data;
      }
    );
  }
}

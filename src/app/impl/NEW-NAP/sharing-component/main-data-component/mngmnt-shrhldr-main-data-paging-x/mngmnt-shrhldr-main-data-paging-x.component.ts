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
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';
import { ShareholderListingObj } from 'app/shared/model/AppCust/Shareholder/ShareholderListingObj.Model';

@Component({
  selector: 'app-mngmnt-shrhldr-main-data-paging-x',
  templateUrl: './mngmnt-shrhldr-main-data-paging-x.component.html'  
})
export class MngmntShrhldrMainDataPagingXComponent implements OnInit {

  @Input() appId: number;
  @Input() lobCode: string;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  isDetail: boolean = false;
  inputGridObj: InputGridObj;
  listMgmntShrholder: Array<ShareholderListingObj> = new Array();
  closeResult: string;
  appCustId: number;
  inputMode: string = "ADD";
  custDataObj: CustDataObj;
  custMainDataMode: string;

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  async ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridMgmntShrholderMainData.json";
    this.custMainDataMode = CommonConstant.CustMainDataModeMgmntShrholder;
    await this.loadMgmntShrholderListData();
  }

  add() {
    this.inputMode = "ADD";
    this.isDetail = true;
    this.appCustId = 0;
    this.MrCustTypeCode = CommonConstant.CustTypePersonal;
    this.AppCustCompanyMgmntShrholderId = 0;
  }

  CekRelationshipCode() {
    let flag: boolean = false;

    for (let index = 0; index < this.listMgmntShrholder.length; index++) {
      const element = this.listMgmntShrholder[index];
      if (element.IsExistingCust) {
        flag = true;
        this.toastr.warningMessage("Please input Cust Relationship for " + element.ShareholderName);
      }
    }
    return flag;
  }

  async saveAndContinue() {
    await this.http.post(URLConstant.CheckAppCustShareholderMandatoryData, { AppId: this.appId }).toPromise().then(
      (response) => {
        if (response["StatusCode"] != 200) {
          this.toastr.warningMessage(response["Message"]);
          return;
        }
      }
    );

    if (this.listMgmntShrholder.length == 0) {
      this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }
    if (!this.tempIsOwner) {
      this.toastr.warningMessage(ExceptionConstant.Add_Min_1_Owner);
      return;
    }
    if (!this.tempIsSigner) {
      this.toastr.warningMessage(ExceptionConstant.Add_Min_1_Active_Signer);
      return;
    }
    if (this.tempTotalSharePrct != 100) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_MUST_100);
      return;
    }

    this.outputTab.emit();
  }

  cancel() {
    this.outputCancel.emit();
  }

  AppCustCompanyMgmntShrholderId: number = 0;
  MrCustTypeCode: string = "";
  event(ev: { Key: string, RowObj: ShareholderListingObj }) {
    if (ev.Key == "edit") {
      this.isDetail = true;
      this.inputMode = "EDIT";
      this.appCustId = ev.RowObj.AppCustId;
      this.tempTotalSharePrct -= ev.RowObj.SharePrcnt;
      this.MrCustTypeCode = ev.RowObj.ShareholderType;
      this.AppCustCompanyMgmntShrholderId = ev.RowObj.AppCustCompanyMgmntShrholderId;
    }

    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        if (ev.RowObj.ShareholderType == CommonConstant.CustTypePublic) {
          this.http.post(URLConstant.DeleteAppCustCompanyMgmntShrholderPublic, { Id: ev.RowObj.AppCustCompanyMgmntShrholderId }).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.loadMgmntShrholderListData();
            }
          );
          return;
        }
        this.http.post(URLConstant.DeleteAppCustMainData, { Id: ev.RowObj.AppCustId }).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.loadMgmntShrholderListData();
          }
        );
      }
    }
  }

  ParentAppCustCompanyId: number = 0;
  tempTotalSharePrct: number = 0;
  tempIsOwner: boolean = false;
  tempIsSigner: boolean = false;
  listCustNoToExclude: Array<string> = new Array();
  async loadMgmntShrholderListData() {
    await this.http.post(URLConstant.GetAppCustCompanyMainDataByAppId, { Id: this.appId }).toPromise().then(
      (response: AppCustCompanyObj) => {
        this.ParentAppCustCompanyId = response.AppCustCompanyId;
        this.http.post(URLConstant.GetListManagementShareholderForListPagingByParentAppCustCompanyId, { Id: response.AppCustCompanyId }).subscribe(
          (response2: GenericListObj) => {
            this.inputGridObj.resultData = {
              Data: ""
            }
            let tempTotalSharePrct: number = 0;
            let tempIsOwner: boolean = false;
            let tempIsSigner: boolean = false;
            this.listCustNoToExclude = new Array();
            this.listMgmntShrholder = response2.ReturnObject;
            for (let index = 0; index < this.listMgmntShrholder.length; index++) {
              const element = this.listMgmntShrholder[index];
              if (element.IsActive) {
                tempTotalSharePrct += element.SharePrcnt;
              }
              if (element.IsOwner) {
                tempIsOwner = true;
              }
              if (element.IsActive && element.IsSigner) {
                tempIsSigner = true;
              }
              if (element.CustNo) {
                this.listCustNoToExclude.push(element.CustNo);
              }
            }
            this.tempTotalSharePrct = tempTotalSharePrct;
            this.tempIsOwner = tempIsOwner;
            this.tempIsSigner = tempIsSigner;
            this.inputGridObj.resultData["Data"] = new Array();
            this.inputGridObj.resultData.Data = response2.ReturnObject;
          }
        )
      }
    );
  }

  close() {
    this.loadMgmntShrholderListData();
    this.isDetail = false;
  }


}

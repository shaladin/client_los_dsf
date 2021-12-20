import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { ShareholderListingObj } from 'app/shared/model/app-cust/shareholder/shareholder-listing-obj.model';
import { CustDataObj } from 'app/shared/model/cust-data-obj.model';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';

@Component({
  selector: 'app-mngmnt-shrhldr-main-data-paging-x',
  templateUrl: './mngmnt-shrhldr-main-data-paging-x.component.html'  
})
export class MngmntShrhldrMainDataPagingXComponent implements OnInit {

  @Input() appId: number;
  @Input() isNonMandatory: boolean;
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
  critCustCompany: Array<string> = new Array<string>();
  critCust: Array<string> = new Array<string>();

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  async ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/impl/ucgridview/gridMgmntShrholderMainDataX.json";
    this.custMainDataMode = CommonConstant.CustMainDataModeMgmntShrholder;
    await this.loadMgmntShrholderListData();
    await this.getCustMainData();
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
    await this.http.post(URLConstantX.CheckAppCustShareholderMandatoryDataX, { AppId: this.appId }).toPromise().then(
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
      this.tempTotalSharePrct = Math.round((this.tempTotalSharePrct - ev.RowObj.SharePrcnt) * 1000000) / 1000000;
      this.MrCustTypeCode = ev.RowObj.ShareholderType;
      this.AppCustCompanyMgmntShrholderId = ev.RowObj.AppCustCompanyMgmntShrholderId;

      if(ev.RowObj.ShareholderType == CommonConstant.CustTypeCompany){
        this.critCustCompany = this.critCustCompany.filter((value) => value != ev.RowObj.CustNo);
      }

      if(ev.RowObj.ShareholderType == CommonConstant.CustTypePersonal){
        this.critCust = this.critCust.filter((value) => value != ev.RowObj.CustNo);
      }
      if(ev.RowObj.IsActive)
      {
        this.tempTotalSharePrct -= ev.RowObj.SharePrcnt;
      }
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
      async (response: AppCustCompanyObj) => {
        this.ParentAppCustCompanyId = response.AppCustCompanyId;
        await this.http.post(URLConstantX.GetListManagementShareholderForListPagingByParentAppCustCompanyId, { Id: response.AppCustCompanyId }).toPromise().then(
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
                tempTotalSharePrct = Math.round((tempTotalSharePrct + element.SharePrcnt) * 1000000) / 1000000;
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
            this.critCust = this.SetListCustNo(response2.ReturnObject, CommonConstant.CustTypePersonal);
            this.critCustCompany = this.SetListCustNo(response2.ReturnObject, CommonConstant.CustTypeCompany);
          }
        )
      }
    );
  }

  SetListCustNo(listCust: Array<any>, ShareholderType: string): Array<string> {
    let tempListCustNo: Array<string> = new Array();
    let listCustNo: Array<string> = listCust.filter(x => x.ShareholderType == ShareholderType).map(x => x.CustNo);
    for (let index = 0; index < listCustNo.length; index++) {
      const element: string = listCustNo[index];
      if (element) tempListCustNo.push(element);
    }
    return tempListCustNo;
  }

  async getCustMainData() {
    let reqByIdObj: GenericObj = new GenericObj();
    reqByIdObj.Id = this.appId;
    await this.http.post(URLConstant.GetAppCustMainDataByAppId, reqByIdObj).toPromise().then(
      (response: ResponseAppCustMainDataObj) => {
        if(response.AppCustObj.CustNo != null){
          this.critCustCompany.push(response.AppCustObj.CustNo);
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  async close() {
    await this.loadMgmntShrholderListData();
    await this.getCustMainData();
    this.isDetail = false;
  }
}

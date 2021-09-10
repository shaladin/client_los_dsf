import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustBankStmntObj } from 'app/shared/model/AppCustBankStmntObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { CookieService } from 'ngx-cookie';
import { AppCustBankAccObjX } from 'app/impl/shared/model/AppCustBankAccObjX.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CustBankAccDetailSectionFindataXComponent } from '../cust-bank-acc-detail-section-findata-x/cust-bank-acc-detail-section-findata-x.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bank-section-x',
  templateUrl: './bank-section-x.component.html',
  styleUrls: ['./bank-section-x.component.css']
})
export class BankSectionXComponent implements OnInit {

  @Input() AppCustId: number;
  @Input() AppCustBankAccList: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  @Output() OutputObj: EventEmitter<any> = new EventEmitter();
  type: string = "add";
  Title: string = "Add Bank Account"
  DefaultMonth: string;
  IsDetail: boolean = false;
  BankAccObj: AppCustBankAccObj = new AppCustBankAccObj();
  BankAccObjX: AppCustBankAccObjX = new AppCustBankAccObjX();
  BankStmntObj: AppCustBankStmntObj = new AppCustBankStmntObj();
  MonthObj: Array<KeyValueObj> = new Array();
  AppCustBankStmntList: Array<AppCustBankStmntObj> = new Array();
  ListBankStmntObj: Array<AppCustBankStmntObj> = new Array();
  RowAppCustBankStmnt: number;
  InputLookupBankObj: InputLookupObj = new InputLookupObj();

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService) { }


  ngOnInit() {
    this.GetAppCustBankAccList();
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMonth }).subscribe(
      (response) => {
        this.MonthObj = response[CommonConstant.ReturnObj];
        if (this.MonthObj.length > 0) {
          this.DefaultMonth = this.MonthObj[0].Value;
        }
      }
    );
  }

  GetAppCustBankAccList() {
    this.http.post<Array<AppCustBankAccObj>>(URLConstantX.GetAppCustBankAccAndStatementForView, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.AppCustBankAccList = response["AppCustBankAccList"]
      });
    this.OutputObj.emit({ Key: 'IsDetail', Value: false });
  }

  GetBank(event) {
    this.BankAccObj.BankCode = event.BankCode;
  }

  custBankHandler(type: string, BankAccAndStmntObjX: AppCustBankAccObjX) {
    if (type === 'delete') {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        this.spinner.show();
        let reqObj = {
          Id: BankAccAndStmntObjX.AppCustBankAccId
        };
        this.http.post(URLConstantX.DeleteAppCustBankAccAndStmnt, reqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.GetAppCustBankAccList();
          });
      }
      return;
    }
    const modalCustBank = this.modalService.open(CustBankAccDetailSectionFindataXComponent);
    modalCustBank.componentInstance.AppCustId = this.AppCustId;
    modalCustBank.componentInstance.pageType = type;
    modalCustBank.componentInstance.AppCustBankAccId = BankAccAndStmntObjX.AppCustBankAccId;
    modalCustBank.componentInstance.BankAccAndStmntObjX = BankAccAndStmntObjX;
    modalCustBank.componentInstance.isAddBankStatement = type == "editStmnt" ? true : false;
    switch (type) {
      case "add":
        modalCustBank.componentInstance.modalTitle = "Add New Customer Bank Account";
        break;

      case "editStmnt":
        modalCustBank.componentInstance.modalTitle = "Add New Customer Bank Statement";
        break;

      case "edit":
        modalCustBank.componentInstance.modalTitle = "Edit Customer Bank Account";
        break;

      default:
        break;
    }

    modalCustBank.result.then(
      (response) => {
        this.spinner.show();
        this.OutputObj.emit({ Key: 'IsDetail', Value: false });
        this.GetAppCustBankAccList();
        this.spinner.hide();
        if (response["StatusCode"] != 200) return;
        this.toastr.successMessage(response["message"]);

      }
    ).catch(
      (error) => {
        if (error != 0) {
          console.log(error);
        }
      }
    );
  }



}

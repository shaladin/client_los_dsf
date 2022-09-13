import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AppInvoiceFctrObj } from 'app/shared/model/app-invoice-fctr-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { environment } from 'environments/environment';
import { AppFctrObj } from 'app/shared/model/app-fctr/app-fctr.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-invoice-data',
  templateUrl: './invoice-data.component.html'
})
export class InvoiceDataComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  inputPagingObj: UcPagingObj;
  invoiceObj: AppInvoiceFctrObj;
  AppFactoringObj: AppFctrObj = new AppFctrObj();
  dataobj: any;
  MouCustLookupObj: InputLookupObj = new InputLookupObj();
  MouCustLookupObject: InputLookupObj = new InputLookupObj();
  InputLookupBankObj: InputLookupObj = new InputLookupObj();
  IsDisableCustFctr: boolean = true;
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  arrAddCrit;
  DisbInfoId: any;
  selectedBankCode: any;
  invoiceDuedtMax: Date = new Date;
  isDdlBankAccountVisible: boolean = false;
  isDdlCustNameVisible: boolean = false;
  disburseTos: any;
  BankAccs: any;
  AppCustId: any;
  DisbTo: any;
  CustNo: any;

  constructor(private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder) { }

  InvoiceForm = this.fb.group({
    AppFctrId: [''],
    CustomerFactoringNo: [''],
    CustomerFactoringName: [''],
    InvoiceNo: [''],
    InvoiceAmt: [''],
    InvoiceDueDt: [''],
    Notes: [''],
    RowVersion: [''],
    AccNo: ['', Validators.required],
    BankBranch: ['', Validators.required],
    AccName: ['', Validators.required],
    DisbTo: [''],
    CustName: [''],
    BankAccountNo: ['']
  })

  async ngOnInit() {
    this.InputLookupBankObj = new InputLookupObj();
    this.InputLookupBankObj.isReady = false;
    this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.isRequired = true;

    this.MouCustLookupObj.urlJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.urlEnviPaging = environment.losUrl + "/v1";
    this.MouCustLookupObj.pagingJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.genericJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.isRequired = false;

    this.MouCustLookupObject.urlJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObject.urlEnviPaging = environment.losUrl + "/v1";
    this.MouCustLookupObject.pagingJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObject.genericJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObject.isRequired = false;

    var object = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeDisbToFctr
    }
    await this.httpClient.post(URLConstant.GetListActiveRefMaster, object).toPromise().then(
      async (response) => {
        this.disburseTos = response["ReturnObject"];
        this.InvoiceForm.patchValue({
          DisbTo: this.disburseTos[0].MasterCode
        })
        await this.ChangeDisburseTo();
      });

    await this.httpClient.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.httpClient.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: response["MouCustId"] }).subscribe(
          (response2) => {
            if (response2[CommonConstant.ReturnObj]["length"] > 0) {
              this.IsDisableCustFctr = false;
            }
            else {
              this.IsDisableCustFctr = true;
            }
          }
        );
      }
    );

    var obj = {
      Id: this.AppId,
    }
    await this.httpClient.post<AppFctrObj>(URLConstant.GetAppFctrByAppId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.AppFactoringObj = response;
        this.GetListAppInvoiceFctr();
        this.arrAddCrit = new Array();
        var addCrit = new CriteriaObj();
        addCrit.DataType = "numeric";
        addCrit.propName = "A.APP_ID";
        addCrit.restriction = AdInsConstant.RestrictionIn;
        addCrit.listValue = [this.AppFactoringObj.AppId];
        this.arrAddCrit.push(addCrit);
        this.MouCustLookupObj.addCritInput = this.arrAddCrit;
        this.MouCustLookupObject.addCritInput = this.arrAddCrit;
        // this.MouCustLookupObj.isReady = true;
      });

    await this.httpClient.post(URLConstant.GetDisbInfoByAppId, obj).toPromise().then(
      async (response) => {
        if (response["DisbInfoId"] != 0) {
          console.log("Cek Response" + response);
          this.DisbInfoId = response["DisbInfoId"];
          this.InvoiceForm.patchValue({
            ...response
          });
          await this.ChangeDisburseTo();

          var objectBank = {
            Code: response["BankCode"]
          }
          await this.httpClient.post(URLConstant.GetRefBankByBankCodeAsync, objectBank).toPromise().then(
            (responseBank) => {
              this.InputLookupBankObj.jsonSelect = {
                BankCode: responseBank["BankCode"],
                BankName: responseBank["BankName"]
              };
              this.InputLookupBankObj.nameSelect = responseBank["BankName"];
              this.selectedBankCode = responseBank["BankCode"];
            });
          this.InvoiceForm.patchValue({
            ...response
          });
          this.InvoiceForm.patchValue({
            BankAccountNo : response["AccNo"]
          });
        }
        this.InputLookupBankObj.isReady = true;
      });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  GetListAppInvoiceFctr() {
    var obj = {
      Id: this.AppFactoringObj.AppFctrId,
    }
    this.httpClient.post(URLConstant.GetListAppInvoiceFctrByAppFctrId, obj).subscribe(
      (response) => {
        this.dataobj = response['ReturnObject'];
      }
    );
  }
  async ChangeDisburseTo() {
    console.log(this.InvoiceForm.controls.DisbTo.value);

    if (this.InvoiceForm.controls.DisbTo.value == CommonConstant.RefMasterMasterCodeCust) {
      this.isDdlCustNameVisible = false;
      this.isDdlBankAccountVisible = true;
      this.InvoiceForm.controls.BankAccountNo.setValidators([Validators.required]);
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.DisableDisbBank();
      var AppObj = {
        Id: this.AppId
      }
      await this.httpClient.post(URLConstant.GetAppCustByAppId, AppObj).toPromise().then(
        async (responseAppCust) => {
          var appCustObj = {
            Id: responseAppCust["AppCustId"]
          }
          this.AppCustId = responseAppCust["AppCustId"];
          await this.httpClient.post(URLConstant.GetListAppCustBankAccByAppCustId, appCustObj).toPromise().then(
            (response) => {
              this.BankAccs = response[CommonConstant.ReturnObj].AppCustBankAccObjs;
              if (this.BankAccs.length > 0) {
                this.InvoiceForm.patchValue({
                  BankAccountNo: this.BankAccs[0].BankAccNo
                });
                let event = {
                  target: {
                    value: this.BankAccs[0].BankAccNo
                  }
                }
                this.ChangeBankAcc(event);
              }
            }
          )
        }
      )
    }
    else if (this.InvoiceForm.controls.DisbTo.value == CommonConstant.RefMasterMasterCodeCustFctr) {
      this.InvoiceForm.controls.BankAccountNo.clearValidators();
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.isDdlCustNameVisible = true;
      this.isDdlBankAccountVisible = false;
      this.DisableDisbBank();
    }
    else if (this.InvoiceForm.controls.DisbTo.value == CommonConstant.RefMasterMasterCodeOth) {
      this.InvoiceForm.controls.BankAccountNo.clearValidators();
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.isDdlCustNameVisible = false;
      this.isDdlBankAccountVisible = false;
      this.EnableDisbBank();
    }
  }

  DisableDisbBank() {
    this.InvoiceForm.controls['BankBranch'].disable();
    this.InvoiceForm.controls['AccNo'].disable();
    this.InvoiceForm.controls['AccName'].disable();
    this.MouCustLookupObject.nameSelect = null;
    this.MouCustLookupObject.jsonSelect = {
      CustNo: null,
      CustName: null
    }

    this.selectedBankCode = "";
    this.InputLookupBankObj.isDisable = true;
    this.InputLookupBankObj.nameSelect = null;
    this.InputLookupBankObj.jsonSelect = {
      BankCode: null,
      BankName: null
    }
    this.InvoiceForm.patchValue({
      BankBranch: "",
      AccNo: "",
      AccName: ""
    });
  }

  EnableDisbBank() {
    this.InvoiceForm.controls['BankBranch'].enable();
    this.InvoiceForm.controls['AccNo'].enable();
    this.InvoiceForm.controls['AccName'].enable();
    this.selectedBankCode = "";

    this.MouCustLookupObject.nameSelect = null;
    this.MouCustLookupObject.jsonSelect = {
      CustNo: null,
      CustName: null
    }

    this.InputLookupBankObj.isDisable = false;
    this.InputLookupBankObj.nameSelect = null;
    this.InputLookupBankObj.jsonSelect = {
      BankCode: null,
      BankName: null
    }
    this.InvoiceForm.patchValue({
      BankBranch: "",
      AccNo: "",
      AccName: ""
    });
  }

  ChangeBankAcc(event) {
    console.log("event" + event.target.value);
    if (event.target.value != '') {
      if (this.InvoiceForm.controls["DisbTo"].value == CommonConstant.RefMasterMasterCodeCustFctr) {
        var objCust = {
          CustNo: this.CustNo
        }
        this.httpClient.post(URLConstant.GetCustByCustNo, objCust).subscribe(
          (responseCustObj) => {
            var object = {
              BankAccNo: event.target.value,
              CustId: responseCustObj["CustId"]
            }
            this.httpClient.post(URLConstant.GetCustBankAccByCustIdAndBankAccNo, object).subscribe(
              (response) => {
                var objBank = {
                  Code: response["ReturnObject"].BankCode
                }
                this.InvoiceForm.patchValue({
                  BankBranch: response["ReturnObject"].BankBranch,
                  AccNo: event.target.value,
                  AccName: response["ReturnObject"].BankAccName
                });

                this.httpClient.post(URLConstant.GetRefBankByBankCodeAsync, objBank).subscribe(
                  (responseBank) => {
                    this.selectedBankCode = responseBank["BankCode"];
                    this.InputLookupBankObj.nameSelect = responseBank["BankName"];
                    this.InputLookupBankObj.jsonSelect = {
                      BankCode: responseBank["BankCode"],
                      BankName: responseBank["BankName"]
                    }
                  }
                )
              }
            )
          }
        )
      }
      else {
        var obj = {
          BankAccNo: event.target.value,
          AppCustId: this.AppCustId
        }
        this.httpClient.post(URLConstant.GetAppCustBankAccByBankAccNoAndAppCustId, obj).subscribe(
          (response) => {
            var objBank = {
              Code: response["BankCode"]
            }
            this.InvoiceForm.patchValue({
              BankBranch: response["BankBranch"],
              AccNo: event.target.value,
              AccName: response["BankAccName"]
            });

            this.httpClient.post(URLConstant.GetRefBankByBankCodeAsync, objBank).subscribe(
              (responseBank) => {
                this.selectedBankCode = responseBank["BankCode"];
                this.InputLookupBankObj.nameSelect = responseBank["BankName"];
                this.InputLookupBankObj.jsonSelect = {
                  BankCode: responseBank["BankCode"],
                  BankName: responseBank["BankName"]
                }
              }
            )
          }
        )
      }
    }
  }

  ChangeCustName(event) {
    console.log("event" + event.target.value);
  }

  GetLookupMouCust(ev) {
    this.InvoiceForm.patchValue({
      CustomerFactoringNo: ev.CustNo,
      CustomerFactoringName: ev.CustName
    });
  }

  GetLookupMouCustListed(ev) {
    this.InvoiceForm.controls.BankAccountNo.setValidators([Validators.required]);
    this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
    this.isDdlBankAccountVisible = true;
    var appCustObj = {
      CustNo: ev.CustNo
    }
    this.CustNo = ev.CustNo;
    this.httpClient.post(URLConstant.GetListCustBankAccByCustNo, appCustObj).subscribe(
      (response) => {
        this.BankAccs = response["ReturnObject"];
        this.InvoiceForm.patchValue({
          BankAccountNo: this.BankAccs[0].key
        });
      }
    )
  }

  SaveDetail() {
    if (this.InvoiceForm.controls.InvoiceAmt.value == 0) {
      this.toastr.warningMessage(ExceptionConstant.INVOICE_AMOUNT_CANNOT_ZERO);
    }
    else if (this.InvoiceForm.controls.InvoiceAmt.value < 0) {
      this.toastr.warningMessage(ExceptionConstant.INVOICE_AMOUNT_CANNOT_LESS_THAN + "zero (0).");
    }
    else if (this.InvoiceForm.controls.InvoiceNo.value == "") {
      this.toastr.warningMessage(ExceptionConstant.INVOICE_NO_CANNOT_EMPTY);
    }
    else if (this.InvoiceForm.controls.InvoiceDueDt.value == "") {
      this.toastr.warningMessage(ExceptionConstant.INVOICE_DUE_DT_CANNOT_EMPTY);
    }
    else if (this.InvoiceForm.controls.CustomerFactoringName.value == "") {
      this.toastr.warningMessage(ExceptionConstant.CUST_FCTRING_CANNOT_EMPTY);
    }
    else {
      this.invoiceObj = new AppInvoiceFctrObj();
      this.invoiceObj.CustomerFactoringNo = this.InvoiceForm.controls.CustomerFactoringNo.value;
      this.invoiceObj.CustomerFactoringName = this.InvoiceForm.controls.CustomerFactoringName.value;
      this.invoiceObj.InvoiceNo = this.InvoiceForm.controls.InvoiceNo.value;
      this.invoiceObj.InvoiceAmt = this.InvoiceForm.controls.InvoiceAmt.value;
      this.invoiceObj.InvoiceDueDt = this.InvoiceForm.controls.InvoiceDueDt.value;
      this.invoiceObj.InvoiceStat = "NEW";
      this.invoiceObj.IsApproved = true;
      this.invoiceObj.Notes = this.InvoiceForm.controls.Notes.value;
      this.invoiceObj.AppFctrId = this.AppFactoringObj.AppFctrId;

      this.httpClient.post(URLConstant.AddAppInvoiceFctr, this.invoiceObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppInvoiceFctr();
        });
    }
  }

  DeleteInvoice(AppInvoiceFctrId: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {

      this.httpClient.post(URLConstant.DeleteAppInvoiceFctr, { Id: AppInvoiceFctrId }, AdInsConstant.SpinnerOptions).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppInvoiceFctr();
        }
      );
    }
  }

  GetBank(event) {
    this.selectedBankCode = event.BankCode;
  }

  SaveForm(enjiForm: NgForm) {
    console.log("saveform");
    if (this.dataobj.length == 0) {
      this.toastr.warningMessage("Please Add Invoice First");
    }
    if (enjiForm.value.LookupCustomerFactoringNameDisbTo != undefined) {
      if (enjiForm.value.LookupCustomerFactoringNameDisbTo.value == undefined && this.InvoiceForm.controls["DisbTo"].value == CommonConstant.RefMasterMasterCodeCustFctr) {
        this.toastr.warningMessage("Please select at least one customer name");
        return;
      }
    }

    if (this.dataobj["TotalInvoiceAmt"] <= 0) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_INVOICE);
    }
    else {
      //Cari Due dt terbesar
      for (let index = 0; index < this.dataobj["AppInvoiceFctrList"].length; index++) {
        if (this.invoiceDuedtMax < this.dataobj["AppInvoiceFctrList"][index].InvoiceDueDt) {
          this.invoiceDuedtMax = this.dataobj["AppInvoiceFctrList"][index].InvoiceDueDt;
        }
      }

      var appFctrObject = new AppFctrObj();
      appFctrObject.TotalInvcAmt = this.dataobj["TotalInvoiceAmt"];
      appFctrObject.InvcDt = this.invoiceDuedtMax;

      var ObjDisbInfo = {
        DisbInfoId: this.DisbInfoId,
        BankCode: this.selectedBankCode,
        AccName: this.InvoiceForm.controls.AccName.value,
        AccNo: this.InvoiceForm.controls.AccNo.value,
        BankBranch: this.InvoiceForm.controls.BankBranch.value,
        AppId: this.AppId,
        DisbTo: this.InvoiceForm.controls.DisbTo.value,
        AppFctrngObj: new AppFctrObj()
      }
      ObjDisbInfo.AppFctrngObj = appFctrObject;
      this.httpClient.post(URLConstant.AddEditDisbInfo, ObjDisbInfo).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        });
    }
  }
}
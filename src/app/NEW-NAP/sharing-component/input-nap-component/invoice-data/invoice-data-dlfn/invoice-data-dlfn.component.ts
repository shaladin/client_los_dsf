import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppDlrFncng } from 'app/shared/model/AppData/AppDlrFncng.Model';
import { AppFctrObj } from 'app/shared/model/AppFctr/AppFctr.model';
import { AppInvoiceDlrFncngHObj } from 'app/shared/model/AppInvoiceDlrFncngHObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { ResDuplicateDoubleFinancingObj } from 'app/shared/model/Lead/ResDuplicateDoubleFinancingObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { ReqAddAppInvoiceDlrFncngHObj } from 'app/shared/model/Request/AppInvoice/ReqAppInvoiceObj.model';
import { ResDisbInfo } from 'app/shared/model/Response/AppInvoice/ResAppInvoiceObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-invoice-data-dlfn',
  templateUrl: './invoice-data-dlfn.component.html',
})
export class InvoiceDataDlfnComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  inputPagingObj: UcPagingObj;
  AppDlrFinObj: AppFctrObj = new AppFctrObj();
  dataobj: any;
  CollateralNameLookupObj: InputLookupObj = new InputLookupObj();
  InputLookupBankObj: InputLookupObj = new InputLookupObj();
  negativeAssetCheckObj: NegativeAssetCheckObj = new NegativeAssetCheckObj();
  ResultDuplicateDoubleFinancing: ResDuplicateDoubleFinancingObj = new ResDuplicateDoubleFinancingObj();
  //IsDisableCustFctr: boolean = true;
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  arrAddCrit;
  AppDlrFncngId: number;
  AppInvoiceDlrFncngHId: number;
  dataDobj: any;

  EditAppInvoiceDlrFncngHId: any;
  selectedBankCode: any;
  DisbInfoId: any;
  AgrmntId: number;
  disburseTos: any;
  isDdlBankAccountVisible: boolean = false;
  BankAccs: any;
  AppCustId: number;
  CustNo:any;

  invoiceDuedtMax: Date;
  ToInvoiceDetail: boolean = false;
  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private modalService: NgbModal) {
  }

  InvoiceForm = this.fb.group({
    AppFctrId: [''],
    CustomerFactoringNo: [''],
    InvoiceNo: [''],
    InvoiceAmt: [''],
    InvoiceDueDt: [''],
    Notes: [''],
    RowVersion: [''],
    AccNo: ['', Validators.required],
    BankName: [''],
    CollateralPrice: [''],
    ChassisNo: [''],
    EngineNo: [''],
    AssetTypeCode: [''],
    FullAssetCode: [''],
    FullAssetName: [''],
    BankBranch: ['', Validators.required],
    AccName: ['', Validators.required],
    BankAccountNo:[''],
    DisburseTo: ['']
  })

  async ngOnInit() {
    this.CollateralNameLookupObj = new InputLookupObj();
    //this.CollateralNameLookupObj.isReady = false;
    this.CollateralNameLookupObj.urlJson = "./assets/uclookup/Asset/lookupAssetType.json";
    this.CollateralNameLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.CollateralNameLookupObj.pagingJson = "./assets/uclookup/Asset/lookupAssetType.json";
    this.CollateralNameLookupObj.genericJson = "./assets/uclookup/Asset/lookupAssetType.json";
    this.CollateralNameLookupObj.isReady = true;
    this.CollateralNameLookupObj.isRequired = false;

    this.CollateralNameLookupObj.ddlEnvironments = [
      {
        name: "ASSET_TYPE_CODE",
        environment: environment.FoundationR3Url
      },
    ];
    this.InputLookupBankObj = new InputLookupObj();
    this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";


    var obj = { Id: this.AppId, };
    await this.httpClient.post(URLConstant.GetAppDlrFinByAppId, obj).subscribe(
      (response) => {
        this.AppDlrFncngId = response["AppDlrFncngId"];
        this.GetListAppInvoiceH();
      });
    await this.httpClient.post<ResDisbInfo>(URLConstant.GetDisbInfoByAppId, obj).subscribe(
      (response) => {
        if (response != null) {
          this.DisbInfoId = response.DisbInfoId;

          var objectBank = {
            Code: response.BankCode
          }
          this.httpClient.post(URLConstant.GetRefBankByBankCodeAsync, objectBank).subscribe(
            (responseBank) => {
              this.InputLookupBankObj.jsonSelect = {
                bankCode: responseBank["BankCode"],
                bankName: responseBank["BankName"]
              };
              this.InputLookupBankObj.nameSelect = responseBank["BankName"];
              this.selectedBankCode = responseBank["BankCode"];
            });
        }
        this.InputLookupBankObj.isReady = true;

        this.InvoiceForm.patchValue({
          ...response["ReturnObject"].DisbInfo
        });
      });
    let objectReq : ReqRefMasterByTypeCodeAndMappingCodeObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    objectReq.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDisbToDlrFncng
    
    await this.httpClient.post(URLConstant.GetListActiveRefMaster, objectReq).subscribe(
      (response) => {
        this.disburseTos = response[CommonConstant.ReturnObj];
        this.InvoiceForm.patchValue({
          DisburseTo: this.disburseTos[0].key
        })
      })
  }

  ChangeDisburseTo(event) {
    console.log("event" + event.target.value);

    if (event.target.value == CommonConstant.RefMasterMasterCodeCust) {
      this.isDdlBankAccountVisible = true;
      this.InvoiceForm.controls.BankAccountNo.setValidators([Validators.required]);
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.DisableDisbBank();
      var AppObj = {
        Id: this.AppId
      }
      this.httpClient.post(URLConstant.GetAppCustByAppId, AppObj).subscribe(
        (responseAppCust) => {
          var reqAppCustObj = {
            Id: responseAppCust["AppCustId"]
          }
          this.AppCustId = responseAppCust["AppCustId"];
          this.httpClient.post(URLConstant.GetListAppCustBankAccByAppCustId, reqAppCustObj).subscribe(
            (response) => {
              this.BankAccs = response[CommonConstant.ReturnObj].AppCustBankAccObjs;
              this.InvoiceForm.patchValue({
                BankAccountNo: this.BankAccs[0].key
              });
            }
          )
        }
      )
    }
    else if (event.target.value == CommonConstant.RefMasterMasterCodeVendor) {
      this.isDdlBankAccountVisible = true;
      this.InvoiceForm.controls.BankAccountNo.setValidators([Validators.required]);
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.DisableDisbBank();
      var reqGetMouCustAppObj = {
        Id: this.AppId
      }
      this.httpClient.post(URLConstant.GetMouCustDlrFncngByAppId, reqGetMouCustAppObj).subscribe(
        (responseMouCustDlrFncng) => {
          var custObj = {
            CustNo: responseMouCustDlrFncng["DealerCustNo"]
          }
          this.CustNo = responseMouCustDlrFncng["DealerCustNo"];
          this.httpClient.post(URLConstant.GetListCustBankAccByCustNo, custObj).subscribe(
            (response) => {
              this.BankAccs = response["ReturnObject"];
              this.InvoiceForm.patchValue({
                BankAccountNo: this.BankAccs[0].key
              });
            }
          )
        }
      )
    }
    else if (event.target.value == CommonConstant.RefMasterMasterCodeManufacturer) {
      this.isDdlBankAccountVisible = true;
      this.InvoiceForm.controls.BankAccountNo.setValidators([Validators.required]);
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.DisableDisbBank();
      var reqGetMouObj = {
        Id: this.AppId
      }
      this.httpClient.post(URLConstant.GetMouCustDlrFncngByAppId, reqGetMouObj).subscribe(
        (responseMouCustDlrFncng) => {
          var custObj = {
            CustNo: responseMouCustDlrFncng["ManufacturerCustNo"]
          }
           this.CustNo = responseMouCustDlrFncng["ManufacturerCustNo"];
          this.httpClient.post(URLConstant.GetListCustBankAccByCustNo, custObj).subscribe(
            (response) => {
              this.BankAccs = response["ReturnObject"];
              this.InvoiceForm.patchValue({
                BankAccountNo: this.BankAccs[0].key
              });
            }
          )
        }
      )
    }
    else if (event.target.value == CommonConstant.RefMasterMasterCodeOth) {
      this.InvoiceForm.controls.BankAccountNo.clearValidators();
      this.InvoiceForm.controls.BankAccountNo.updateValueAndValidity();
      this.isDdlBankAccountVisible = false;
      this.EnableDisbBank();
    }
  }

  ChangeBankAcc(event) {
    console.log("event" + event.target.value);
    if (event.target.value != '') {
      if (this.InvoiceForm.controls["DisburseTo"].value == CommonConstant.RefMasterMasterCodeVendor ||
      this.InvoiceForm.controls["DisburseTo"].value == CommonConstant.RefMasterMasterCodeManufacturer) {
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
                      bankCode: responseBank["BankCode"],
                      bankName: responseBank["BankName"]
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
                  bankCode: responseBank["BankCode"],
                  bankName: responseBank["BankName"]
                }
              }
            )
          }
        )
      }
    }
  }

  DisableDisbBank() {
    this.InvoiceForm.controls['BankBranch'].disable();
    this.InvoiceForm.controls['AccNo'].disable();
    this.InvoiceForm.controls['AccName'].disable();

    this.selectedBankCode = "";
    this.InputLookupBankObj.isDisable = true;
    this.InputLookupBankObj.nameSelect = null;
    this.InputLookupBankObj.jsonSelect = {
      bankCode: null,
      bankName: null
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

    this.InputLookupBankObj.isDisable = false;
    this.InputLookupBankObj.nameSelect = null;
    this.InputLookupBankObj.jsonSelect = {
      bankCode: null,
      bankName: null
    }
    this.InvoiceForm.patchValue({
      BankBranch: "",
      AccNo: "",
      AccName: ""
    });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  GetListAppInvoiceH() {
    var obj = {
      Id: this.AppDlrFncngId,
    }
    this.httpClient.post(URLConstant.AppInvoiceDlrFncngHByAppDlrFncngId, obj).subscribe(
      (response) => {
        this.dataobj = response[CommonConstant.ReturnObj];
      });
  }

  GetCollateralName(ev) {
    this.InvoiceForm.patchValue({
      AssetTypeCode: ev.AssetTypeCode,
      FullAssetCode: ev.FullAssetCode,
      FullAssetName: ev.FullAssetName
    });
  }

  SaveForm(enjiForm: NgForm) {
    console.log("DEBUG FE")
    if (this.dataobj["TotalInvoiceAmt"] <= 0) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_INVOICE);
    }
    else {

      var reqCekDivInvoiceAppObj = {
        Id: this.AppId
      }
      //Cari Due dt terbesar
      this.invoiceDuedtMax = this.dataobj["AppInvoiceList"][0].InvoiceDueDt;
      for (let index = 0; index < this.dataobj["AppInvoiceList"].length; index++) {
        if (this.invoiceDuedtMax < this.dataobj["AppInvoiceList"][index].InvoiceDueDt) {
          this.invoiceDuedtMax = this.dataobj["AppInvoiceList"][index].InvoiceDueDt;
        }
      }

      var appDlrFncngObject = new AppDlrFncng();
      appDlrFncngObject.TotalInvcAmt = this.dataobj["TotalInvoiceAmt"];
      appDlrFncngObject.InvcDt = this.invoiceDuedtMax;

      var ObjDisbInfo = {
        DisbInfoId: this.DisbInfoId,
        BankCode: this.selectedBankCode,
        AccName: this.InvoiceForm.controls.AccName.value,
        AccNo: this.InvoiceForm.controls.AccNo.value,
        BankBranch: this.InvoiceForm.controls.BankBranch.value,
        AppId: this.AppId,
        AppDlrFncngObj: new AppDlrFncng()
      }
      ObjDisbInfo.AppDlrFncngObj = appDlrFncngObject;

      this.httpClient.post(URLConstant.CekDifInvoiceAmountByAppId, reqCekDivInvoiceAppObj).subscribe(
        (responses) => {
          if (responses["ReturnObject"] != 0) {
            this.toastr.warningMessage(ExceptionConstant.COLL_VALUE_MUST_EQUALS_INVOICE_AMT);
            return;
          } else {
            this.httpClient.post(URLConstant.AddEditDisbInfo, ObjDisbInfo).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.outputTab.emit();
              });
          }
        });
    }
  }

  DeleteInvoice(AppInvoiceDlrFncngHId: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      let invoiceObjDEL : GenericObj = new GenericObj();
      invoiceObjDEL.Id = AppInvoiceDlrFncngHId;

      this.httpClient.post(URLConstant.DeleteAppInvoiceDlrFncngHById, invoiceObjDEL).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppInvoiceH();
        });
    }
  }

  GetBank(event) {
    this.selectedBankCode = event.bankCode;
  }

  BackToHeader() {
    this.ToInvoiceDetail = false;
    this.CLearCollateralForm();
  }

  CLearInvoiceForm() {
    this.InvoiceForm.controls.InvoiceAmt.patchValue(0);
    this.InvoiceForm.controls.InvoiceDueDt.patchValue("");
    this.InvoiceForm.controls.InvoiceNo.patchValue("");
  }

  AddHeader() {
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
    else {
      let invoiceObj : ReqAddAppInvoiceDlrFncngHObj = new ReqAddAppInvoiceDlrFncngHObj();
      invoiceObj.InvoiceNo = this.InvoiceForm.controls.InvoiceNo.value;
      invoiceObj.InvoiceAmt = this.InvoiceForm.controls.InvoiceAmt.value;
      invoiceObj.InvoiceDueDt = this.InvoiceForm.controls.InvoiceDueDt.value;
      invoiceObj.InvoiceStat = "NEW";
      invoiceObj.IsApproved = false;
      invoiceObj.Notes = this.InvoiceForm.controls.Notes.value;
      invoiceObj.AppDlrFncngId = this.AppDlrFncngId;

      this.httpClient.post(URLConstant.AddAppInvoiceDlrFncngH, invoiceObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppInvoiceH();
          this.CLearInvoiceForm();
        });
    }
  }

  SaveDetail() {
    if (this.InvoiceForm.controls.FullAssetName.value == "") {
      this.toastr.warningMessage(ExceptionConstant.INVOICE_D_CORATERAL_CANNOT_EMPTY);
      return;
    }
    else if (this.InvoiceForm.controls.CollateralPrice.value < 0 || this.InvoiceForm.controls.CollateralPrice.value == "") {
      this.toastr.warningMessage(ExceptionConstant.CORATERAL_AMOUNT_CANNOT_LESS_THAN + "zero (0).");
      return;
    }

    this.negativeAssetCheckObj.AssetTypeCode = this.InvoiceForm.controls.AssetTypeCode.value;
    this.negativeAssetCheckObj.SerialNo1 = this.InvoiceForm.controls.ChassisNo.value;
    this.negativeAssetCheckObj.SerialNo2 = this.InvoiceForm.controls.EngineNo.value;

    this.httpClient.post(URLConstant.GetDoubleFinancingCheckAppAsset, this.negativeAssetCheckObj).subscribe(
      (response) => {
        this.ResultDuplicateDoubleFinancing = response[CommonConstant.ReturnObj];

        if (this.ResultDuplicateDoubleFinancing["length"] > 0) {
          this.toastr.errorMessage(ExceptionConstant.DOUBLE_FINANCING);
        }
        else {
          var obj = {
            AppInvoiceDlrFncngHId: this.AppInvoiceDlrFncngHId,
            FullAssetName: this.InvoiceForm.controls.FullAssetName.value,
            SerialNo1: this.InvoiceForm.controls.ChassisNo.value,
            SerialNo2: this.InvoiceForm.controls.EngineNo.value,
            CollateralPriceAmt: this.InvoiceForm.controls.CollateralPrice.value
          }

          this.httpClient.post(URLConstant.AddAppInvoiceDlrFncngD, obj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.GetListAppInvoiceD();
              this.CLearCollateralForm();
            });
        }
      })
  }

  CLearCollateralForm() {
    this.InvoiceForm.controls.CollateralPrice.patchValue(0);
    this.InvoiceForm.controls.ChassisNo.patchValue("");
    this.InvoiceForm.controls.EngineNo.patchValue("");

    this.CollateralNameLookupObj.nameSelect = "";
    this.CollateralNameLookupObj.jsonSelect = { FullAssetName: "" };
  }

  AddAssetDetail(AppInvoiceDlrFncngHId) {
    this.ToInvoiceDetail = true;
    this.AppInvoiceDlrFncngHId = AppInvoiceDlrFncngHId;
    this.GetListAppInvoiceD();
  }

  GetListAppInvoiceD() {
    var obj = {
      Id: this.AppInvoiceDlrFncngHId
    }
    this.httpClient.post(URLConstant.GetListAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId, obj).subscribe(
      (response) => {
        this.dataDobj = response[CommonConstant.ReturnObj];
      });
  }

  DeleteDetailInvoice(AppInvoiceDlrFncngDId: number) {

    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var obj = {
        Id: AppInvoiceDlrFncngDId
      }
      console.log(obj);
      this.httpClient.post(URLConstant.DeleteAppInvoiceDlrFncngDById, obj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppInvoiceD();
        });
    }
  }

  EditInvoice(AppInvoiceDlrFncngHId, contentEditInvoice) {
    this.EditAppInvoiceDlrFncngHId = AppInvoiceDlrFncngHId;
    this.Open(contentEditInvoice);
  }

  closeResult;
  Open(contentEditInvoice) {
    this.modalService.open(contentEditInvoice).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  GetDataTemp(ev) {
    this.GetListAppInvoiceH();
  }

}

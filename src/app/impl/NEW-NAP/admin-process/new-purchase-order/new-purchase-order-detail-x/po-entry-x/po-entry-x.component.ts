import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { forkJoin } from 'rxjs';
import { AppLoanPurposeObj } from 'app/shared/model/AppLoanPurpose.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';
import { PurchaseOrderHObj } from 'app/shared/model/PurchaseOrderHObj.Model';
import { PurchaseOrderDObj } from 'app/shared/model/PurchaseOrderDObj.Model';
import { DatePipe, formatDate } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ReqAssetDataObj } from 'app/shared/model/Request/AppAsset/ReqAppAssetObj.model';
import { ResGetAllAssetDataForPOByAsset, ResGetAllAssetDataForPOByAssetObj } from 'app/shared/model/Response/PurchaseOrder/ResGetAllAssetDataForPO.model';

@Component({
  selector: 'app-po-entry-x',
  templateUrl: './po-entry-x.component.html'
})
export class PoEntryXComponent implements OnInit {
  @Input() SupplCode: string;
  @Input() PurchaseOrderHId: number;
  @Input() AppId: number;
  @Input() AgrmntId: number;
  @Input() MouNo: string;
  @Input() IsDisburseToCust: boolean;
  AppCust: AppCustObj;
  PODetailForm: FormGroup;
  AppLoanPurposeList: Array<AppLoanPurposeObj>;
  VendorBankAcc: VendorBankAccObj;
  CustBankAcc: AppCustBankAccObj;
  PurchaseOrderH: PurchaseOrderHObj;
  BusinessDt: Date;
  UserContext : CurrentUserContext;
  vendorBankAccList: Array<Object>;
  custBankAccList: Array<Object>;
  AssetObj: ResGetAllAssetDataForPOByAsset = new ResGetAllAssetDataForPOByAsset();
  isDataExist: boolean = false;

  ProportionalValue: number;
  TotalInsCustAmt: number;
  TotalLifeInsCustAmt: number;
  TotalPurchaseOrderAmt: number;
  DiffRateAmt : number;
  Notes: string = "";
  purchaseOrderHObj: PurchaseOrderHObj;

  Date: Date;
  ExpirationDate: string;
  arrValue = [];

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder, private toastr: NGXToastrService,
    public activeModal: NgbActiveModal, private cookieService: CookieService
  ) {
    this.AppLoanPurposeList = new Array<AppLoanPurposeObj>();
    this.VendorBankAcc = new VendorBankAccObj();
    this.CustBankAcc = new AppCustBankAccObj();
    this.PurchaseOrderH = new PurchaseOrderHObj();
    this.AppCust = new AppCustObj();
    this.BusinessDt = new Date();
    this.Date = new Date();
    this.PODetailForm = this.fb.group({
      SupplName: [''],
      BankAccNo: [''],
      TotalDisburse: [0],
      Notes: ['',[Validators.required]],
      PurchaseOrderExpiredDt: ['', [Validators.required]],
      RowVersion: ['']
    });
  }

  async ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    var datePipe = new DatePipe("en-US");
    this.UserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = new Date(this.UserContext[CommonConstant.BUSINESS_DT]);
    var MrFistInstTypeCode : string = "";
    await this.httpClient.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        MrFistInstTypeCode = response["MrFirstInstTypeCode"];
      }
    );

    if (this.IsDisburseToCust) {
      
      await this.httpClient.post(URLConstant.GetAppCustByAppId, { Id: this.AppId }).subscribe(
        (response : AppCustObj) => {
          this.AppCust = response;
          if (!this.PurchaseOrderHId || this.PurchaseOrderHId == 0) {
            let reqAppLoanPurposeObj : GenericObj = new GenericObj();
            reqAppLoanPurposeObj.Id = this.AppId;
            reqAppLoanPurposeObj.Code = this.SupplCode;
            let reqAppLoanPurposeObjForPOByLoan : GenericObj = new GenericObj();
            reqAppLoanPurposeObjForPOByLoan.Id = this.AgrmntId;
            reqAppLoanPurposeObjForPOByLoan.Code = this.SupplCode;
            let getAppLoanPurpose = this.httpClient.post(URLConstant.GetAppLoanPurposeByAppIdSupplCode, reqAppLoanPurposeObj).toPromise();
            let getAppLoanPurposeForPOByLoan = this.httpClient.post(URLConstantX.GetAppLoanPurposeForPOByLoan, reqAppLoanPurposeObjForPOByLoan).toPromise();
            let getListBankAcc = this.httpClient.post(URLConstant.GetListAppCustBankAccByAppCustId, { Id: this.AppCust.AppCustId }).toPromise();
            forkJoin([getAppLoanPurpose, getListBankAcc, getAppLoanPurposeForPOByLoan]).toPromise().then(
              (response) => {
                this.AppLoanPurposeList = response[0]["listResponseAppLoanPurpose"] as Array<AppLoanPurposeObj>;

                this.AssetObj = response[2]["ReturnObject"];
                this.ProportionalValue = this.AssetObj.ProportionalValue;
                this.TotalInsCustAmt = this.AssetObj.TotalInsCustAmt;
                this.TotalLifeInsCustAmt = this.AssetObj.TotalLifeInsCustAmt;
                this.TotalPurchaseOrderAmt = this.AssetObj.TotalPurchaseOrderAmt;
                this.DiffRateAmt = this.AssetObj.DiffRateAmt;

                this.custBankAccList = response[1]["ReturnObject"]['AppCustBankAccObjs'];
                this.custBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
                var isDefaultFound = false;
                var totalDisburse = 0;
                for (const item of this.custBankAccList) {
                  if (item["IsDefault"]) {
                    this.CustBankAcc = item as AppCustBankAccObj;
                    isDefaultFound = true;
                    break;
                  }
                }
                if (isDefaultFound) {
                  this.CustBankAcc = this.custBankAccList[0] as AppCustBankAccObj;
                }

                totalDisburse = this.AssetObj.TotalPurchaseOrderAmt;

                this.PODetailForm.patchValue({
                  SupplName: this.AppCust.CustName,
                  BankAccNo: this.CustBankAcc.BankAccNo,
                  TotalDisburse: totalDisburse
                });
              }
            ).catch(
              (error) => {
                console.log(error);
              }
            );
          }
          else {
            let getPurchaseOrderHId = this.httpClient.post(URLConstant.GetPurchaseOrderByPurchaseOrderHIdForNewPO, { Id: this.PurchaseOrderHId }).toPromise();
            let getListBankAcc = this.httpClient.post(URLConstant.GetListAppCustBankAccByAppCustId, { Id: this.AppCust.AppCustId }).toPromise();
            forkJoin([getPurchaseOrderHId, getListBankAcc]).toPromise().then(
              (response) => {
                this.custBankAccList = response[1]["ReturnObject"]['AppCustBankAccObjs'];
                this.PurchaseOrderH = response[0] as PurchaseOrderHObj;
                this.custBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
                for (const item of this.custBankAccList) {
                  if (item["BankAccNo"] == this.PurchaseOrderH.BankAccNo) {
                    this.CustBankAcc = item as AppCustBankAccObj;
                    break;
                  }
                }
                this.PODetailForm.patchValue({
                  SupplName: this.AppCust.CustName,
                  BankAccNo: this.CustBankAcc.BankAccNo,
                  TotalDisburse: this.PurchaseOrderH.TotalPurchaseOrderAmt,
                  Notes: this.PurchaseOrderH.Notes,
                  PurchaseOrderExpiredDt: datePipe.transform(this.PurchaseOrderH.PurchaseOrderExpiredDt, "yyyy-MM-dd"),
                  RowVersion: this.PurchaseOrderH.RowVersion
                });
              }
            ).catch(
              (error) => {
                console.log(error);
              }
            );
      
          }
        }
      );
    } else {
      if (!this.PurchaseOrderHId || this.PurchaseOrderHId == 0) {
        let reqAppLoanPurposeObj : GenericObj = new GenericObj();
        reqAppLoanPurposeObj.Id = this.AppId;
        reqAppLoanPurposeObj.Code = this.SupplCode;
        let reqAppLoanPurposeObjForPOByLoan : GenericObj = new GenericObj();
        reqAppLoanPurposeObjForPOByLoan.Id = this.AgrmntId;
        reqAppLoanPurposeObjForPOByLoan.Code = this.SupplCode;
        let getAppLoanPurpose = this.httpClient.post(URLConstant.GetAppLoanPurposeByAppIdSupplCode, reqAppLoanPurposeObj).toPromise();
        let getAppLoanPurposeForPOByLoan = this.httpClient.post(URLConstantX.GetAppLoanPurposeForPOByLoan, reqAppLoanPurposeObjForPOByLoan).toPromise();
        let getListBankAcc = this.httpClient.post(URLConstant.GetListVendorBankAccByVendorCode, { Code: this.SupplCode }).toPromise();
        forkJoin([getAppLoanPurpose, getListBankAcc, getAppLoanPurposeForPOByLoan]).toPromise().then(
          (response) => {
            this.AppLoanPurposeList = response[0]["listResponseAppLoanPurpose"] as Array<AppLoanPurposeObj>;
            
            this.AssetObj = response[2]["ReturnObject"];

            this.vendorBankAccList = response[1]["ReturnObject"];
            this.vendorBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
            console.log("vendorBankAccList: " + JSON.stringify(this.vendorBankAccList));
            var isDefaultFound = false;
            var totalDisburse = 0;
            for (const item of this.vendorBankAccList) {
              if (item["IsDefault"]) {
                this.VendorBankAcc = item as VendorBankAccObj;
                isDefaultFound = true;
                break;
              }
            }
            if (isDefaultFound) {
              this.VendorBankAcc = this.vendorBankAccList[0] as VendorBankAccObj;
            }

            totalDisburse = this.AssetObj.TotalPurchaseOrderAmt;

            this.PODetailForm.patchValue({
              SupplName: this.AppLoanPurposeList[0].SupplName,
              BankAccNo: this.VendorBankAcc.BankAccountNo,
              TotalDisburse: totalDisburse
            });
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
      }
      else {
        let getPurchaseOrderHId = this.httpClient.post(URLConstant.GetPurchaseOrderByPurchaseOrderHIdForNewPO, { Id: this.PurchaseOrderHId }).toPromise();
        let getListBankAcc = this.httpClient.post(URLConstant.GetListVendorBankAccByVendorCode, { Code: this.SupplCode }).toPromise();
        forkJoin([getPurchaseOrderHId, getListBankAcc]).toPromise().then(
          (response) => {
            this.vendorBankAccList = response[1]["ReturnObject"];
            this.PurchaseOrderH = response[0] as PurchaseOrderHObj;
            this.vendorBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
            for (const item of this.vendorBankAccList) {
              if (item["BankAccountNo"] == this.PurchaseOrderH.BankAccNo) {
                this.VendorBankAcc = item as VendorBankAccObj;
                break;
              }
            }
            this.PODetailForm.patchValue({
              SupplName: this.PurchaseOrderH.SupplName,
              BankAccNo: this.VendorBankAcc.BankAccountNo,
              TotalDisburse: this.PurchaseOrderH.TotalPurchaseOrderAmt,
              Notes: this.PurchaseOrderH.Notes,
              PurchaseOrderExpiredDt: datePipe.transform(this.PurchaseOrderH.PurchaseOrderExpiredDt, "yyyy-MM-dd"),
              RowVersion: this.PurchaseOrderH.RowVersion
            });
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
  
      }
    }
    this.httpClient.post(URLConstant.GetPurchaseOrderExpDt, { Id: this.AppId }).subscribe(
      (response1) => {
        this.ExpirationDate = formatDate(response1["PurchaseOrderExpDt"], 'yyyy-MM-dd', 'en-US');
        this.PODetailForm.patchValue({
          PurchaseOrderExpiredDt: datePipe.transform(response1["PurchaseOrderExpDt"], "yyyy-MM-dd")
        });

      }
    )
    // this.httpClient.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
    //   (response1: NapAppModel) => {
    //     let GetProduct = new GenericObj();
    //     GetProduct.Code = response1["ProdOfferingCode"]
    //     this.httpClient.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).toPromise().then(
    //       (response2) => {
    //         this.httpClient.post(URLConstant.GetProdOfferingDByProdOfferingHIdAndCompCode, { ProdOfferingHId: response2.Id, RefProdCompntCode: CommonConstant.RefProdCompntCodeCrApvResExpDays }).subscribe(
    //           (response) => {
    //             var a = formatDate(response1["ApvDt"], 'yyyy-MM-dd', 'en-US');
    //             this.Date = new Date(a);
    //             this.Date.setDate(this.Date.getDate() + parseInt(response["CompntValue"]));

    //             this.ExpirationDate = formatDate(this.Date, 'yyyy-MM-dd', 'en-US');
    //             this.PODetailForm.patchValue({
    //               PurchaseOrderExpiredDt: datePipe.transform(this.Date, "yyyy-MM-dd")
    //             });
    //           },
    //           (error) => {
    //             console.log(error);
    //           }
    //         );
    //       }
    //     ).catch(
    //     );
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  BankAccHandler() {
    var value = this.PODetailForm.controls["BankAccNo"].value;

    if (this.IsDisburseToCust) {
      for (const item of this.custBankAccList) {
        if (item["BankAccNo"] == value) {
          this.CustBankAcc;
          break;
        }
      }
    } else {
      for (const item of this.vendorBankAccList) {
        if (item["BankAccountNo"] == value) {
          this.VendorBankAcc = item as VendorBankAccObj;
          break;
        }
      }
    }
    
    this.httpClient.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response1) => {
        let GetProduct = new GenericObj();
        GetProduct.Code  = response1["ProdOfferingCode"]
        this.httpClient.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).toPromise().then(
          (response2) => {
            var datePipe = new DatePipe("locale");
            this.httpClient.post(URLConstant.GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode, { ProdOfferingHId: response2.Id, GroupCodes: ["OTHR"] }).subscribe(
              (response) => {
                var a = formatDate(response1["ApvDt"], 'yyyy-MM-dd', 'en-US');
                this.Date = new Date(a);
                let date = response["ReturnObject"]["ProdOffComponents"][0]["Components"].find(x => x.RefProdCompntCode == CommonConstant.RefProdCompntCodeCrApvResExpDays);
                this.Date.setDate(this.Date.getDate() + parseInt(date.CompntValue));
                this.ExpirationDate = formatDate(this.Date, 'yyyy-MM-dd', 'en-US');
                this.PODetailForm.patchValue({
                  PurchaseOrderExpiredDt: datePipe.transform(this.Date, "yyyy-MM-dd")
                });
              },
              (error) => {
                console.log(error);
              }
            );
          }
        ).catch(
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkValidExpDt() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let bzDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    let tempExpDt = new Date(this.ExpirationDate);
    if (bzDt.getTime() > tempExpDt.getTime()) {
      throw this.toastr.typeErrorCustom("Need Extension");
    }
  }

  async Save() {
    this.checkValidExpDt();
    var formValue = this.PODetailForm.value;
    var requestPurchaseOrderH = new PurchaseOrderHObj();
    var requestListPurchaseOrderD = new Array<PurchaseOrderDObj>();
    if (this.IsDisburseToCust) {
      requestPurchaseOrderH.BankCode = this.CustBankAcc.BankCode;
      requestPurchaseOrderH.BankBranch = this.CustBankAcc.BankBranch;
      requestPurchaseOrderH.BankAccNo = this.CustBankAcc.BankAccNo;
      requestPurchaseOrderH.BankAccName = this.CustBankAcc.BankAccName;
    } else {
      requestPurchaseOrderH.BankCode = this.VendorBankAcc.BankCode;
      requestPurchaseOrderH.BankBranch = this.VendorBankAcc.BankBranch;
      requestPurchaseOrderH.BankAccNo = this.VendorBankAcc.BankAccountNo;
      requestPurchaseOrderH.BankAccName = this.VendorBankAcc.BankAccountName;
    }

    if (!this.PurchaseOrderHId || this.PurchaseOrderHId == 0) {
      requestPurchaseOrderH.PurchaseOrderHId = 0;
      requestPurchaseOrderH.PurchaseOrderNo = "";
      requestPurchaseOrderH.PurchaseOrderDt = new Date(formatDate(this.UserContext[CommonConstant.BUSINESS_DT], 'yyyy-MM-dd', 'en-US'));
      requestPurchaseOrderH.PurchaseOrderExpiredDt = new Date(this.ExpirationDate);
      requestPurchaseOrderH.TotalPurchaseOrderAmt = formValue["TotalDisburse"];
      requestPurchaseOrderH.AgrmntId = this.AgrmntId;
      requestPurchaseOrderH.SupplCode = this.AppLoanPurposeList[0].SupplCode;
      requestPurchaseOrderH.Notes = this.PODetailForm.controls.Notes.value;
      requestPurchaseOrderH.NumOfExtension = 0;
      requestPurchaseOrderH.MouNo = this.MouNo;

      var ListPORefMasterObj = await this.GetFromRule();
      requestListPurchaseOrderD = this.GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj);

    }
    else {
      requestPurchaseOrderH.PurchaseOrderHId = this.PurchaseOrderH.PurchaseOrderHId;
      requestPurchaseOrderH.PurchaseOrderNo = this.PurchaseOrderH.PurchaseOrderNo;
      requestPurchaseOrderH.PurchaseOrderDt = this.PurchaseOrderH.PurchaseOrderDt;
      requestPurchaseOrderH.PurchaseOrderExpiredDt = new Date(this.ExpirationDate);
      requestPurchaseOrderH.TotalPurchaseOrderAmt = this.PurchaseOrderH.TotalPurchaseOrderAmt;
      requestPurchaseOrderH.AgrmntId = this.PurchaseOrderH.AgrmntId;
      requestPurchaseOrderH.SupplCode = this.PurchaseOrderH.SupplCode;
      // requestPurchaseOrderH.BankCode = this.PurchaseOrderH.BankCode;
      // requestPurchaseOrderH.BankBranch = this.PurchaseOrderH.BankBranch;
      // requestPurchaseOrderH.BankAccNo = this.PurchaseOrderH.BankAccNo;
      // requestPurchaseOrderH.BankAccName = this.PurchaseOrderH.BankAccName;
      requestPurchaseOrderH.Notes = this.PODetailForm.controls.Notes.value;
      requestPurchaseOrderH.NumOfExtension = this.PurchaseOrderH.NumOfExtension;
      requestPurchaseOrderH.MouNo = this.PurchaseOrderH.MouNo;
      requestPurchaseOrderH.RowVersion = this.PODetailForm.controls.RowVersion.value;

      for (const item of this.PurchaseOrderH.PurchaseOrderDList) {
        var purchaseOrderDObj = new PurchaseOrderDObj();
        purchaseOrderDObj.PurchaseOrderDId = item.PurchaseOrderDId;
        purchaseOrderDObj.PurchaseOrderHId = item.PurchaseOrderHId;
        purchaseOrderDObj.MrPoItemCode = item.MrPoItemCode;
        purchaseOrderDObj.PurchaseOrderAmt = item.PurchaseOrderAmt;
        requestListPurchaseOrderD.push(purchaseOrderDObj);
      }
    }

    if (!this.PurchaseOrderHId || this.PurchaseOrderHId == 0) {
      this.httpClient.post(URLConstant.AddPurchaseOrder, { requestPurchaseOrderHObj: requestPurchaseOrderH, requestPurchaseOrderDObjs: requestListPurchaseOrderD }).toPromise().then(
        (response) => {
          this.activeModal.close(response);
        }
      ).catch(
        () => {
        }
      );
    }else{      
      this.httpClient.post(URLConstant.EditPurchaseOrder, { requestPurchaseOrderHObj: requestPurchaseOrderH, requestPurchaseOrderDObjs: requestListPurchaseOrderD }).toPromise().then(
        (response) => {
          this.activeModal.close(response);
        }
      ).catch(
        () => {
        }
      );
    }

  }

  async GetFromRule() {
    var tempRefMasterObj = new Array();
    await this.httpClient.post(URLConstant.GetPurchaseOrderDPoItemCodeFromRuleByType, {}).toPromise().then(
      (response) => {
        console.log(response);
        tempRefMasterObj = response["ListPoItems"];

      });
    return tempRefMasterObj;
  }

  GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj) {
    var TempListPurchaseOrderD = new Array();
    for (var i = 0; i < ListPORefMasterObj.length; i++) {
      if (ListPORefMasterObj[i].Type == CommonConstant.PurchaseOrderItemTypeNonFee) {
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = ListPORefMasterObj[i].MrPoItemCode;
        tempPurchaseOrderDObj.PurchaseOrderAmt = this.AssetObj.AgrmntFinDataObj[ListPORefMasterObj[i].SourceAgrmntFinDataField] ? this.AssetObj["AgrmntFinDataObj"][ListPORefMasterObj[i].SourceAgrmntFinDataField] : 0;
        TempListPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
      if (ListPORefMasterObj[i].Type == CommonConstant.PurchaseOrderItemTypeFee) {
        let tempAgrmntFeeObj = this.AssetObj.AgrmntFeeListObj.find(x => x.MrFeeTypeCode == ListPORefMasterObj[i].SourceMrFeeTypeCode);
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = ListPORefMasterObj[i].MrPoItemCode;
        tempPurchaseOrderDObj.PurchaseOrderAmt = tempAgrmntFeeObj.AppFeeAmt ? tempAgrmntFeeObj.AppFeeAmt : 0;
        TempListPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
    }
    return TempListPurchaseOrderD;
  }
}

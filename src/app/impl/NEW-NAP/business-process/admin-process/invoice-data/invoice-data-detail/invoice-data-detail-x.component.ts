import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { CookieService } from "ngx-cookie";
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";
import { Validators, FormBuilder } from "@angular/forms";
import { ResGetAllAssetDataForPOByAsset } from "app/shared/model/response/purchase-order/res-get-all-asset-data-for-po.model";
import { PurchaseOrderHObj } from "app/shared/model/purchase-order-h-obj.model";
import { ReqAssetDataObj } from "app/shared/model/request/app-asset/req-app-asset-obj.model";
import { PurchaseOrderDObj } from "app/shared/model/purchase-order-d-obj.model";
import { UcDropdownListObj } from "app/shared/model/library/uc-dropdown-list-obj.model";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { RefMasterObj } from "app/shared/model/ref-master-obj.model";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-invoice-data-detail-x",
  templateUrl: "./invoice-data-detail-x.component.html",
})
export class InvoiceDataDetailXComponent implements OnInit {
  arrValue: Array<number> = [];
  AgrmntId: number;
  AppId: number;
  SupplCode: string;
  ProportionalValue: number;
  purchaseOrderHObj: PurchaseOrderHObj;
  // purchaseOrderDObj: PurchaseOrderDObj;
  lobCode: string;
  TaskListId: string;
  BizTemplateCode: string;
  responseRefBank: any;
  isReady: boolean = false;

  InvoiceDataForm = this.fb.group({
    SupplCode: [""],
    InvoiceNo: ["", [Validators.required, Validators.maxLength(20)]],
    InvoiceDt: ["", Validators.required],
    TotalInvoiceAmt: [0, [Validators.required, Validators.min(1)]],
    RcvBy: [""],
    InvoiceAmt: [""],
    PurchaseOrderHId: [""],
  });

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["SupplCode"] != null) {
        this.SupplCode = params["SupplCode"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  isDataExist: boolean = false;
  readonly bizTemplateCodeFl4w: string = CommonConstant.FL4W;
  async ngOnInit() {
    let context = JSON.parse(
      AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS)
    );
    this.arrValue.push(this.AgrmntId);
    this.purchaseOrderHObj = new PurchaseOrderHObj();

    let appAssetObj: ReqAssetDataObj = new ReqAssetDataObj();
    appAssetObj.AppId = this.AppId;
    appAssetObj.AgrmntId = this.AgrmntId;
    appAssetObj.SupplCode = this.SupplCode;

    await this.http
      .post(URLConstantX.GetPurchaseOrderHByAgrmntIdAndSupplCodeX, appAssetObj)
      .toPromise()
      .then(async (response) => {
        if (response["PurchaseOrderHId"] != 0) {
          this.purchaseOrderHObj.PurchaseOrderHId =
            response["PurchaseOrderHId"];
          this.purchaseOrderHObj.PurchaseOrderNo = response["PurchaseOrderNo"];
          this.purchaseOrderHObj.TotalPurchaseOrderAmt =
            response["TotalPurchaseOrderAmt"];
        }
      });

    this.InvoiceDataForm.patchValue({
      SupplCode: this.SupplCode,
      RcvBy: context.UserName,
      PurchaseOrderHId: this.purchaseOrderHObj.PurchaseOrderHId,
      InvoiceAmt: this.purchaseOrderHObj.TotalPurchaseOrderAmt,
      TotalInvoiceAmt: this.purchaseOrderHObj.TotalPurchaseOrderAmt,
    });

    var RequestInvoiceX = {
      RequestInvoiceHXObj: {
        VendorCode: this.InvoiceDataForm.controls.SupplCode.value,
      },
      RequestInvoiceDXObj: {
        PurchaseOrderHId: this.InvoiceDataForm.controls.PurchaseOrderHId.value,
      },
    };

    await this.http
      .post(
        URLConstantX.GetInvoiceXByVendorCodeAndPurchaseOrderHId,
        RequestInvoiceX
      )
      .subscribe((response) => {
        console.log(response);
        if (response["ResponseInvoiceHXObj"] != null) {
          this.isDataExist = true;
          this.InvoiceDataForm.patchValue({
            InvoiceNo: response["ResponseInvoiceHXObj"].InvoiceNo,
            InvoiceDt: formatDate(
              response["ResponseInvoiceHXObj"].InvoiceDt,
              "yyyy-MM-dd",
              "en-US"
            ),
            // TotalInvoiceAmt: response["ResponseInvoiceHXObj"].TotalInvoiceAmt,
            InvoiceAmt: response["ResponseInvoiceDXObj"].InvoiceAmt,
          });
        }
      });
  }

  async SaveForm() {
    if (
      this.InvoiceDataForm.get("TotalInvoiceAmt").value ==
      this.purchaseOrderHObj.TotalPurchaseOrderAmt
    ) {
      // this.purchaseOrderHObj.MouNo = this.MouNo;
      // this.purchaseOrderHObj.Notes = this.Notes;
      // this.purchaseOrderHObj.PurchaseOrderDt = new Date(formatDate(context[CommonConstant.BUSINESS_DT], 'yyyy-MM-dd', 'en-US'));
      // this.purchaseOrderHObj.PurchaseOrderExpiredDt = this.PurchaseOrderExpiredDt;

      // if (this.bankVisible == true) {
      //   this.purchaseOrderHObj.BankCode = this.responseRefBank.BankCode;
      //   this.purchaseOrderHObj.BankBranch = this.responseRefBank.OfficeBankAccBranch;
      //   this.purchaseOrderHObj.BankAccNo = this.responseRefBank.OfficeBankAccNo;
      //   this.purchaseOrderHObj.BankAccName = this.responseRefBank.OfficeBankAccName;
      // }

      // var ListPORefMasterObj = await this.GetFromRule();
      // var listPurchaseOrderD = this.GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj);

      var RequestInvoiceX = {
        RequestInvoiceHXObj: {
          VendorCode: this.InvoiceDataForm.controls.SupplCode.value,
          InvoiceNo: this.InvoiceDataForm.controls.InvoiceNo.value,
          InvoiceDt: this.InvoiceDataForm.controls.InvoiceDt.value,
          RcvBy: this.InvoiceDataForm.controls.RcvBy.value,
          TotalInvoiceAmt: this.InvoiceDataForm.controls.TotalInvoiceAmt.value,
        },
        RequestInvoiceDXObj: {
          PurchaseOrderHId:
            this.InvoiceDataForm.controls.PurchaseOrderHId.value,
          InvoiceAmt: this.InvoiceDataForm.controls.InvoiceAmt.value,
        },
      };

      // var RequestInvoiceX = {
      //     VendorCode: this.InvoiceDataForm.controls.SupplCode.value,
      //     InvoiceNo: this.InvoiceDataForm.controls.InvoiceNo.value,
      //     InvoiceDt: this.InvoiceDataForm.controls.InvoiceDt.value,
      //     RcvBy: this.InvoiceDataForm.controls.RcvBy.value,
      //     TotalInvoiceAmt: this.InvoiceDataForm.controls.TotalInvoiceAmt.value,
      //     PurchaseOrderHId: this.InvoiceDataForm.controls.PurchaseOrderHId.value,
      //     InvoiceAmt: this.InvoiceDataForm.controls.InvoiceAmt.value,
      // }
      console.log(RequestInvoiceX);
      console.log(this.InvoiceDataForm);
      this.AddEditInvoice(RequestInvoiceX);
    } else {
      this.toastr.warningMessage(
        "Total Invoice Amount is not equal to Invoice Amount."
      );
    }
  }

  // checkValidExpDt() {
  //   let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  //   let bzDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
  //   let tempExpDt = new Date(this.PurchaseOrderExpiredDt);
  //   if (bzDt.getTime() > tempExpDt.getTime()) {
  //     throw this.toastr.typeErrorCustom("Need Extension");
  //   }
  // }

  async AddEditInvoice(RequestInvoiceX: any) {
    // this.checkValidExpDt();
    if (!this.isDataExist) {
      this.http
        .post(URLConstantX.AddInvoiceX, RequestInvoiceX)
        .subscribe((response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(
            this.router,
            [NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA],
            {
              AgrmntId: this.AgrmntId,
              AppId: this.AppId,
              TaskListId: this.TaskListId,
              BizTemplateCode: this.BizTemplateCode,
            }
          );
        });
    } else {
      this.http
        .post(URLConstantX.EditInvoiceX, RequestInvoiceX)
        .subscribe((response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(
            this.router,
            [NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA],
            {
              AgrmntId: this.AgrmntId,
              AppId: this.AppId,
              TaskListId: this.TaskListId,
              BizTemplateCode: this.BizTemplateCode,
            }
          );
        });
    }
  }
}

import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { URLConstant } from "app/shared/constant/URLConstant";
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsHelper } from "app/shared/AdInsHelper";

@Component({
  selector: "app-crd-rvw-grp-hist-detail-dsf",
  templateUrl: "./crd-rvw-grp-hist-detail-dsf.component.html",
  providers: [NGXToastrService],
})
export class CrdRvwGrpHistDetailDsfComponent implements OnInit {
  @Input() CustNo: string = "";

  IsViewReady: boolean = false;

  ExstAgrmnt: any;
  AppRjct: any;
  AppPrcs: any;
  AppCan: any;
  ExpiredApp: any;

  TotalNTF: number = 0;
  TotalUnit: number = 0;
  TotalActiveInstallment: number = 0;
  TotalOSPrincipal: number = 0;
  TotalAR: number = 0;
  TotalOSAR: number = 0;
  ReturnAgrmnt: any;
  ReturnApp: any;

  TotalProcessAsset: number = 0;
  TotalProcessPrincipal: number = 0;
  TotalProcessAR: number = 0;
  TotalProcessInstallment: number = 0;
  TotalRejectedAsset: number = 0;
  TotalRejectedPrincipal: number = 0;
  TotalRejectedAR: number = 0;
  TotalRejectedInstallment: number = 0;

  TotalExpiredAsset: number = 0;
  TotalExpiredPrincipal: number = 0;
  TotalExpiredAR: number = 0;
  TotalExpiredInstallment: number = 0;

  constructor(private http: HttpClient, private toastr: NGXToastrService) {}

  async ngOnInit() {
    this.IsViewReady = true;

    if (this.CustNo != null && this.CustNo != undefined && this.CustNo != "") {
      let reqObjListCustNo = {
        ListCustNo: [this.CustNo],
      };
      this.http
        .post(URLConstantX.GetAgrmntHistByListCustNo, reqObjListCustNo)
        .subscribe(async (response) => {
          this.ExstAgrmnt = response;
          await this.GetGrandTotal();
        });

      let reqObjIsAppInitDone = {
        CustNo: this.CustNo,
        IsAppInitDone: 1,
      };
      this.http
        .post(
          URLConstantX.GetAppByCustNoAndIsAppInitDoneV2,
          reqObjIsAppInitDone
        )
        .subscribe(async (response) => {
          this.AppPrcs = response;
          await this.GetProcessGrandTotal();
        });

      let reqObjAppStat = {
        CustNo: this.CustNo,
        AppStat: "RJC",
      };
      this.http
        .post(URLConstantX.GetAppByCustNoAndAppStatV2, reqObjAppStat)
        .subscribe(async (response) => {
          this.AppRjct = response;
          let reqCanObj = {
            CustNo: this.CustNo,
            AppStat: "CAN",
          };
          this.http
            .post(URLConstantX.GetAppByCustNoAndAppStatV2, reqCanObj)
            .subscribe(async (response) => {
              this.AppCan = response;
              this.AppCan.forEach((element) => {
                this.AppRjct.push(element);
              });
              await this.GetRejectedGrandTotal();
            });
        });

      let reqObjCustNo = {
        CustNo: this.CustNo,
      };
      this.http
        .post(
          URLConstantX.GetAgrmntExpiredHistForCustViewByCustNo,
          reqObjCustNo
        )
        .subscribe(async (response) => {
          this.ExpiredApp = response;
          await this.GetExpiredGrandTotal();
        });
    }
  }

  async GetGrandTotal() {
    if (this.ExstAgrmnt != undefined && this.ExstAgrmnt.length != 0) {
      var existingAgreement = this.ExstAgrmnt;
      existingAgreement.forEach((element) => {
        this.TotalNTF = this.TotalNTF + element.NTFAmount;
        this.TotalUnit = this.TotalUnit + element.NumOfAsset;
        this.TotalActiveInstallment += element.InstAmount;
        this.TotalOSPrincipal += element.OsPrincipal;
        this.TotalAR += element.ArAmount;
        this.TotalOSAR += element.OsArAmount;
      });
    }
  }

  async GetProcessGrandTotal() {
    if (this.AppPrcs != undefined && this.AppPrcs.length != 0) {
      this.AppPrcs.forEach((element) => {
        this.TotalProcessAsset += element.NumOfAsset;
        this.TotalProcessPrincipal += element.TotalNTF;
        this.TotalProcessAR += element.TotalAR;
        this.TotalProcessInstallment += element.InstAmount;
      });
    }
  }

  async GetRejectedGrandTotal() {
    if (this.AppRjct != undefined && this.AppRjct.length != 0) {
      this.TotalRejectedAsset = 0;
      this.TotalRejectedPrincipal = 0;
      this.TotalRejectedAR = 0;
      this.TotalRejectedInstallment = 0;
      this.AppRjct.forEach((element) => {
        this.TotalRejectedAsset += element.NumOfAsset;
        this.TotalRejectedPrincipal += element.TotalNTF;
        this.TotalRejectedAR += element.TotalAR;
        this.TotalRejectedInstallment += element.InstAmount;
      });
    }
  }

  async GetExpiredGrandTotal() {
    if (this.ExpiredApp != undefined && this.ExpiredApp.length != 0) {
      var expiredApp = this.ExpiredApp;
      expiredApp.forEach((element) => {
        this.TotalExpiredPrincipal += element.NTFAmount;
        this.TotalExpiredAsset += element.NumOfAsset;
        this.TotalExpiredAR += element.ArAmount;
      });
    }
  }

  ClickLinkAppNo(AppId) {
    AdInsHelper.OpenAppViewByAppId(AppId);
  }

  ClickLinkAppNoByAppNo(AppNo) {
    this.http
      .post(URLConstant.GetAppByAppNo, { TrxNo: AppNo })
      .subscribe((response) => {
        this.ReturnApp = response;
        if (
          this.ReturnApp.AppId != 0 &&
          this.ReturnApp.AppId != null &&
          this.ReturnApp.AppId != undefined
        ) {
          AdInsHelper.OpenAppViewByAppId(this.ReturnApp.AppId);
        } else {
          this.toastr.errorMessage("Data not found");
        }
      });
  }

  ClickLinkAgrmntNo(AgrmntNo) {
    this.http
      .post(URLConstant.GetAgrmntByAgrmntNo, { TrxNo: AgrmntNo })
      .subscribe((response) => {
        this.ReturnAgrmnt = response;
        if (
          this.ReturnAgrmnt.AgrmntId != 0 &&
          this.ReturnAgrmnt.AgrmntId != null &&
          this.ReturnAgrmnt.AgrmntId != undefined
        ) {
          AdInsHelper.OpenAgrmntViewByAgrmntId(this.ReturnAgrmnt.AgrmntId);
        } else {
          this.toastr.errorMessage("Data not found");
        }
      });
  }
}

import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { URLConstant } from "app/shared/constant/URLConstant";
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstantDsf } from "app/shared/constant/URLConstantDsf";

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

  TotalCSPPercentage: number = 0;
  TotalRjcCSPPercentage: number = 0;
  TotalPrcsCSPPercentage: number = 0;
  TotalExpCSPPercentage: number = 0;

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
          if (this.ExstAgrmnt.resAgrmntObjX.length > 0) {
            if (this.ExstAgrmnt["result"] == 1) {
              this.toastr.successMessageTitle(
                "Agreement Live",
                this.ExstAgrmnt["MessageFromIFin"]
              );
            } else {
              this.toastr.errorMessageTitle(
                "Agreement Live",
                this.ExstAgrmnt["MessageFromIFin"]
              );
            }
          }
          await this.GetGrandTotal();
          await this.GetListAgrmnt();
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
          if (this.AppPrcs.resAppXV2Obj.length > 0) {
            if (this.AppPrcs["result"] == 1) {
              this.toastr.successMessageTitle(
                "App In Process",
                this.AppPrcs["MessageFromIFin"]
              );
            } else {
              this.toastr.errorMessageTitle(
                "App In Process",
                this.AppPrcs["MessageFromIFin"]
              );
            }
          }
          await this.GetProcessGrandTotal();
          await this.GetPrcListApp();
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
              await this.GetRjcListApp();
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
          if (this.ExpiredApp.resAgrmntExpiredObjX.length > 0) {
            if (this.ExpiredApp["result"] == 1) {
              this.toastr.successMessageTitle(
                "Agreement Expired",
                this.ExpiredApp["MessageFromIFin"]
              );
            } else {
              this.toastr.errorMessageTitle(
                "Agreement Expired",
                this.ExpiredApp["MessageFromIFin"]
              );
            }
          }
          await this.GetExpiredGrandTotal();
          await this.GetExpListAgrmnt();
        });
    }
  }

  async GetGrandTotal() {
    if (this.ExstAgrmnt.resAgrmntObjX != undefined && this.ExstAgrmnt.resAgrmntObjX.length != 0) {
      var existingAgreement = this.ExstAgrmnt.resAgrmntObjX;
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
    if (this.AppPrcs.resAppXV2Obj != undefined && this.AppPrcs.resAppXV2Obj.length != 0) {
      this.AppPrcs.resAppXV2Obj.forEach((element) => {
        this.TotalProcessAsset += element.NumOfAsset;
        this.TotalProcessPrincipal += element.TotalNTF;
        this.TotalProcessAR += element.TotalAR;
        this.TotalProcessInstallment += element.InstAmount;
      });
    }
  }

  async GetRejectedGrandTotal() {
    if (this.AppRjct != undefined && this.AppRjct.length != 0) {
      this.AppRjct.forEach((element) => {
        this.TotalRejectedAsset += element.NumOfAsset;
        this.TotalRejectedPrincipal += element.TotalNTF;
        this.TotalRejectedAR += element.TotalAR;
        this.TotalRejectedInstallment += element.InstAmount;
      });
    }
  }

  async GetExpiredGrandTotal() {
    if (this.ExpiredApp.resAgrmntExpiredObjX != undefined && this.ExpiredApp.resAgrmntExpiredObjX.length != 0) {
      var expiredApp = this.ExpiredApp.resAgrmntExpiredObjX;
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

  //#region Self Custom
  async GetListAgrmnt() {
    if (this.ExstAgrmnt.resAgrmntObjX != undefined && this.ExstAgrmnt.resAgrmntObjX.length > 0) {
      await this.http.post(
        URLConstantDsf.GetAgrmntListForCustHistDsf,
        {
          listAgrmntNo: this.ExstAgrmnt.resAgrmntObjX.map(item => item.AgreementNo)
        }
      ).subscribe(
        (response: any) => {
          if (response != undefined) {
            this.ExstAgrmnt.resAgrmntObjX = this.MergeListAgrmnt(this.ExstAgrmnt.resAgrmntObjX, "AgreementNo", response.resAgrmntListForCustHistDsf)
            this.TotalCSPPercentage = this.GetTotalCSP(this.ExstAgrmnt.resAgrmntObjX)
          }
        }
      );
    }
  }

  async GetRjcListApp() {
    if (this.AppRjct != undefined && this.AppRjct.length > 0) {
      await this.http.post(
        URLConstantDsf.GetAppListForCustHistDsf,
        {
          listAppNo: this.AppRjct.map(item => item.AppNo)
        }
      ).subscribe(
        (response: any) => {
          if (response != undefined) {
            this.AppRjct = this.MergeListApp(this.AppRjct, "AppNo", response.resAppListForCustHistDsf)
            this.TotalRjcCSPPercentage = this.GetTotalCSP(this.AppRjct)
          }
        }
      );
    }
  }

  async GetPrcListApp() {
    if (this.AppPrcs.resAppXV2Obj != undefined && this.AppPrcs.resAppXV2Obj.length > 0) {
      await this.http.post(
        URLConstantDsf.GetAppListForCustHistDsf,
        {
          listAppNo: this.AppPrcs.resAppXV2Obj.map(item => item.AppNo)
        }
      ).subscribe(
        (response: any) => {
          if (response != undefined) {
            this.AppPrcs.resAppXV2Obj = this.MergeListApp(this.AppPrcs.resAppXV2Obj, "AppNo", response.resAppListForCustHistDsf)
            this.TotalPrcsCSPPercentage = this.GetTotalCSP(this.AppPrcs.resAppXV2Obj)
          }
        }
      );
    }
  }

  async GetExpListAgrmnt() {
    if (this.ExpiredApp.resAgrmntExpiredObjX != undefined && this.ExpiredApp.resAgrmntExpiredObjX.length > 0) {
      await this.http.post(
        URLConstantDsf.GetAgrmntListForCustHistDsf,
        {
          listAgrmntNo: this.ExpiredApp.resAgrmntExpiredObjX.map(item => item.AgreementNo)
        }
      ).subscribe(
        (response: any) => {
          if (response != undefined) {
            this.ExpiredApp.resAgrmntExpiredObjX = this.MergeListAgrmnt(this.ExpiredApp.resAgrmntExpiredObjX, "AgreementNo", response.resAgrmntListForCustHistDsf)
            this.TotalExpCSPPercentage = this.GetTotalCSP(this.ExpiredApp.resAgrmntExpiredObjX)
          }
        }
      );
    }
  }

  MergeListAgrmnt(objRes: any, objResProp: string, objSrc: any): any {
    const map = new Map()
    objRes.forEach(item => map.set(item[objResProp], item))
    objSrc.forEach(item => {
      if (map.has(item.AgreementNo)) {
        map.set(item.AgreementNo, { ...map.get(item.AgreementNo), ...item })
      }
    })

    return Array.from(map.values());
  }

  MergeListApp(objRes: any, objResProp: string, objSrc: any): any {
    const map = new Map()
    objRes.forEach(item => map.set(item[objResProp], item))
    objSrc.forEach(item => {
      if (map.has(item.ApplicationNo)) {
        map.set(item.ApplicationNo, { ...map.get(item.ApplicationNo), ...item })
      }
    })

    return Array.from(map.values());
  }

  GetTotalCSP(listApp: any): number {
    let totalAssetPrice = 0
    let totalAssetDP = 0
    let totalAccPrice = 0
    let totalAccDP = 0
    if (listApp != undefined && listApp.length != 0) {
      listApp.forEach(item => {
        totalAssetDP += item.AssetDP || 0
        totalAccDP += item.AccDP || 0
        totalAssetPrice += item.AssetPrice || 0
        totalAccPrice += item.AccPrice || 0
      });
    }

    if (totalAssetPrice + totalAccPrice === 0) {
      return 0
    }

    return (totalAccDP + totalAssetDP) / (totalAccPrice + totalAssetPrice) * 100
  }
  //#endregion
}

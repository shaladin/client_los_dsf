import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { GenericObj } from "app/shared/model/generic/generic-obj.model";

@Component({
  selector: 'app-crd-rvw-cust-hist-data-x-dsf',
  templateUrl: './crd-rvw-cust-hist-data-x-dsf.component.html',
  providers: [NGXToastrService]
})
export class CrdRvwCustHistDataXDsfComponent implements OnInit {
  @Input() AppId: number = 0;

  BizTemplateCode: string = "";
  IsViewReady: boolean = false;

  CustNo: any;
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

  //#region self custom
  CustId: any;
  GroupObj: any;

  IsSummaryReady: boolean = false;

  ExstAgrmntSummary: any;
  AppRjctSummary: any;
  AppPrcsSummary: any;
  ExpiredAppSummary: any;

  TotalNTFSummary: number = 0;
  TotalUnitSummary: number = 0;
  TotalActiveInstallmentSummary: number = 0;
  TotalOSPrincipalSummary: number = 0;
  TotalARSummary: number = 0;
  TotalOSARSummary: number = 0;

  TotalRejectedAssetSummary: number = 0;
  TotalRejectedPrincipalSummary: number = 0;
  TotalRejectedARSummary: number = 0;
  TotalRejectedInstallmentSummary: number = 0;

  TotalProcessAssetSummary: number = 0;
  TotalProcessPrincipalSummary: number = 0;
  TotalProcessARSummary: number = 0;
  TotalProcessInstallmentSummary: number = 0;

  TotalExpiredAssetSummary: number = 0;
  TotalExpiredPrincipalSummary: number = 0;
  TotalExpiredARSummary: number = 0;

  //#endregion

  constructor(private http: HttpClient, private toastr: NGXToastrService) { }

  async ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;

    await this.GetSummary() // self custom

    this.http.post(URLConstant.GetCustDataByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.CustNo = response['AppCustObj']['CustNo'];

        if (this.CustNo != null && this.CustNo != undefined && this.CustNo != "") {
          let reqObjListCustNo = {
            ListCustNo: [this.CustNo]
          }
          this.http.post(URLConstantX.GetAgrmntHistByListCustNo, reqObjListCustNo).subscribe(
            async (response) => {
              this.ExstAgrmnt = response;
              if (this.ExstAgrmnt.resAgrmntObjX.length > 0){
                if(this.ExstAgrmnt["result"]==1){
                    this.toastr.successMessageTitle("Agreement Live",this.ExstAgrmnt["MessageFromIFin"])
                }
                else{

                    this.toastr.errorMessageTitle("Agreement Live",this.ExstAgrmnt["MessageFromIFin"])
                }
              }
              await this.GetGrandTotal();
            }
          );

          this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
            (response: AppObj) => {
              let reqObj = {
                CustNo: this.CustNo,
                IsAppInitDone: response.IsAppInitDone
              }
              this.http.post(URLConstantX.GetAppByCustNoAndIsAppInitDoneV2, reqObj).subscribe(
                async (response) => {
                  this.AppPrcs = response;
                  console.log(this.AppPrcs.resAppXV2Obj)
                    if (this.AppPrcs.resAppXV2Obj.length > 0){
                        if(this.AppPrcs["result"]==1){
                            this.toastr.successMessageTitle("App In Process",this.AppPrcs["MessageFromIFin"])
                        }
                        else{

                            this.toastr.errorMessageTitle("App In Process",this.AppPrcs["MessageFromIFin"])
                        }
                    }
                  await this.GetProcessGrandTotal();
                }
              );
            }
          );

          let reqObj = {
            CustNo: this.CustNo,
            AppStat: "RJC"
          }
          this.http.post(URLConstantX.GetAppByCustNoAndAppStatV2, reqObj).subscribe(
            async (response) => {
              this.AppRjct = response;
              let reqCanObj = {
                CustNo: this.CustNo,
                AppStat: "CAN"
              }
              this.http.post(URLConstantX.GetAppByCustNoAndAppStatV2, reqCanObj).subscribe(
                async (response) => {
                  this.AppCan = response;
                  this.AppCan.forEach(element => {
                    this.AppRjct.push(element);
                  });
                  await this.GetRejectedGrandTotal();
                }
              );
            }
          );

          let reqObjCustNo = {
            CustNo: this.CustNo
          }
          this.http.post(URLConstantX.GetAgrmntExpiredHistForCustViewByCustNo, reqObjCustNo).subscribe(
            async (response) => {
              this.ExpiredApp = response;
              if (this.ExpiredApp.resAgrmntExpiredObjX.length > 0){
                if(this.ExpiredApp["result"]==1){
                    this.toastr.successMessageTitle("Agreement Expired",this.ExpiredApp["MessageFromIFin"])
                }
                else{

                    this.toastr.errorMessageTitle("Agreement Expired",this.ExpiredApp["MessageFromIFin"])
                }
               }
              await this.GetExpiredGrandTotal();
            }
          );
        }
      }
    );
  }

  async GetGrandTotal() {
    if (this.ExstAgrmnt.resAgrmntObjX != undefined && this.ExstAgrmnt.resAgrmntObjX.length != 0) {
      var existingAgreement = this.ExstAgrmnt.resAgrmntObjX;
      existingAgreement.forEach(element => {
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
      this.AppPrcs.resAppXV2Obj.forEach(element => {
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
      this.AppRjct.forEach(element => {
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
      expiredApp.forEach(element => {
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
    this.http.post(URLConstant.GetAppByAppNo, { TrxNo: AppNo }).subscribe(
      (response) => {
        this.ReturnApp = response;
        if (this.ReturnApp.AppId != 0 && this.ReturnApp.AppId != null && this.ReturnApp.AppId != undefined) {
          AdInsHelper.OpenAppViewByAppId(this.ReturnApp.AppId);
        } else {
          this.toastr.errorMessage("Data not found");
        }
      }
    )
  }

  ClickLinkAgrmntNo(AgrmntNo) {
    this.http.post(URLConstant.GetAgrmntByAgrmntNo, { TrxNo: AgrmntNo }).subscribe(
      (response) => {
        this.ReturnAgrmnt = response;
        if (this.ReturnAgrmnt.AgrmntId != 0 && this.ReturnAgrmnt.AgrmntId != null && this.ReturnAgrmnt.AgrmntId != undefined) {
          AdInsHelper.OpenAgrmntViewByAgrmntId(this.ReturnAgrmnt.AgrmntId);
        } else {
          this.toastr.errorMessage("Data not found");
        }
      }
    );
  }

    //#region self custom
    async GetSummary(){
      await this.GetSummaryData()

      this.GetGrandTotalSummary()
      this.GetRejectedGrandTotalSummary()
      this.GetProcessGrandTotalSummary()
      this.GetExpiredGrandTotalSummary()

      this.IsSummaryReady = true;
    }

    async GetSummaryData() {
        await this.GetCustGroup();
        console.log(this.GroupObj)
        const promises = this.GroupObj.map(async (cust) => {
          // console.log(cust)
            await this.GetExistingAgrData([cust["CustNo"]]);
            await this.GetRejectData(cust["CustNo"]);
            await this.GetAppInPrcsData(cust["CustNo"]);
            await this.GetExpiredData(cust["CustNo"]);
        });
        await Promise.all(promises); // Wait for all requests to complete
    }

    async GetExistingAgrData(listCustNo: string[]){
        const reqObjListCustNoSummary = {
            ListCustNo: listCustNo
        };
        await this.http.post(URLConstantX.GetAgrmntHistByListCustNo, reqObjListCustNoSummary).toPromise().then(
            (response: any) => {
                if (this.ExstAgrmntSummary != undefined && this.ExstAgrmntSummary.length != 0) {
                    if (response != undefined && response.length != 0) {
                        response.forEach(element => {
                        this.ExstAgrmntSummary.push(element);
                    });
                }
                } else {
                    this.ExstAgrmntSummary = response;
                }
            }
        );
    }

    async GetRejectData(custNo: string){
        const reqObjAppStat = {
            CustNo: custNo,
            AppStat: "RJC"
        }
        await this.http.post(URLConstantX.GetAppByCustNoAndAppStatV2, reqObjAppStat).toPromise().then(
            async (response: any) => {
                if (this.AppRjctSummary != undefined && this.AppRjctSummary.length != 0) {
                    if (response != undefined && response.length != 0) {
                        response.forEach(element => {
                        this.AppRjctSummary.push(element);
                    });
                }
                } else {
                    this.AppRjctSummary = response;
                }

                const reqCanObj = {
                    CustNo: custNo,
                    AppStat: "CAN"
                }
                await this.http.post(URLConstantX.GetAppByCustNoAndAppStatV2, reqCanObj).toPromise().then(
                    (response: any) => {
                        if (this.AppRjctSummary != undefined && this.AppRjctSummary.length != 0) {
                            if (response != undefined && response.length != 0) {
                                response.forEach(element => {
                                this.AppRjctSummary.push(element);
                            });
                        }
                        } else {
                            this.AppRjctSummary = response;
                        }
                    }
                );
            }
        );
    }

    async GetAppInPrcsData(custNo: string){
        const reqObjIsAppInitDone = {
            CustNo: custNo,
            IsAppInitDone: 1
        }
        await this.http.post(URLConstantX.GetAppByCustNoAndIsAppInitDoneV2, reqObjIsAppInitDone).toPromise().then(
            (response: any) => {
                if (this.AppPrcsSummary != undefined && this.AppPrcsSummary.length != 0) {
                    if (response != undefined && response.length != 0) {
                        response.forEach(element => {
                        this.AppPrcsSummary.push(element);
                    });
                }
                } else {
                    this.AppPrcsSummary = response;
                }
            }
        );
    }

    async GetExpiredData(custNo: string){
        const reqObjCustNo = {
            CustNo: custNo
        }
        await this.http.post(URLConstantX.GetAgrmntExpiredHistForCustViewByCustNo, reqObjCustNo).toPromise().then(
            (response: any) => {
                if (this.ExpiredAppSummary != undefined && this.ExpiredAppSummary.length != 0) {
                    if (response != undefined && response.length != 0) {
                        response.forEach(element => {
                        this.ExpiredAppSummary.push(element);
                    });
                }
                } else {
                    this.ExpiredAppSummary = response;
                }
            }
        );
    }

    async GetCustGroup(){
      await this.http.post(URLConstant.GetCustDataByAppId, { Id: this.AppId }).toPromise().then(
        async (response) => {
          this.CustNo = response["AppCustObj"]["CustNo"];
          var custObj = {
            CustNo: this.CustNo,
          };

          await this.http.post(URLConstant.GetCustByCustNo, custObj).toPromise().then(
            async (response) => {
              this.CustId = response["CustId"];

              let reqById: GenericObj = new GenericObj();
              reqById.Id = this.CustId;
              
              await this.http.post(URLConstant.GetListCustGrpForCustViewById, reqById).toPromise().then(
                  (response) => {
                    this.GroupObj = [response["ParentCustGrp"], ...response["ChildCustGrp"]]
              });
          });
      })
    }

    GetGrandTotalSummary() {
        if (this.ExstAgrmntSummary != undefined && this.ExstAgrmntSummary.length != 0) {
            var existingAgreementSummary = this.ExstAgrmntSummary;
            existingAgreementSummary.forEach(element => {
                this.TotalNTFSummary += element.NTFAmount;
                this.TotalUnitSummary += element.NumOfAsset;
                this.TotalActiveInstallmentSummary += element.InstAmount;
                this.TotalOSPrincipalSummary += element.OsPrincipal;
                this.TotalARSummary += element.ArAmount;
                this.TotalOSARSummary += element.OsArAmount;
            });
        }
    }

    GetRejectedGrandTotalSummary() {
        if (this.AppRjctSummary != undefined && this.AppRjctSummary.length != 0) {
            this.AppRjctSummary.forEach(element => {
                this.TotalRejectedAssetSummary += element.NumOfAsset;
                this.TotalRejectedPrincipalSummary += element.TotalNTF;
                this.TotalRejectedARSummary += element.TotalAR;
                this.TotalRejectedInstallmentSummary += element.InstAmount;
            });
        }
    }

    GetProcessGrandTotalSummary() {
        if (this.AppPrcsSummary != undefined && this.AppPrcsSummary.length != 0) {
            this.AppPrcsSummary.forEach(element => {
                this.TotalProcessAssetSummary += element.NumOfAsset;
                this.TotalProcessPrincipalSummary += element.TotalNTF;
                this.TotalProcessARSummary += element.TotalAR;
                this.TotalProcessInstallmentSummary += element.InstAmount;
            });
        }
    }

    GetExpiredGrandTotalSummary() {
        if (this.ExpiredAppSummary != undefined && this.ExpiredAppSummary.length != 0) {
          var expiredApp = this.ExpiredAppSummary;
          expiredApp.forEach(element => {
            this.TotalExpiredPrincipalSummary += element.NTFAmount;
            this.TotalExpiredAssetSummary += element.NumOfAsset;
            this.TotalExpiredARSummary += element.ArAmount;
          });
        }
    }
  //#endregion
}




import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { UcviewgenericComponent } from "@adins/ucviewgeneric";
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";

@Component({
  selector: "app-crd-rvw-grp-hist-info-dsf",
  templateUrl: "./crd-rvw-grp-hist-info-dsf.component.html",
})
export class CrdRvwGrpHistInfoDsfComponent implements OnInit {
  private viewGeneric: UcviewgenericComponent;
  whereValue = [];
  @ViewChild("viewGeneric") set content(content: UcviewgenericComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() AppId: number;
  @Input() CustNo: string;

  constructor(
    private http: HttpClient,
    private adInsHelperService: AdInsHelperService
  ) {}

  ngOnInit() {
    this.viewGenericObj.viewInput =
      "./assets/dsf/ucviewgeneric/viewCrdRvwGrpHistInfoDsf.json";
    this.whereValue.push(this.AppId);
    this.viewGenericObj.whereValue = this.whereValue;

    console.log(this.CustNo)
  }

  GetCallBack(ev: any) {
    if (ev.Key == "Customer") {
      var custObj = {
        CustNo: ev.ViewObj.CustNo,
      };
      this.http
        .post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
            this.adInsHelperService.OpenCustomerViewByCustId(
              response["CustId"]
            );
          } else if (
            response["MrCustTypeCode"] == CommonConstant.CustTypeCompany
          ) {
            this.adInsHelperService.OpenCustomerCoyViewByCustId(
              response["CustId"]
            );
          }
        });
    }
  }
}

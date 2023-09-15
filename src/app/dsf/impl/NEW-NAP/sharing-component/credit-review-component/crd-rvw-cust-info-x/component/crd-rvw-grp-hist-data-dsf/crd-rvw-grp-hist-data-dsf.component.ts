import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { URLConstant } from "app/shared/constant/URLConstant";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatTabChangeEvent } from "@angular/material";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: "app-crd-rvw-grp-hist-data-dsf",
  templateUrl: "./crd-rvw-grp-hist-data-dsf.component.html",
  providers: [NGXToastrService],
})
export class CrdRvwGrpHistDataDsfComponent implements OnInit {
  @Input() AppId: number = 0;

  BizTemplateCode: string = "";
  IsViewReady: boolean = false;

  CustNo: any;
  CustId: any;
  GroupObj: any;

  constructor(private http: HttpClient, private toastr: NGXToastrService) {}

  // tabChangeEvent(tabChangeEvent: MatTabChangeEvent) {
  //   if (tabChangeEvent.index == 0) {
  //   }
  // }

  async ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

    this.http
      .post(URLConstant.GetCustDataByAppId, { Id: this.AppId })
      .subscribe((response) => {
        this.CustNo = response["AppCustObj"]["CustNo"];

        var custObj = {
          CustNo: this.CustNo,
        };
        this.http
          .post(URLConstant.GetCustByCustNo, custObj)
          .subscribe((response) => {
            this.CustId = response["CustId"];

            let reqById: GenericObj = new GenericObj();
            reqById.Id = this.CustId;
            this.http
              .post(URLConstant.GetListCustGrpForCustViewById, reqById)
              .subscribe((response) => {
                this.GroupObj = [response["ParentCustGrp"], ...response["ChildCustGrp"]]
                console.log(this.GroupObj)

                this.IsViewReady = true;
              });
          });
      });
  }
}

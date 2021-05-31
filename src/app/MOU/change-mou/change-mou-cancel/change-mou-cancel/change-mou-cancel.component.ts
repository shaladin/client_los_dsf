import { Component, OnInit } from "@angular/core";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ChangeMouCustConfirmCancelObj } from "app/shared/model/ChangeMouCustConfirmCancelObj.Model";
import { CurrentUserContext } from "app/shared/model/CurrentUserContext.model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";

@Component({
  selector: "app-change-mou-cancel",
  templateUrl: "./change-mou-cancel.component.html",
  styleUrls: [],
})
export class ChangeMouCancelComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user: CurrentUserContext;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url =
        "./assets/ucpaging/mou/searchChangeMouCancel.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson =
        "./assets/ucpaging/mou/searchChangeMouCancel.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url,
        },
        {
          name: "CMT.STATUS",
          environment: environment.FoundationR3Url,
        },
      ];
  }

  getEvent(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: event.RowObj.CustNo };
      this.http
        .post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    } else if (event.Key == "cancel") {
      if (confirm("Are you sure to cancel this?")) {
      
        var mouCancel = new ChangeMouCustConfirmCancelObj();
        mouCancel.Status = CommonConstant.MouStatCancel;
        mouCancel.ChangeMouTrxId = event.RowObj.ChangeMouTrxId;
        mouCancel.TrxNo =  event.RowObj.TrxNo;
        mouCancel.WfTaskListId = event.RowObj.WfTaskListId;
        mouCancel.RowVersion = event.RowObj.RowVersions;
        this.http
          .post(URLConstant.EditChangeMouForCancelByChangeMouTrxId, mouCancel)
          .subscribe((response) => {
            this.toastr.successMessage(response["Message"]);
            this.router
              .navigateByUrl("/", { skipLocationChange: true })
              .then(() => {
                this.router.navigate([NavigationConstant.CHANGE_MOU_CANCEL]);
              });
          });
      }
    }
  }
}

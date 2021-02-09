import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { MouCustConfirmCancelObj } from 'app/shared/model/MouCustConfirmCancelObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-cancel',
  templateUrl: './mou-cancel.component.html'
})
export class MouCancelComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user: any;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router, private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode != CommonConstant.HeadOffice) {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/UnauthorizedPage"], {});
      return;
    }
    else {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCancel.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCancel.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        },
        {
          name: "MC.MOU_STAT",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }

  getEvent(event) {
    if (event.Key == "customer") {
      var link: string;
      var custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
    else if (event.Key == "cancel") {
      if (confirm("Are you sure to cancel this?")) {
        var mouCancel = new MouCustConfirmCancelObj;
        mouCancel.MouStat = CommonConstant.MouStatCancel;
        mouCancel.MouCustId = event.RowObj.MouCustId;
        mouCancel.WfTaskListId = event.RowObj.WfTaskListId;
        mouCancel.RowVersion = event.RowObj.RowVersions;
        this.http.post(URLConstant.EditMouForCancelByMouId, mouCancel).subscribe(
          response => {
            this.toastr.successMessage(response["Message"]);
            // this.router.navigate(["/Mou/Cust/Cancel"]);
            // this.router.navigate(["/Mou"]);
            // this.router.navigate(["/Mou/Cust/Cancel"]);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/Mou/Cust/Cancel']);
            });
          }
        );
      }
    }
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { find } from 'core-js/core/array';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-lead-to-be-follow-up-dsf',
  templateUrl: './lead-to-be-follow-up-dsf.component.html',
  styleUrls: ['./lead-to-be-follow-up-dsf.component.css']
})
export class LeadToBeFollowUpDsfComponent implements OnInit {

  ReqByIdObj: GenericObj = new GenericObj();
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustId: string;
  IsReady: boolean = false;
  CurrentUserContext: any;

  constructor(private http: HttpClient, private elRef: ElementRef, private renderer: Renderer2, private cookieService: CookieService) { }

  ngOnInit() {

    // Self Custom Changes:
    this.CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchNewLeadToBeFollowUpDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchNewLeadToBeFollowUpDsf.json";
    this.IsReady = true;
    // End of Self Custom Changes

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "LC.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

  // Self Custom Changes
  ngAfterViewInit(){
    if (this.IsReady)
      {
        if (this.CurrentUserContext.RoleCode == "DPC" && this.CurrentUserContext.OfficeCode == "1000")
        {
          setTimeout(() => {
            const element1 = this.elRef.nativeElement.querySelector('select[data-name="L.ORI_OFFICE_CODE"]');
            if (element1) {
              element1.value = this.CurrentUserContext.OfficeCode;
              this.renderer.setProperty(element1, "hidden", true);
              element1.insertAdjacentHTML('afterend', '<label>' + this.CurrentUserContext.OfficeName + '</label>');
            }
          }, 500);
        }
      }
  }
  // Self Custom Changes

  GetCallBack(ev: any) {
    if (ev.Key == "Edit") {
      // var reqObj = { TrxNo: ev.RowObj.LeadNo };
      // this.http.post(URLConstantDsf.UpdateNotify, reqObj).subscribe(
      //   (response) => {

      //   }
      // )

      this.ReqByIdObj.CustNo = ev.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
        response => {
          this.CustId = response["CustId"];

          if (ev.RowObj.CustType == "PERSONAL")
          {
          AdInsHelper.EditCustomerMainDataXDSFPersonalByCustId(this.CustId, "EditMainDataLeadDsf");
          // AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });
          }
          else
          {
            AdInsHelper.EditCustomerMainDataXDSFCompanyByCustId(this.CustId, "EditMainData");
          }

        }
      );


    }
  }

}

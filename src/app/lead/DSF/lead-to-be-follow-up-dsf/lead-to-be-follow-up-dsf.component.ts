import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ClaimTaskLeadDsf } from 'app/shared/model/claim-task-lead-dsf-obj.model';
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
  ClaimTaskLeadDsf: ClaimTaskLeadDsf = new ClaimTaskLeadDsf();

  constructor(private http: HttpClient, private elRef: ElementRef, private renderer: Renderer2, private cookieService: CookieService, private toastr: NGXToastrService) { }

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
        this.SelfCustomDisableOffice(500);
      }
      this.renderer.listen(this.elRef.nativeElement.querySelector('button[class="btn btn-raised btn-warning mr-1"]'), 'click', (event) => {      
        this.SelfCustomDisableOffice(50);
      });
  }
  // Self Custom Changes
  SelfCustomDisableOffice(timeout) {
    if (this.CurrentUserContext.RoleCode == "DPC" && this.CurrentUserContext.OfficeCode == "1000")
      {
        setTimeout(() => {
          const element1 = this.elRef.nativeElement.querySelector('select[data-name="L.ORI_OFFICE_CODE"]');
          if (element1 && element1.display != 'none') {
            this.renderer.setStyle(element1, "display", "none");
            element1.insertAdjacentHTML('afterend', '<label>ALL</label>');
          }
        }, timeout);
      }
  }


  async GetCallBack(ev: any) {
    if (ev.Key == "Edit") {
      // var reqObj = { TrxNo: ev.RowObj.LeadNo };
      // this.http.post(URLConstantDsf.UpdateNotify, reqObj).subscribe(
      //   (response) => {

      //   }
      // )

      // CR Change Self Custom
      this.ClaimTaskLeadDsf.LeadId = ev.RowObj.LeadId;
      this.ClaimTaskLeadDsf.ActivityName = "NewLeadToBeFollowUpTask";
      this.ClaimTaskLeadDsf.ClaimBy = this.CurrentUserContext.UserName;
      this.ClaimTaskLeadDsf.ClaimDt = this.CurrentUserContext.BusinessDt;
      this.ClaimTaskLeadDsf.ClaimOffice = this.CurrentUserContext.OfficeCode;
      this.ClaimTaskLeadDsf.ClaimRole = this.CurrentUserContext.RoleCode;
      this.ClaimTaskLeadDsf.IsDone = false;
      let IsValid = true;

      await this.http.post(URLConstantDsf.AddClaimTaskLeadDsf, this.ClaimTaskLeadDsf).toPromise().then(
        response => {
          if (1!=1)//response["TaskStatus"] == "OnTask") //Lepas Penjagaan Claim
            {
              this.toastr.warningMessage("User already on another task Lead No: " + response["LeadNoProcessed"]);
              IsValid = false;
              return false;
            }
        }
      )
      // CR Change Self Custom

      if (IsValid)
        {
      this.ReqByIdObj.CustNo = ev.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
        response => {
          this.CustId = response["CustId"];

          if (ev.RowObj.CustType == "PERSONAL")
          {
          AdInsHelper.EditCustomerMainDataXDSFPersonalByCustIdFromLead(this.CustId, "EditMainDataLeadDsf", this.CurrentUserContext.UserName, ev.RowObj.LeadId);
          // AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });
          }
          else
          {
            AdInsHelper.EditCustomerMainDataXDSFCompanyByCustIdFromLead(this.CustId, "EditMainData", this.CurrentUserContext.UserName, ev.RowObj.LeadId);
          }

        }
      );
    }

    }
  }

}

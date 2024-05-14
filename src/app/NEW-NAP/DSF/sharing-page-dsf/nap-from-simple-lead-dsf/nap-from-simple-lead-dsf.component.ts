import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstantDsf } from 'app/shared/constant/ExceptionConstantDsf';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ClaimTaskLeadDsf } from 'app/shared/model/claim-task-lead-dsf-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-nap-from-simple-lead-dsf',
  templateUrl: './nap-from-simple-lead-dsf.component.html',
  styleUrls: ['./nap-from-simple-lead-dsf.component.css']
})
export class NapFromSimpleLeadDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array();
  userAccess: CurrentUserContext;
  BizTemplateCode: string;
  IsReady: boolean = false;
  ClaimTaskLeadDsf: ClaimTaskLeadDsf = new ClaimTaskLeadDsf();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private elRef: ElementRef, 
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchAppFromSimpleLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppFromSimpleLead.json";

    if(environment.isCore){

      // Self Custom Changes
      this.inputPagingObj._url="./assets/dsf/ucpaging/V2/searchAppFromSimpleLeadV2Dsf.json";
      this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/V2/searchAppFromSimpleLeadV2Dsf.json";
      this.IsReady = true;
      // End Self Custom Changes

    }

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "RO.OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.losUrl + "/v1"
      }
    ];
  }

   // Self Custom Changes
   ngAfterViewInit(){
    if (this.IsReady)
      {
        if (this.userAccess.RoleCode == "DPC" && this.userAccess.OfficeCode == "1000")
        {
          setTimeout(() => {
            const element1 = this.elRef.nativeElement.querySelector('select[data-name="RO.OFFICE_CODE"]');
            if (element1) {
              //element1.value = this.userAccess.OfficeCode;
              this.renderer.setStyle(element1, "display", "none");
              element1.insertAdjacentHTML('afterend', '<label>ALL</label>');
            }
          }, 500);
        }
      }
  }
  // Self Custom Changes

  async AddApp(ev){
    // CR Change Self Custom
    this.ClaimTaskLeadDsf.LeadId = ev.RowObj.LeadId;
    this.ClaimTaskLeadDsf.ActivityName = "NAPFromSimpleLeadTask";
    this.ClaimTaskLeadDsf.ClaimBy = this.userAccess.UserName;
    this.ClaimTaskLeadDsf.ClaimDt = this.userAccess.BusinessDt;
    this.ClaimTaskLeadDsf.ClaimOffice = this.userAccess.OfficeCode;
    this.ClaimTaskLeadDsf.ClaimRole = this.userAccess.RoleCode;
    this.ClaimTaskLeadDsf.IsDone = false;
    let IsValid = true;

    await this.http.post(URLConstantDsf.AddClaimTaskLeadDsf, this.ClaimTaskLeadDsf).toPromise().then(
      response => {
        if (response["TaskStatus"] == "OnTask")
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
    await this.http.post(URLConstant.GetRefOfficeByOfficeCode, {Code: this.userAccess.OfficeCode}).toPromise().then(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.NAP_SHARING_FROM_SIMPLE_LEAD_DETAIL], { "LeadId": ev.RowObj.LeadId});
        }else{
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
    }
  }

}

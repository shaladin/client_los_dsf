import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CustObj } from 'app/shared/model/cust-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-customer-request',
  templateUrl: './mou-customer-request.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class MouCustomerRequestComponent implements OnInit, OnDestroy {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  user: CurrentUserContext;
  MrMouTypeCode: string;
  isReady: boolean = false;
  navigationSubscription;

  readonly AddLink: string = NavigationConstant.MOU_REQ_DETAIL;
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) { 
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["MrMouTypeCode"] != null) {
        this.MrMouTypeCode = params["MrMouTypeCode"];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchMouCustomerRequest.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustomerRequest.json";
    this.inputPagingObj.addCritInput = new Array();

    let addCritMouType = new CriteriaObj();
    addCritMouType.DataType = "text";
    addCritMouType.propName = "M.MR_MOU_TYPE_CODE";
    addCritMouType.restriction = AdInsConstant.RestrictionEq;
    addCritMouType.value = this.MrMouTypeCode;
    this.inputPagingObj.addCritInput.push(addCritMouType);
  }

  customerView(ev) {
    this.CustNoObj.CustNo = ev.RowObj.CustNo;
    this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
      (response) => {
        if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
          this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
        }
        if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
          this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
        }
      });
  }
}

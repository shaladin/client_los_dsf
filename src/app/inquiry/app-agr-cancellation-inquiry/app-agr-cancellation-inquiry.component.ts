
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

@Component({
  selector: 'app-app-agr-cancellation-inquiry',
  templateUrl: './app-agr-cancellation-inquiry.component.html'
})
export class AppAgrCancellationInquiryComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;
  
  constructor(private route: ActivatedRoute, private router: Router) {
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
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }});
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging(){
    this.InputPagingObj._url = "./assets/ucpaging/searchAppAgrCancellationInquiry.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/searchAppAgrCancellationInquiry.json";
    
    this.InputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'AP.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.InputPagingObj.addCritInput.push(critLobObj);
  }

  getEvent(event) {
    if(event.Key == "agreement"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if(event.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
  }
}

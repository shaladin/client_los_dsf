import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-prod-ho-add-detail',
  templateUrl: './prod-ho-add-detail.component.html'
})
export class ProdHoAddDetailComponent implements OnInit {
  ProdId: number;
  ProdHId: number;
  Source: string = "";
  Type: string;
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.ProdHId = params["ProdHId"];
      this.ProdId = params["ProdId"];
      this.Source = params["source"];
    })
  }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    if(this.Source == "return")
    {
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformationReturn.json";
    }
    else{
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";
    }
    this.ViewGenericObj.whereValue.push(this.ProdHId);
  }

  EnterTab(type: string) {
    this.Type = type;
  }
}

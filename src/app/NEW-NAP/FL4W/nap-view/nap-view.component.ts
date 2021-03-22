import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-nap-view',
  templateUrl: './nap-view.component.html',
  styles: []
})
export class NapViewComponent implements OnInit {
  AppId: number;

  BizTemplateCode: string;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;

  IsGuarantor: boolean = true;
  IsCustomer: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetAppCust();
    if (this.BizTemplateCode == CommonConstant.FCTR) {
      this.IsCustomer = true;
      this.IsGuarantor = false;
    }
    else if (this.BizTemplateCode == CommonConstant.CFRFN4W) {

    }
    else if (this.BizTemplateCode == CommonConstant.CF4W) {

    }
    else if (this.BizTemplateCode == CommonConstant.FL4W) {

    }
  }

  GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        this.AppCustObj = response;
        this.CustType = this.AppCustObj.MrCustTypeCode;
      }
    );
  }
}
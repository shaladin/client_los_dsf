import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from '../../../shared/AdInstConstant';

@Component({
  selector: 'app-nap-view',
  templateUrl: './nap-view.component.html',
  styles: []
})
export class NapViewComponent implements OnInit {
  AppId: number;
  
  BizTemplateCode : string;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;

  IsGuarantor : boolean = true;
  IsCustomer : boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetAppCust();
    if(this.BizTemplateCode==AdInsConstant.FCTR)
    {
      this.IsCustomer= true;
      this.IsGuarantor = false;
    }
    else if(this.BizTemplateCode==AdInsConstant.CFRFN4W){

    }
    else if(this.BizTemplateCode==AdInsConstant.CF4W){

    }
    else if(this.BizTemplateCode==AdInsConstant.FL4W)
    {

    }
  }

  GetAppCust() {
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(AdInsConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        this.AppCustObj = response;
        console.log(response);
        this.CustType = this.AppCustObj.MrCustTypeCode;
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from '../../../shared/AdInstConstant';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: []
})
export class ApplicationViewComponent implements OnInit {
  AppId: number;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetAppCust();
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

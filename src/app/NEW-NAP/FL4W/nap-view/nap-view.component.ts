import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';

@Component({
  selector: 'app-nap-view',
  templateUrl: './nap-view.component.html',
  styles: []
})
export class NapViewComponent implements OnInit {
  arrValue = []; 
  appId: number;
  appCustData: AppCustObj;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
    });
  }

  ngOnInit() {
    this.httpClient.post(AdInsConstant.GetAppCustByAppId, { AppId: this.appId }).subscribe(
      (response: AppCustObj) => {
        this.appCustData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

}

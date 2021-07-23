import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-cust-app-list-view',
  templateUrl: './cust-app-list-view.component.html',
  styleUrls: []
})
export class CustAppListViewComponent implements OnInit {

  CustNo: string = '';
  isReady: boolean = false;
  AppList: Array<any> = new Array<any>();

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["CustNo"] != null) {
        this.CustNo = params["CustNo"];
      }
    });
  }

  async ngOnInit() {
    await this.SetAppList();
    this.isReady = true;
  }

  async SetAppList() {
    await this.http.post(URLConstant.GetAppListForCustView, {CustNo: this.CustNo}).toPromise().then(
      (response) => {
        if(response[CommonConstant.ReturnObj] != null) {
          this.AppList = response[CommonConstant.ReturnObj];
        }
      }
    );
  }

}

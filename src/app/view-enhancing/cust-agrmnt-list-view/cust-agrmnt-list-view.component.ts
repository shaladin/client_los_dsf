import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-cust-agrmnt-list-view',
  templateUrl: './cust-agrmnt-list-view.component.html',
  styleUrls: []
})
export class CustAgrmntListViewComponent implements OnInit {

  CustNo: string = '';
  isReady: boolean = false;
  AgrmntList: Array<any> = new Array<any>();

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
    await this.http.post(URLConstant.GetAgrmntListForCustView, {CustNo: this.CustNo}).toPromise().then(
      (response) => {
        if(response[CommonConstant.ReturnObj] != null) {
          this.AgrmntList = response[CommonConstant.ReturnObj];
        }
      }
    );
  }

}

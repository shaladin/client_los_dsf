import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
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
  EmbeddOptions;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["CustNo"] != null) {
        this.CustNo = params["CustNo"];
      }
      if (params["IsEmbedded"] != null && params["Token"] != null) {
        const embeddHeaders = new HttpHeaders({
          'AdInsKey': params["Token"]
        });
        this.EmbeddOptions = { headers: embeddHeaders, withCredentials: true };
      }
    });
  }

  async ngOnInit() {
    await this.SetAppList();
    this.isReady = true;
  }

  async SetAppList() {
    await this.http.post(URLConstant.GetAgrmntListForCustView, {CustNo: this.CustNo}, this.EmbeddOptions).toPromise().then(
      (response) => {
        if(response[CommonConstant.ReturnObj] != null) {
          this.AgrmntList = response[CommonConstant.ReturnObj];
        }
      }
    );
  }

  appNoHandler(event) {
    AdInsHelper.OpenAppViewByAppId(event.AppId);
  }

  agrmntNoHandler(event) {
    AdInsHelper.OpenAgrmntViewByAgrmntId(event.AgrmntId);
  }

}

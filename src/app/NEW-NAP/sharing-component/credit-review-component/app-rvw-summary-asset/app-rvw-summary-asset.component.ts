import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAssetObj } from 'app/shared/model/CreditReview/CrdRvwAssetObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';

@Component({
  selector: 'app-app-rvw-summary-asset',
  templateUrl: './app-rvw-summary-asset.component.html',
  styleUrls: ['./app-rvw-summary-asset.component.scss']
})
export class AppRvwSummaryAssetComponent implements OnInit {

  @Input() AppId: number = 0;

  appRvwSummaryAsset: any;
  isReady: boolean = false;
  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    await this.GetAppRvwSummaryAsset()
  }

  async GetAppRvwSummaryAsset() {
    await this.http.post(URLConstant.GetAppRvwSummaryAsset, { AppId: this.AppId }).toPromise().then(
      (response) => {
        this.appRvwSummaryAsset = response;
        this.isReady = true;
      }
    );
  }
}

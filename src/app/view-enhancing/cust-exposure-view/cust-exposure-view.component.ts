import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwExposureDObj } from 'app/shared/model/CreditReview/CrdRvwExposureDObj.Model';
import { CrdRvwExposureHObj } from 'app/shared/model/CreditReview/CrdRvwExposureHObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';

@Component({
  selector: 'app-cust-exposure-view',
  templateUrl: './cust-exposure-view.component.html',
  styleUrls: ['./cust-exposure-view.component.scss']
})
export class CustExposureViewComponent implements OnInit {

  appId: number = 0;
  IsReady: boolean = false;
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  //#region Exposure Type
  readonly ExposureCustTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureCustGroupTypeCode: string = CommonConstant.ExposureCustGroupTypeCode;
  readonly ExposureObligorTypeCode: string = CommonConstant.ExposureObligorTypeCode;
  //#endregion

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
    });
  }

  async ngOnInit() {
    await this.GetCrdRvwCustInfoByAppId();
    await this.GetListCrdRvwExposureByCrdRvwCustInfoId();
    this.IsReady = true;
  }

  //#region Get Data
  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { AppId: this.appId }).toPromise().then(
      (response) => {
        console.log(response);
        this.crdRvwCustInfoObj = response;
      }
    );
  }
  
  CrdRvwExposureHObj: CrdRvwExposureHObj = new CrdRvwExposureHObj();
  async GetListCrdRvwExposureByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwExposureHObj>(URLConstant.GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, RelationType: "SELF_CUST" }).toPromise().then(
      (response) => {
        this.CrdRvwExposureHObj = response;
      }
    );
  }
  //#endregion

}

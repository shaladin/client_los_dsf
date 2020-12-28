import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
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
  readonly ExposureCustGroupTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureObligorTypeCode: string = CommonConstant.ExposureCustTypeCode;
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
  
  CustCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  CustGroupCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  ObligorCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  async GetListCrdRvwExposureByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwExposureObj: Array<CrdRvwExposureObj> }>(URLConstant.GetListCrdRvwExposureByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        for (let index = 0; index < response.ListCrdRvwExposureObj.length; index++) {
          const element = response.ListCrdRvwExposureObj[index];
          if (element.ExposureType == this.ExposureCustTypeCode) {
            this.CustCrdRvwExposureObj = element;
          }
          if (element.ExposureType == this.ExposureCustGroupTypeCode) {
            this.CustGroupCrdRvwExposureObj = element;
          }
          if (element.ExposureType == this.ExposureObligorTypeCode) {
            this.ObligorCrdRvwExposureObj = element;
          }
        }
      }
    );
  }
  //#endregion

}

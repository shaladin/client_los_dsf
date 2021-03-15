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

  CrdRvwExposureHId: number = 0;
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
      if (params["CrdRvwExposureHId"] != null) {
        this.CrdRvwExposureHId = params["CrdRvwExposureHId"];
      }
    });
  }

  async ngOnInit() {
    await this.GetCrdRvwExposureHandDByCrdRvwExposureHId();
    this.IsReady = true;
  }

  //#region Get Data  
  CrdRvwExposureHObj: CrdRvwExposureHObj = new CrdRvwExposureHObj();
  async GetCrdRvwExposureHandDByCrdRvwExposureHId() {
    await this.http.post<CrdRvwExposureHObj>(URLConstant.GetCrdRvwExposureHandDByCrdRvwExposureHId, { CrdRvwExposureHId: this.CrdRvwExposureHId }).toPromise().then(
      (response) => {
        this.CrdRvwExposureHObj = response;
      }
    );
  }
  //#endregion

}

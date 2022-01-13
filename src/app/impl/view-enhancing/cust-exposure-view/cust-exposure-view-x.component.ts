import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwExposureHObj } from 'app/shared/model/credit-review/crd-rvw-exposure-h-obj.model';

@Component({
  selector: 'app-cust-exposure-view-x',
  templateUrl: './cust-exposure-view-x.component.html'
})
export class CustExposureViewXComponent implements OnInit {

  CrdRvwExposureHId: number = 0;
  IsReady: boolean = false;
  CustNo: string = "";
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
    await this.http.post<CrdRvwExposureHObj>(URLConstant.GetCrdRvwExposureHandDByCrdRvwExposureHId, { Id: this.CrdRvwExposureHId }).toPromise().then(
      (response) => {
        this.CrdRvwExposureHObj = response;
        this.CustNo = this.CrdRvwExposureHObj.CustNo;
      }
    );
  }
  //#endregion

}

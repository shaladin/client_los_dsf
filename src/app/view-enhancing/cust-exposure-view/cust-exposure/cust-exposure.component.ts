import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppAgrHistObj } from 'app/shared/model/CreditReview/CrdRvwAppAgrHistObj.Model';
import { CrdRvwCustBucketObj } from 'app/shared/model/CreditReview/CrdRvwCustBucketObj.Model';
import { CrdRvwExposureDObj } from 'app/shared/model/CreditReview/CrdRvwExposureDObj.Model';
import { CrdRvwExposureHObj } from 'app/shared/model/CreditReview/CrdRvwExposureHObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';

@Component({
  selector: 'app-cust-exposure',
  templateUrl: './cust-exposure.component.html',
  styleUrls: ['./cust-exposure.component.scss']
})
export class CustExposureComponent implements OnInit {

  @Input() exposureHObj: CrdRvwExposureHObj = new CrdRvwExposureHObj();
  @Input() exposureType: string = CommonConstant.ExposureCustTypeCode;

  //#region Role Type
  readonly RoleCust: string = CommonConstant.RoleCustData;
  readonly RoleFam: string = CommonConstant.RoleFamilyData;
  readonly RoleGuarantor: string = CommonConstant.RoleGuarantorData;
  readonly RoleShareholder: string = CommonConstant.RoleShareholder;
  //#endregion

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder
  ) { }

  ExposureDObj: CrdRvwExposureDObj = new CrdRvwExposureDObj();
  IsReady: boolean = false;
  async ngOnInit() {
    this.SetExposureDObj();
    await this.GetListCrdRvwCustBucketByCrdRvwExposureDId();
    await this.GetListCrdRvwAppAgrHistByCrdRvwExposureHId();
    this.IsReady = true;
  }

  SetExposureDObj() {
    if (this.exposureHObj.ListCrdRvwExposureDObj.length > 0) {
      let tempObj: CrdRvwExposureDObj = this.exposureHObj.ListCrdRvwExposureDObj.find(x => x.ExposureType == this.exposureType);
      if (tempObj != null) {
        this.ExposureDObj = tempObj;
      }
    }
  }

  ListCrdRvwCustBucketObj: Array<CrdRvwCustBucketObj> = new Array<CrdRvwCustBucketObj>();
  async GetListCrdRvwCustBucketByCrdRvwExposureDId() {
    await this.http.post<{ ListCrdRvwCustBucketObj: Array<CrdRvwCustBucketObj> }>(URLConstant.GetListCrdRvwCustBucketByCrdRvwExposureDId, { CrdRvwExposureDId: this.ExposureDObj.CrdRvwExposureDId }).toPromise().then(
      (response) => {
        console.log(response);
        this.ListCrdRvwCustBucketObj = response.ListCrdRvwCustBucketObj;
      }
    );
  }

  ListCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();
  async GetListCrdRvwAppAgrHistByCrdRvwExposureHId() {
    await this.http.post<{ ListCrdRvwAppAgrHistObj: Array<CrdRvwAppAgrHistObj> }>(URLConstant.GetListCrdRvwAppAgrHistByCrdRvwExposureHId, { CrdRvwExposureHId: this.exposureHObj.CrdRvwExposureHId }).toPromise().then(
      (response) => {
        // console.log(response);
        for (let index = 0; index < response.ListCrdRvwAppAgrHistObj.length; index++) {
          const element = response.ListCrdRvwAppAgrHistObj[index];
          if (element.RoleCust == this.RoleCust) {
            this.ListCrdRvwAppAgrHist.push(element);
          }
        }
      }
    );
  }

}

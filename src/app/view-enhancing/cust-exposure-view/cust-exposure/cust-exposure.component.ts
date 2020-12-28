import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppAgrHistObj } from 'app/shared/model/CreditReview/CrdRvwAppAgrHistObj.Model';
import { CrdRvwCustBucketObj } from 'app/shared/model/CreditReview/CrdRvwCustBucketObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';

@Component({
  selector: 'app-cust-exposure',
  templateUrl: './cust-exposure.component.html',
  styleUrls: ['./cust-exposure.component.scss']
})
export class CustExposureComponent implements OnInit {

  @Input() exposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder
  ) { }

  async ngOnInit() {
    await this.GetListCrdRvwCustBucketByCrdRvwExposureId();
    await this.GetListCrdRvwAppAgrHistByCrdRvwExposureId();
  }

  ListCrdRvwCustBucketObj: Array<CrdRvwCustBucketObj> = new Array<CrdRvwCustBucketObj>();
  async GetListCrdRvwCustBucketByCrdRvwExposureId() {
    await this.http.post<{ ListCrdRvwCustBucketObj: Array<CrdRvwCustBucketObj> }>(URLConstant.GetListCrdRvwCustBucketByCrdRvwExposureId, { CrdRvwExposureId: this.exposureObj.CrdRvwExposureId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwCustBucketObj = response.ListCrdRvwCustBucketObj;
      }
    );
  }

  ListCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();
  async GetListCrdRvwAppAgrHistByCrdRvwExposureId() {
    await this.http.post<{ ListCrdRvwAppAgrHistObj: Array<CrdRvwAppAgrHistObj> }>(URLConstant.GetListCrdRvwAppAgrHistByCrdRvwExposureId, { CrdRvwExposureId: this.exposureObj.CrdRvwExposureId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwAppAgrHist = response.ListCrdRvwAppAgrHistObj;
      }
    );
  }

}

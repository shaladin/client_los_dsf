import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';

@Component({
  selector: 'app-crd-rvw-cust-info',
  templateUrl: './crd-rvw-cust-info.component.html',
  styleUrls: ['./crd-rvw-cust-info.component.scss']
})
export class CrdRvwCustInfoComponent implements OnInit {

  @Input() appId: number = 0;
  @Output() ResultCrdRvwCustInfoObj: EventEmitter<CrdRvwCustInfoObj> = new EventEmitter<CrdRvwCustInfoObj>();

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router) { }

  async ngOnInit() {
    console.log(this.appId);
    this.crdRvwCustInfoObj.AppId = this.appId;
    // await this.GetCrdRvwCustInfoByAppId();

    this.ResultCrdRvwCustInfoObj.emit(this.crdRvwCustInfoObj);
  }

  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { AppId: this.appId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.crdRvwCustInfoObj = response;
      }
    );
  }
  
  ClickLinkViewCustExposure(){
    AdInsHelper.OpenCustExposureViewByCrdRvwCustInfoId(this.appId);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppAgrHistObj } from 'app/shared/model/credit-review/crd-rvw-app-agr-hist-obj.model';
import { CrdRvwCustBucketObj } from 'app/shared/model/credit-review/crd-rvw-cust-bucket-obj.model';
import { CrdRvwExposureDObj } from 'app/shared/model/credit-review/crd-rvw-exposure-d-obj.model';
import { CrdRvwExposureHObj } from 'app/shared/model/credit-review/crd-rvw-exposure-h-obj.model';

@Component({
  selector: 'app-cust-exposure-x',
  templateUrl: './cust-exposure-x.component.html'
})
export class CustExposureXComponent implements OnInit {

  @Input() exposureHObj: CrdRvwExposureHObj = new CrdRvwExposureHObj();
  @Input() exposureType: string = CommonConstant.ExposureCustTypeCode;
  @Input() CustNo: string = "";

  //#region Role Type
  readonly RoleCust: string = CommonConstant.RoleCustData;
  readonly RoleFam: string = CommonConstant.RoleFamilyData;
  readonly RoleGuarantor: string = CommonConstant.RoleGuarantorData;
  readonly RoleShareholder: string = CommonConstant.RoleShareholder;
  //#endregion

  TotalInstallmentDsf: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder
  ) { }

  ExposureDObj: CrdRvwExposureDObj = new CrdRvwExposureDObj();
  IsReady: boolean = false;
  async ngOnInit() {
    this.SetExposureDObj();
    this.GetTotalMonthlyInstallmentDSF();
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
    await this.http.post<{ ListCrdRvwCustBucketObj: Array<CrdRvwCustBucketObj> }>(URLConstant.GetListCrdRvwCustBucketByCrdRvwExposureDId, { Id: this.ExposureDObj.CrdRvwExposureDId }).toPromise().then(
      (response) => {
        this.ListCrdRvwCustBucketObj = response.ListCrdRvwCustBucketObj;
      }
    );
  }

  ListCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();
  async GetListCrdRvwAppAgrHistByCrdRvwExposureHId() {
    await this.http.post<{ ListCrdRvwAppAgrHistObj: Array<CrdRvwAppAgrHistObj> }>(URLConstant.GetListCrdRvwAppAgrHistByCrdRvwExposureHId, { Id: this.exposureHObj.CrdRvwExposureHId }).toPromise().then(
      (response) => {
        for (let index = 0; index < response.ListCrdRvwAppAgrHistObj.length; index++) {
          const element = response.ListCrdRvwAppAgrHistObj[index];
          if (element.RoleCust == this.RoleCust) {
            this.ListCrdRvwAppAgrHist.push(element);
          }
        }
      }
    );
  }

  GetTotalMonthlyInstallmentDSF(){
    if(this.CustNo != ""){
      let getExposureR2Url = "";
      if(this.exposureType == CommonConstant.ExposureCustTypeCode){
        getExposureR2Url = URLConstantX.GetR2CustExposureByCustNo;
      }
      else if(this.exposureType == CommonConstant.ExposureCustGroupTypeCode){
        getExposureR2Url = URLConstantX.GetR2CustGroupExposureByCustNo;
      }
      if(getExposureR2Url != ""){
        this.http.post<any>(getExposureR2Url, { Code : this.CustNo }).subscribe(
          (response) => {
            this.TotalInstallmentDsf = response.TotalInstAmount;
          }
        );
      }
    }
  }
}

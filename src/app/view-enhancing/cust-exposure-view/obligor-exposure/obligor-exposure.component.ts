import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppAgrHistObj } from 'app/shared/model/CreditReview/CrdRvwAppAgrHistObj.Model';
import { CrdRvwCustBucketObj } from 'app/shared/model/CreditReview/CrdRvwCustBucketObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';

@Component({
  selector: 'app-obligor-exposure',
  templateUrl: './obligor-exposure.component.html',
  styleUrls: ['./obligor-exposure.component.scss']
})
export class ObligorExposureComponent implements OnInit {

  @Input() exposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  
  SummaryData: {
    CustomerExposureAmt: number,
    FamilyExposureAmt: number,
    GuarantorExposureAmt: number,
    ShareholderExposureAmt: number,
    ObligorExposureAmt: number,
  };
  
  //#region Role Type
  readonly RoleCust: string = CommonConstant.RoleCustData;
  readonly RoleFam: string = CommonConstant.RoleFamilyData;
  readonly RoleGuarantor: string = CommonConstant.RoleGuarantorData;
  readonly RoleShareholder: string = CommonConstant.RoleShareholder;
  //#endregion

  constructor(
    // private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.initSummaryData();
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

  ListCustDataCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();
  ListFamilyDataCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();
  ListGuarantorDataCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();
  ListShareholderDataCrdRvwAppAgrHist: Array<CrdRvwAppAgrHistObj> = new Array<CrdRvwAppAgrHistObj>();

  initSummaryData() {
    this.SummaryData = {
      CustomerExposureAmt: 0,
      FamilyExposureAmt: 0,
      GuarantorExposureAmt: 0,
      ShareholderExposureAmt: 0,
      ObligorExposureAmt: 0,
    };
  }

  async GetListCrdRvwAppAgrHistByCrdRvwExposureId() {
    await this.http.post<{ ListCrdRvwAppAgrHistObj: Array<CrdRvwAppAgrHistObj> }>(URLConstant.GetListCrdRvwAppAgrHistByCrdRvwExposureId, { CrdRvwExposureId: this.exposureObj.CrdRvwExposureId }).toPromise().then(
      (response) => {
        // console.log(response);
        for (let index = 0; index < response.ListCrdRvwAppAgrHistObj.length; index++) {
          const element = response.ListCrdRvwAppAgrHistObj[index];
          if (element.RoleCust == this.RoleCust) {
            this.ListCustDataCrdRvwAppAgrHist.push(element);
            this.SummaryData.CustomerExposureAmt += element.OsPrincipal;
          }
          else if (element.RoleCust == this.RoleFam) {
            this.ListFamilyDataCrdRvwAppAgrHist.push(element);
            this.SummaryData.FamilyExposureAmt += element.OsPrincipal;
          }
          else if (element.RoleCust == this.RoleGuarantor) {
            this.ListGuarantorDataCrdRvwAppAgrHist.push(element);
            this.SummaryData.GuarantorExposureAmt += element.OsPrincipal;
          }
          else if (element.RoleCust == this.RoleShareholder) {
            this.ListShareholderDataCrdRvwAppAgrHist.push(element);
            this.SummaryData.ShareholderExposureAmt += element.OsPrincipal;
          }
          this.SummaryData.ObligorExposureAmt += element.OsPrincipal;
        }
      }
    );
  }
}

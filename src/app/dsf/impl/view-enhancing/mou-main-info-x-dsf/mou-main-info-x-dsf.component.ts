import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ResMouMainInfoObjX } from 'app/impl/shared/model/Response/MOU/ResMouMainInfoObjX.model';
import { Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ResMouMainInfoObjXDsf } from 'app/impl/shared/model/Response/MOU/ResMouMainInfoObjXDsf.model';
import { RequestMouCustDsfObj } from 'app/shared/model/req-mou-cust-dsf-obj.model';

@Component({
  selector: 'app-mou-main-info-x-dsf',
  templateUrl: './mou-main-info-x-dsf.component.html'
})
export class MouMainInfoXDsfComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number = 0;
  MouCustObj: MouCustObj = new MouCustObj();
  CustNoObj: GenericObj = new GenericObj();
  MouMainInfo: ResMouMainInfoObjX = new ResMouMainInfoObjX();
  ReqMouCustDsfObj: RequestMouCustDsfObj = new RequestMouCustDsfObj();

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService) {
  }

//   CR Self Custom Change
  async ngOnInit() {
    await this.ReloadUcViewGeneric();
  }

  async ReloadUcViewGeneric() {

    if (this.ChangeMouTrxId == 0) {
      await this.http.post<ResMouMainInfoObjX>(URLConstantX.GetMouMainInfoByIdX, { Id: this.MouCustId }).toPromise().then(
        (response) => {
          this.MouMainInfo = response;
          if (this.MouMainInfo.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOAMT) {
            this.MouMainInfo.PlafondType = 'Base On Amount'
          } else {
            this.MouMainInfo.PlafondType = 'Base On Collateral'
          }

          if (this.MouMainInfo.IsWarning === true) {
            this.toastr.warningMessage(this.MouMainInfo.WarningMsg);
          }

          console.log(response);
        });
        
      //   CR Self Custom Change
      if (this.MouMainInfo.MouType == "FACTORING")
      {
        await this.http.post(URLConstantDsf.CheckVendorGradingFactoringXDsf, { Id: this.MouCustId }).toPromise().then(
          (response) => {
              if (response["IsVendorAvailable"] && response["DealerRating"] == 0)
                {
                  this.toastr.warningMessage("Dealer Grading doesn't have in rule file");
                }
          }
        )
      }
      this.ReqMouCustDsfObj = new RequestMouCustDsfObj();
      this.ReqMouCustDsfObj.MouCustId = this.MouCustId;
      this.ReqMouCustDsfObj.ChangeMouCustId = this.ChangeMouTrxId;
      await this.http.post<ResMouMainInfoObjXDsf>(URLConstantDsf.GetMouMainInfoByIdXDsf, this.ReqMouCustDsfObj).toPromise().then(
        (response) => {
            if (response.PlafondCollateralAmt > 0) 
              {
                this.MouMainInfo.PlafondCollateralAmt = response.PlafondCollateralAmt;
                this.MouMainInfo.OsPlafondAmt = response.OSPlafondAmt;
              }
        }
      )
      //   CR Self Custom Change

    } else {
      await this.http.post<ResMouMainInfoObjX>(URLConstantX.GetChangeMouMainInfoByIdX, { Id: this.ChangeMouTrxId }).toPromise().then(
        (response) => {
          this.MouMainInfo = response;
          if (this.MouMainInfo.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOAMT) {
            this.MouMainInfo.PlafondType = 'Base On Amount'
          } else {
            this.MouMainInfo.PlafondType = 'Base On Collateral'
          }

          if (this.MouMainInfo.IsWarning === true) {
            this.toastr.warningMessage(this.MouMainInfo.WarningMsg);
          }

          console.log(response);
        });

        //   CR Self Custom Change
        if (this.MouMainInfo.MouType == "FACTORING")
          {
            await this.http.post(URLConstantDsf.CheckVendorGradingFactoringXDsf, { Id: this.MouCustId }).toPromise().then(
              (response) => {
                  if (response["IsVendorAvailable"] && response["DealerRating"] == 0)
                    {
                      this.toastr.warningMessage("Dealer Grading doesn't have in rule file");
                    }
              }
            )
          }
          
        this.ReqMouCustDsfObj = new RequestMouCustDsfObj();
        this.ReqMouCustDsfObj.MouCustId = this.MouCustId;
        this.ReqMouCustDsfObj.ChangeMouCustId = this.ChangeMouTrxId;
        await this.http.post<ResMouMainInfoObjXDsf>(URLConstantDsf.GetMouMainInfoByIdXDsf, this.ReqMouCustDsfObj).toPromise().then(
          (response) => {
              if (response.PlafondCollateralAmt > 0) 
                {
                  this.MouMainInfo.PlafondCollateralAmt = response.PlafondCollateralAmt;
                  this.MouMainInfo.OsPlafondAmt = response.OSPlafondAmt;
                }
          }
        )
        //   CR Self Custom Change
    }

  }
//   CR Self Custom Change

  ViewMou() {
    AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
  }

  ViewCust() {
    if (!this.MouMainInfo.IsExistingCust) {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
    } else {
      this.CustNoObj.CustNo = this.MouMainInfo.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        responseCust => {
          if (responseCust['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(responseCust['CustId']);
          }

          if (responseCust['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(responseCust['CustId']);
          }
        });
    }
  }
}

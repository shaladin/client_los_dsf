import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-cust-sync',
  templateUrl: './cust-sync.component.html',
  styles: []
})
export class CustSyncComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  BizTemplateCode: string;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustSync.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustSync.json";
    this.inputPagingObj.addCritInput = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critObj);
  }

  GetCallBack(e: any) {
    if (e.Key == "Sync") {
      if(confirm("Are You Sure To Sync This Data ?")){
        let reqObj;
        if(e.RowObj.AgrmntId){
          reqObj = {
            AppId: e.RowObj.AppId,
            AgrmntId: e.RowObj.AgrmntId,
            CustNo: e.RowObj.CustNo
          }
        }else{
          reqObj = {
            AppId: e.RowObj.AppId,
            CustNo: e.RowObj.CustNo
          }
        }
        this.http.post(URLConstantX.SyncAppCustWithCustFOU, reqObj).pipe(
          map((response) => {
            return response;
          }),
          mergeMap((response) => {
            return this.http.post(URLConstantX.SyncAppCustWithCustFOUSecondary, { AppId: e.RowObj.AppId, CustNo: e.RowObj.CustNo });
          })
        ).toPromise().then(
          async (response) => {
            if(response["StatusCode"] == 200){
              await this.checkAppCustCompletion(e.RowObj.AppCustId);
              this.toastr.successMessage("Data Synced Successfully");
            }
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
      }
    }
    else if(e.Key == "ViewCust"){
      this.CustNoObj.CustNo = e.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

  async checkAppCustCompletion(appCustId: number) {
    await this.http.post(URLConstantX.SaveAppCustCompletion, {Id: appCustId}).toPromise().then(
      response => {
      }
    );
  }
}

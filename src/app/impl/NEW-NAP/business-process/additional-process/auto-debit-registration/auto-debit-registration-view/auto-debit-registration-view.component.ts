import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AutoDebitRegistrationObj } from 'app/impl/shared/model/auto-debit-registration/AutoDebitRegistrationObj.model';
import { StgAutoDebitRegisLogObj } from 'app/impl/shared/model/auto-debit-registration/StgAutoDebitRegisLogObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-auto-debit-registration-view',
  templateUrl: './auto-debit-registration-view.component.html'
})
export class AutoDebitRegistrationViewComponent implements OnInit {

  AutoDebitRegistrationId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  autoDebitRegistrationObj: AutoDebitRegistrationObj = new AutoDebitRegistrationObj();
  cancelDt: string = "";
  listReason: Array<KeyValueObj> = new Array();
  reason: string = "";
  listStgAutoDebitRegisLog: Array<StgAutoDebitRegisLogObj> = new Array();
  RefStats: Array<KeyValueObj> = new Array();

  readonly Cancel = CommonConstantX.AUTO_DEBIT_STATUS_CAN;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private adInsHelperService: AdInsHelperService
  ) {
    this.route.queryParams.subscribe(
      (params) => {
        if(params["AutoDebitRegistrationId"] != 0)
        {
          this.AutoDebitRegistrationId = params["AutoDebitRegistrationId"];
        }
      }
    )
   }

  async ngOnInit(): Promise<void> {
    this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAutoDebitRegistration.json"
    
    await this.GetRefStatusByStatusGrpCode();
    await this.GetAutoDebitRegistrationById();
  }

  async GetRefStatusByStatusGrpCode()
  {
    await this.http.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, {Code : CommonConstantX.REF_STATUS_AUTO_DEBIT_REG}).toPromise().then(
      (response) => {
        this.RefStats = response[CommonConstant.ReturnObj];
      }
    )
  }

  async GetAutoDebitRegistrationById()
  {
    await this.http.post(URLConstantX.GetAutoDebitRegistrationById, {Id: this.AutoDebitRegistrationId}).toPromise().then(
      (response: AutoDebitRegistrationObj) => {
        this.autoDebitRegistrationObj = response;
        if(this.autoDebitRegistrationObj.Status == this.Cancel)
        {
          this.dateFormat()
        }
        this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstantX.REF_REASON_AUTO_DEBIT_REG }).toPromise().then(
          (response) => {
            this.listReason = response[CommonConstant.ReturnObj];
            if(this.autoDebitRegistrationObj.CancellationReason != null)
            {
              this.reason = this.listReason.find(x => x.Key == this.autoDebitRegistrationObj.CancellationReason).Value;
            }
          }
        );

        this.http.post(URLConstantX.GetListStgAutoDebitRegisLog, {Code : this.autoDebitRegistrationObj.TransactionNo}).toPromise().then(
          (response: Array<StgAutoDebitRegisLogObj>) => {
            this.listStgAutoDebitRegisLog = response;

            for(let i = 0; i < this.listStgAutoDebitRegisLog.length; i++)
            {
              this.listStgAutoDebitRegisLog[i].Status = this.RefStats.find(x => x.Key == this.listStgAutoDebitRegisLog[i].Status).Value;
            }
          }
        )
      }
    )
  }

  dateFormat()
  {
    var datePipe = new DatePipe("en-US");
    this.cancelDt = datePipe.transform(this.autoDebitRegistrationObj.CancellationDate, "dd-MMM-yyyy").toString();
  }

  GetCallback(e: any) {
    if (e.Key == "Customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: e.ViewObj.CustNo }).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}

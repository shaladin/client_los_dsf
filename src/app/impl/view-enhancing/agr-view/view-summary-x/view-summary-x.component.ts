import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'agrmnt-view-summary-x',
  templateUrl: './view-summary-x.component.html',
  providers: [NGXToastrService]
})
export class ViewSummaryXComponent implements OnInit {
  @Input() agrmntId: any;
  agrmntObj = {
    Id: 0,
  };
  totalInsPremi: any;
  SummaryObj: any;
  inputGridObj: any;
  AppAssetId: any;
  link: string;
  BankCode: string;
  BankAccNo: string;
  BankAccName: string;
  BankName: string;

  readonly wopAD = CommonConstantX.WOPADDescr;
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.agrmntObj.Id = this.agrmntId;
    await this.GetAgrmntSummary();
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridInsDataView.json";
    this.inputGridObj.deleteUrl = URLConstant.DeleteAppGuarantor;
    this.http.post(URLConstant.GetAppAssetListForInsuranceByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetAgrmntSummary() {
    await this.http.post(URLConstant.GetAgrmtSummaryByAgrmntId, this.agrmntObj).toPromise().then(
      (response) => {
        console.log(response)
        this.SummaryObj = response;
        if (this.SummaryObj.AppIns != null) {
          this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
        }
      }
    );
    if (this.SummaryObj.Agrmnt.MrWopDescr == this.wopAD)
    {
      await this.GetAgrmntOtherInfo();
    }
  }

  async GetAgrmntOtherInfo() {
    await this.http.post(URLConstantX.GetAgrmntOtherInfoByAgrmntIdX, {Id: this.agrmntId}).subscribe(
      (response) => {
        this.BankCode = response["BankCode"];
        this.BankAccName = response["BankAccName"];
        this.BankAccNo = response["BankAccNo"];

        this.http.post(URLConstant.GetRefBankByBankCodeAsync, {Code: this.BankCode}).subscribe(
          (response1) => {
            this.BankName = response1["BankName"];
          }
        )
      }
    )
  }

  getEvent(event){
    this.AppAssetId = event.RowObj.AppAssetId;
    this.link = environment.losR3Web + "/Nap/FinanceLeasing/ViewInsurance?AppAssetId=" + event.RowObj.AppAssetId;
    window.open(this.link, '_blank');
  }
}

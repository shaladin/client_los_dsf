import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';

@Component({
  selector: "agrmnt-view-summary",
  templateUrl: "./view-summary.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntSummaryComponent implements OnInit {
  @Input() agrmntId: any;
  agrmntObj = {
    Id: 0,
  };
  totalInsPremi: any;
  SummaryObj: any;
  totalRsvFund: any;
  inputGridObj: any;
  AppAssetId: any;
  link: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.agrmntObj.Id = this.agrmntId;
    this.GetAgrmntSummary();
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

  GetAgrmntSummary() {
    this.http.post(URLConstant.GetAgrmtSummaryByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        this.SummaryObj = response;
        if (this.SummaryObj.AppIns != null) {
          this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
        }
      }
    );
  }

  getEvent(event){
    this.AppAssetId = event.RowObj.AppAssetId;
    this.link = environment.losR3Web + "/Nap/FinanceLeasing/ViewInsurance?AppAssetId=" + event.RowObj.AppAssetId;
    window.open(this.link, '_blank');
  }
}
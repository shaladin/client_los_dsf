import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

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

  installmentScheme: any;
  firstInstType: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.agrmntObj.Id = this.agrmntId;
    this.GetAgrmntSummary();
  }

  GetAgrmntSummary() {
    this.http.post(URLConstant.GetAgrmtSummaryByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        this.SummaryObj = response;
        if (this.SummaryObj.AppIns != null) {
          this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
        }
        this.GetDescrByCode();
      }
    ); 
  }

  GetDescrByCode() {
    var obj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInstSchm,
      MasterCode: this.SummaryObj.AgrmntFinData.MrInstSchemeCode
    }
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).subscribe(
      (response) => {
        this.installmentScheme = response["Descr"];
      });

    var objFirstInstType = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFirstInstType,
      MasterCode: this.SummaryObj.Agrmnt.MrFirstInstTypeCode
    }
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, objFirstInstType).subscribe(
      (response) => {
        this.firstInstType = response["Descr"];
      });
  }
}
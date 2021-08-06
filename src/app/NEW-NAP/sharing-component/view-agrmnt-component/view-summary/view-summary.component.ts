import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "agrmnt-view-summary",
  templateUrl: "./view-summary.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntSummaryComponent implements OnInit {
  @Input() agrmntId: number;
  totalRsvFund: number;
  totalInsPremi: number;
  SummaryObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetAgrmntSummary();
  }

  GetAgrmntSummary() {
    this.http.post(URLConstant.GetAgrmtSummaryByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response) => {
        this.SummaryObj = response;
        if (this.SummaryObj.AppIns != null) {
          this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
        }
      }
    );
  }
}
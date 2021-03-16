import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-summary-fl4w',
  templateUrl: './view-summary-fl4w.component.html',
  styleUrls: ['./view-summary-fl4w.component.scss']
})
export class ViewSummaryFl4wComponent implements OnInit {
  @Input() AgrmntId: any;
  totalRsvFund: number;
  agrmntObj = {
    Id: 0,
  };
  totalInsPremi: any;
  SummaryObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.agrmntObj.Id = this.AgrmntId;
    this.GetAgrmntSummary();
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
}
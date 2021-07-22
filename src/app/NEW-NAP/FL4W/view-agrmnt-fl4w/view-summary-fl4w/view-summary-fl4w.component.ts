import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-summary-fl4w',
  templateUrl: './view-summary-fl4w.component.html',
  styleUrls: ['./view-summary-fl4w.component.scss']
})
export class ViewSummaryFl4wComponent implements OnInit {
  @Input() AgrmntId: number;
  totalRsvFund: number;
  totalInsPremi: number;
  SummaryObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetAgrmntSummary();
  }

  GetAgrmntSummary() {
    this.http.post(URLConstant.GetAgrmtSummaryByAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response) => {
        if (response["AppIns"] != null) {
          this.totalInsPremi = response["AppIns"].TotalInscoMainPremiAmt + response["AppIns"].TotalInscoAddPremiAmt + response["AppIns"].InscoAdminFeeAmt;
        }
      }
    );
  }
}
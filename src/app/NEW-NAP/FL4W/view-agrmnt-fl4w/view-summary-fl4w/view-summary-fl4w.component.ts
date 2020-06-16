import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';


@Component({
  selector: 'app-view-summary-fl4w',
  templateUrl: './view-summary-fl4w.component.html',
  styleUrls: ['./view-summary-fl4w.component.scss']
})
export class ViewSummaryFl4wComponent implements OnInit {

  @Input() AgrmntId: any;

  agrmntObj = {
    AgrmntId: 0,
  };
  totalInsPremi: any;
  SummaryObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }


  ngOnInit() {
    console.log('summary')
    this.agrmntObj.AgrmntId = this.AgrmntId;
    this.GetAgrmntSummary();

  }

  GetAgrmntSummary() {
    this.http.post(AdInsConstant.GetAgrmtSummaryByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        console.log(response);
        this.SummaryObj = response;
        if (this.SummaryObj.AppIns != null) {
          this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
        }
      }
    );
  }

}

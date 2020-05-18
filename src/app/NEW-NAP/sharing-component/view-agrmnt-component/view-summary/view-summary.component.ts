import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';


@Component({
  selector: "agrmnt-view-summary",
  templateUrl: "./view-summary.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntSummaryComponent implements OnInit {

  @Input() agrmntId: any;


  agrmntObj = {
    AgrmntId: 0,
  };
  totalInsPremi: any;
  SummaryObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }


  ngOnInit() {
    this.agrmntObj.AgrmntId = this.agrmntId;
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

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-lead-view-srvy-task',
  templateUrl: './lead-view-srvy-task.component.html'
})
export class LeadViewSrvyTaskComponent implements OnInit {
  @Input() LeadNo: string;

  urlLink: string;
  rootServer: string;
  SrvyOrderId: number;
  IsReady: boolean = false;
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.rootServer = environment.FoundationR3Web;
    //this.rootServer = "http://localhost:4200";
    await this.http.post(URLConstant.GetSrvyOrderByTrxRefNo,{TrxNo: this.LeadNo}).toPromise().then(
      (response) => {
        this.SrvyOrderId = response["SrvyOrderId"];
      }
    )
    this.urlLink = this.rootServer + "/View/Survey/SurveyOrder" + "?SrvyOrderId=" + this.SrvyOrderId;
    this.IsReady = true;
  }

}

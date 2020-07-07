import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-approvalhist-dev',
  templateUrl: './approvalhist-dev.component.html'
})
export class ApprovalhistDevComponent implements OnInit {
  @Input() inputObj: any;
  IsReady: boolean = false;
  ListApprovalHist: Array<any> = new Array<any>();

  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    console.log(this.inputObj);
    if (this.inputObj[0].type == 'instance') {
      await this.LoadApprovalInstanceHist();
      this.IsReady = true;
    }
    else if (this.inputObj[0].type == 'task') {
      await this.LoadApprovalTaskHist();
      this.IsReady = true;
    }
  }

  async LoadApprovalInstanceHist() {
    var counter = 0;
    for (let i = 0; i < this.inputObj.length; i++) {
      await this.http.post(this.inputObj[i].approvalBaseUrl + "/api/ApprovalInstanceWeb/GetInstanceTaskHistory", { instanceId: this.inputObj[i].refId }).subscribe(
        (response) => {
          console.log(response);
          var resp: any = response;
          if (resp.length > 0) {
            this.ListApprovalHist.push(response[0]);

            if (this.inputObj[i].apvStat == 'REQ')
              this.ListApprovalHist[counter].Result = 'Request';

            counter++;
          }
        }
      );
    }
  }

  async LoadApprovalTaskHist() {
    var counter = 0;
    for (let i = 0; i < this.inputObj.length; i++) {
      await this.http.post(this.inputObj[i].approvalBaseUrl + "/api/ApprovalInstanceWeb/GetRFATaskHistory", { rfaId: this.inputObj[i].refId }).subscribe(
        (response) => {
          console.log(response);
          var resp: any = response;
          if (resp.length > 0) {
            this.ListApprovalHist.push(response[0]);

            if (this.inputObj[i].apvStat == 'REQ')
              this.ListApprovalHist[counter].Result = 'Request';

            counter++;
          }
        }
      );
    }
  }
}

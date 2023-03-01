import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-change-mou-view-history-x',
  templateUrl: './change-mou-view-history-x.component.html'
})
export class ChangeMouHistoryVersionViewXComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  ChangeMouTrxIdPrev: number;
  @Input() Status: string;

  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() TrxType: string;
  @Input() Version: number;

  isPrevExist: boolean = true;
  isExecuted: boolean = false;

  isReady: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  async ngOnInit() {
    await this.http.post(URLConstantX.GetChangeMouPreviousIdByChangeMouTrxIdX, {id: this.ChangeMouTrxId}).toPromise().then((responseId) => {
      if(responseId["ChangeMouTrxId"] != undefined){
        this.ChangeMouTrxIdPrev = responseId["ChangeMouTrxId"];
        if(this.ChangeMouTrxIdPrev == 0){
          this.isPrevExist = false;
        }
        this.isReady = true;
        if (this.Version == 1) {
          if (this.Status == "EXE") {
            this.isExecuted = true;
          }
        } else if (this.Version == 0) {
          this.isExecuted = true;
          this.isPrevExist = true;
          this.isReady = true;
          this.ChangeMouTrxIdPrev = this.ChangeMouTrxId;
          this.ChangeMouTrxId = this.ChangeMouTrxId;
        } else {
          this.isExecuted = true;
        }
      }
    });
  }
}

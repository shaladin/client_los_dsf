import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

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

  isPrevExist: boolean = true;
  isExecuted: boolean = false;

  isReady: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  async ngOnInit() {
    await this.http.post(URLConstant.GetChangeMouPreviousIdByMouCustId, {id: this.MouCustId}).toPromise().then((responseId) => {
      if(responseId["ChangeMouTrxId"] != undefined){
        this.ChangeMouTrxIdPrev = responseId["ChangeMouTrxId"];
        if(this.ChangeMouTrxIdPrev == 0){
          this.isPrevExist = false;
        }
        this.isReady = true;
      }
    });
    if(this.Status == "EXE"){
      this.isExecuted == true;
    }
  }
}

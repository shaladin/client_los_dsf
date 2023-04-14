import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-change-mou-history-x',
  templateUrl: './change-mou-history-x.component.html'
})
export class ChangeMouHistoryVersionXComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  ChangeMouTrxIdPrev: number;

  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() TrxType: string;
  isPrevExist: boolean = true;
  isReady: boolean = false;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  async ngOnInit() {
    await this.http.post(URLConstant.GetChangeMouTrxbyTrxId, { Id: this.MouCustId }).toPromise().then(
      (responseCMT) => {
        this.http.post(URLConstantX.GetChangeMouPreviousIdByChangeMouTrxIdX, { id: this.ChangeMouTrxId }).toPromise().then((responseId) => {
          if (responseId["ChangeMouTrxId"] != undefined) {
            this.ChangeMouTrxIdPrev = responseId["ChangeMouTrxId"];
            if (this.ChangeMouTrxIdPrev == 0) {
              this.isPrevExist = false;
            }
          }
        });
        this.isReady = true;
      });
  }
}

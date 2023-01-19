import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-change-mou-view-history',
  templateUrl: './change-mou-view-history.component.html'
})
export class ChangeMouHistoryVerForViewComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  ChangeMouTrxIdPrev: number;
  @Input() Status: string;

  @Input() MouCustId: number;
  @Input() MouType: string;

  isPrevExist: boolean = true;
  isExecuted: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.http.post(URLConstant.GetChangeMouPreviousIdByMouCustId, {id: this.MouCustId}).subscribe((responseId) => {
      if(responseId["ChangeMouTrxId"] != undefined){
        this.ChangeMouTrxIdPrev = responseId["ChangeMouTrxId"];
      }
    });
    if(this.Status == "EXE"){
      this.isExecuted == true;
    }
    if(this.ChangeMouTrxIdPrev == 0){
      this.isPrevExist == false;
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-mou-view-history-x',
  templateUrl: './change-mou-view-history-x.component.html'
})
export class ChangeMouHistoryVersionViewXComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  @Input() ChangeMouTrxIdPrev: number;
  @Input() Status: string;

  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() TrxType: string;

  isPrevExist: boolean = true;
  isExecuted: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    if(this.Status == "EXE"){
      this.isExecuted == true;
    }
    if(this.ChangeMouTrxIdPrev == 0){
      this.isPrevExist == false;
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { ChangeMouTrxObj } from 'app/shared/model/change-mou-trx-obj.model';

@Component({
  selector: 'app-change-mou-history',
  templateUrl: './change-mou-history.component.html'
})
export class ChangeMouHistoryVersionComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  ChangeMouTrxIdPrev: number;

  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() TrxType: string;
  isPrevExist: boolean = true;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.http.post(URLConstant.GetChangeMouPreviousIdByMouCustId, {id: this.MouCustId}).subscribe((responseId) => {
      if(responseId["ChangeMouTrxId"] != undefined){
        this.ChangeMouTrxIdPrev = responseId["ChangeMouTrxId"];
      }
    });
    if(this.ChangeMouTrxIdPrev == 0){
      this.isPrevExist == false;
    }
  }
}

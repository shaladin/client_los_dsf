import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCollForMouViewObj } from 'app/shared/model/response/mou/res-mou-coll-for-mou-view-obj.model';

@Component({
  selector: 'app-change-mou-addcoll-history',
  templateUrl: './change-mou-addcoll-history.component.html'
})
export class ChangeMouAddcollHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number;

  listCollateralData: Array<ResMouCollForMouViewObj> = new Array();

  constructor(private http: HttpClient, private toastr: NGXToastrService) { }


  ngOnInit() {
    this.http.post(URLConstant.GetChangeMouCustCollateralForChangeMouViewByMouCustId, { Id: this.ChangeMouTrxId }).subscribe(
      (response) => {
        console.log(response);
        this.listCollateralData = response['ReturnObject'];
      })
  }

  ChangeMouCustCollateralId: number = 0;
  isView: boolean = false;
  ViewColl(ChangeMouCustCollateralId: number) {
    this.isView = false;
    setTimeout(() => {
      this.ChangeMouCustCollateralId = ChangeMouCustCollateralId;
      this.isView = true;
    }, 500);
  }

  Back() {
    this.isView = false;
  }
}

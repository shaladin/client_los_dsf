import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-freeze-unfreeze-history',
  templateUrl: './mou-view-freeze-unfreeze-history.component.html'
})
export class MouViewFreezeUnfreezeHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  listMouFreezeUnfreeze: Array<any>;
  trxType: any;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    var Obj = { MouCustId: this.MouCustId }
    this.http.post<any>(URLConstant.GetListMouFreezeUnfreezeByMouCustId, Obj).subscribe(
      (response) => {
        this.listMouFreezeUnfreeze = response["ResponseMouFreezeUnfreezeObjs"];
      })
  }
  
  FreezeHistoryForm = this.fb.group({})  
}
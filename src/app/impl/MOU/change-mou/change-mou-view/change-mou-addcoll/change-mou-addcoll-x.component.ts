import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import {ResMouCollForMouViewObjX} from 'app/impl/shared/model/Response/MOU/ResMouCollForMouViewObjX.model';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {CommonConstant} from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-change-mou-addcoll-x',
  templateUrl: './change-mou-addcoll-x.component.html'
})
export class ChangeMouAddcollXComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number;

  listCollateralData: Array<ResMouCollForMouViewObjX> = new Array();

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }


  ngOnInit() {
    const mouCustObj = { Id: this.ChangeMouTrxId }

    this.http.post(URLConstantX.GetChangeMouCustCollateralXForChangeMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response[CommonConstant.ReturnObj];
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
  
  AddCollDataForm = this.fb.group({
  })
}

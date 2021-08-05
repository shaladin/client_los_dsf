import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCollForMouViewObj } from 'app/shared/model/Response/MOU/ResMouCollForMouViewObj.model';
import {ResMouCollForMouViewObjX} from 'app/impl/shared/model/Response/MOU/ResMouCollForMouViewObjX.model';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {CommonConstant} from '../../../../../shared/constant/CommonConstant';

@Component({
  selector: 'app-change-mou-addcoll-x',
  templateUrl: './change-mou-addcoll-x.component.html'
})
export class ChangeMouAddcollXComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number;

  listCollateralData: Array<ResMouCollForMouViewObjX>;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }


  ngOnInit() {
    var mouCustObj = { Id: this.ChangeMouTrxId }

    this.http.post(URLConstantX.GetChangeMouCustCollateralXForChangeMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response[CommonConstant.ReturnObj];
      })
  }

  AddCollDataForm = this.fb.group({
  })
}

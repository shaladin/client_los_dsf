import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCollForMouViewObj } from 'app/shared/model/Response/MOU/ResMouCollForMouViewObj.model';

@Component({
  selector: 'app-change-mou-addcoll',
  templateUrl: './change-mou-addcoll.component.html'
})
export class ChangeMouAddcollComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: Array<ResMouCollForMouViewObj>;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }


  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetChangeMouCustCollateralForChangeMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
  }

  AddCollDataForm = this.fb.group({
  })
}

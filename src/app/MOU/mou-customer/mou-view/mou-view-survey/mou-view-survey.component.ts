import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-view-survey',
  templateUrl: './mou-view-survey.component.html',
})
export class MouViewSurveyComponent implements OnInit {
  @Input() MouCustId: any;
  listSrvyOrder: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouObj = { MouCustId: this.MouCustId }
    this.http.post(AdInsConstant.GetSrvyResultDataByTrxRefNo, mouObj).subscribe(
      (response) => {
        console.log(mouObj);
        this.listSrvyOrder = response;
      })
  }

  SrvyOrderForm = this.fb.group({
  })

}

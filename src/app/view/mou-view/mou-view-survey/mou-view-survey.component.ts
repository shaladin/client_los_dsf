import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-view-survey',
  templateUrl: './mou-view-survey.component.html',
})
export class MouViewSurveyComponent implements OnInit {
  @Input() MouCustId: number;
  listSrvyOrder: Array<any>;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouObj = { Id: this.MouCustId }
    this.http.post<any>(URLConstant.GetSrvyResultDataByTrxRefNo, mouObj).subscribe(
      (response) => {
        this.listSrvyOrder = response[CommonConstant.ReturnObj];
      })
  }

  SrvyOrderForm = this.fb.group({
  })  

}

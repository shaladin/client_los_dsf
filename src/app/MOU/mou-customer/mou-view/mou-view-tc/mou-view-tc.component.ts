import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mou-view-tc',
  templateUrl: './mou-view-tc.component.html',
  styleUrls: ['./mou-view-tc.component.scss'],
  providers: [NGXToastrService, DatePipe]
})
export class MouViewTcComponent implements OnInit {
  @Input() MouCustId: any;

  listTCData: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, public datepipe: DatePipe) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetCustMouTcByCustMouId, mouCustObj).subscribe(
      (response) => {
        this.listTCData = response['ReturnObject'];
      })
  }

  TCDataForm = this.fb.group({
  })

}

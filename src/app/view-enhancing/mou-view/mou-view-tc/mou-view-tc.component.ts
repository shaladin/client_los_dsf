import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

@Component({
  selector: 'app-mou-view-tc',
  templateUrl: './mou-view-tc.component.html',
  providers: [NGXToastrService, DatePipe]
})
export class MouViewTcComponent implements OnInit {
  @Input() MouCustId: number;

  listTCData: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, public datepipe: DatePipe) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetCustMouTcByCustMouId, mouCustObj).subscribe(
      (response) => {
        this.listTCData = response['ReturnObject'];
      });
    this.GetListActiveRefTc();
  }

  dictRefTc: { [id: string]: string } = {};
  GetListActiveRefTc() {
    this.http.post(URLConstant.GetListActiveRefTc, null).subscribe(
      (response: GenericListObj) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.dictRefTc[element.TcCode] = element.TcName;
        }
      }
    );
  }

  TCDataForm = this.fb.group({
  })

}

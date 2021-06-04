import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-view-fee',
  templateUrl: './mou-view-fee.component.html',
  providers: [NGXToastrService]
})
export class MouViewFeeComponent implements OnInit {
  @Input() MouCustId: number;

  listFeeData: any;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustFeeByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listFeeData = response[CommonConstant.ReturnObj];
      }
    );
  }

  FeeDataForm = this.fb.group({
  })
}
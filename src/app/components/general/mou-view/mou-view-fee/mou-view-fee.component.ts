import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-view-fee',
  templateUrl: './mou-view-fee.component.html'
})
export class MouViewFeeComponent implements OnInit {
  @Input() MouCustId: number;
  listFeeData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustFeeByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listFeeData = response[CommonConstant.ReturnObj];
      }
    );
  }
}
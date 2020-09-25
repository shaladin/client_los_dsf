import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-tc',
  templateUrl: './mou-view-tc.component.html'
})
export class MouViewTcComponent implements OnInit {
  @Input() MouCustId: number;

  listTCData: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    this.http.post(URLConstant.GetCustMouTcByCustMouId, mouCustObj).subscribe(
      (response) => {
        this.listTCData = response['ReturnObject'];
      })
  }
}

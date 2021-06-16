import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviationResultObj } from 'app/shared/model/DeviationResultObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-view-deviation',
  templateUrl: './view-deviation.component.html'
})
export class ViewDeviationComponent implements OnInit {
  inputPagingObj: any;
  deviationResultList: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  @Input() AppId: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetListDeviationResult();
  }

  GetListDeviationResult() {
    var obj = {
      AppId: this.AppId,
      AppNo: ""
    }
    var appObj = { Id: this.AppId };
    var getAppUrl = URLConstant.GetAppById;
    this.http.post<AppObj>(getAppUrl, appObj).subscribe(
      (response) => {
        obj.AppNo = response.AppNo;
        var getListDeviationUrl = URLConstant.GetListDeviationResultByAppNo;
        this.http.post<Array<DeviationResultObj>>(getListDeviationUrl, { TrxNo: response.AppNo }).subscribe(
          (response) => {
            this.deviationResultList = response[CommonConstant.ReturnObj];
          }
        );
      }
    );
  }
}
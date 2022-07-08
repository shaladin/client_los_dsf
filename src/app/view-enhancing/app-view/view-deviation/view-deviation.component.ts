import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { DeviationResultObj } from 'app/shared/model/deviation-result-obj.model';

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
    this.http.post<AppObj>(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        obj.AppNo = response.AppNo;
        this.http.post<Array<DeviationResultObj>>(URLConstant.GetListDeviationResultByAppNo, { TrxNo: response.AppNo }).subscribe(
          (response) => {
            this.deviationResultList = response[CommonConstant.ReturnObj];

            if(!this.deviationResultList) return;
            this.deviationResultList.forEach((item, index) => {
              item.IsOriginalValueNumber = !Number.isNaN(Number(item.OriginalValue));
              item.IsCurrentValueNumber = !Number.isNaN(Number(item.CurrentValue));
            }, this.deviationResultList);
          }
        );
      }
    );
  }
}

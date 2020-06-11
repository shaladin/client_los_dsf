import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { DeviationResultObj } from 'app/shared/model/DeviationResultObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-view-deviation',
  templateUrl: './view-deviation.component.html'
})
export class ViewDeviationComponent implements OnInit {

  inputPagingObj: any;
  deviationResultList: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  @Input() AppId: number;
 
  constructor(private http: HttpClient){
 
  }

  ngOnInit() {
    this.GetListDeviationResult();
  }

  GetListDeviationResult() {
    var obj = {
      AppId: this.AppId,
      AppNo : ""
    }
    var getAppUrl = AdInsConstant.GetAppById;
    this.http.post<AppObj>(getAppUrl, obj).subscribe(
      (response) => {
        
        obj.AppNo = response.AppNo;

        var getListDeviationUrl = AdInsConstant.GetListDeviationResultByAppNo;
    this.http.post<Array<DeviationResultObj>>(getListDeviationUrl, obj).subscribe(
      (response) => {
        console.log("response");
        console.log(response);
        this.deviationResultList = response;
        
      },
      (error) => {
        console.log(error);
      }
    );
      },
      (error) => {
        console.log(error);
      }
      
    );
    
  }

}

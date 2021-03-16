import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { SummaryAppObj } from 'app/shared/model/App/SummaryAppObj.Model';
import { SerialNoObj } from 'app/shared/model/SerialNo/SerialNoObj.Model';

@Component({
  selector: "view-summary-app-ros",
  templateUrl: "./view-summary-app-ros.component.html",
  providers: [NGXToastrService]
})
export class ViewSummaryAppROSComponent implements OnInit {
  @Input() AppId: number;
  
  SummaryAppObj: any;
  SerialNoObjs: Array<SerialNoObj> = new Array<SerialNoObj>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
     this.getSummaryApp();
  }

  getSummaryApp() {
    var reqObj = { Id: this.AppId };
    this.http.post<SummaryAppObj>(URLConstant.GetSummaryAppByAppId, reqObj).subscribe(
      (response) => {
        console.log(response);
        this.SummaryAppObj = response;
        if(this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs != null && this.SummaryAppObj.AppAssetObjs.length == 1){
          for(let i = 0; i < this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs.length; i++){
            var serialNoObj = new SerialNoObj();
            serialNoObj.SerialNoLabel = this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs[i].SerialNoLabel;
            serialNoObj.SerialNoValue = this.SummaryAppObj.AppAssetObjs[0]["SerialNo" + (i+1)];
            this.SerialNoObjs.push(serialNoObj);
          }
        }
      });
  }
}
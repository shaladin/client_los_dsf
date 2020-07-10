import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-agrmnt',
  templateUrl: './view-agrmnt.component.html'
})
export class ViewAgrmntComponent implements OnInit {

  viewEnvironment: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
    });

  }
  viewAgrMainInfo: string;
  AgrmntId: number;
  AppId: number;
  MrCustTypeCode: string;
  ngOnInit() {
    this.viewAgrMainInfo = "./assets/ucviewgeneric/viewAgrMainInfo.json";
    this.viewEnvironment = environment.losUrl;

    var AgrmntObj = {
      AgrmntId: this.AgrmntId
    }
    this.http.post(URLConstant.GetAgrmntByAgrmntId, AgrmntObj).subscribe(
      (response) => {
        this.AppId = response["AppId"];
        console.log(this.AppId);

        var AppObj = {
          AppId: this.AppId
        }
        this.http.post(URLConstant.GetAppCustByAppId, AppObj).subscribe(
          (response) => {
            this.MrCustTypeCode = response["MrCustTypeCode"];
            console.log(this.MrCustTypeCode);
          });
      }
    );
  }

}

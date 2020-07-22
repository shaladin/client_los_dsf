import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-agrmnt-fl4w',
  templateUrl: './view-agrmnt-fl4w.component.html'
})

export class ViewAgrmntFl4wComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
    });

  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AgrmntId: number;
  AppId: number;
  MrCustTypeCode: string;
  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfo.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
    ];

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

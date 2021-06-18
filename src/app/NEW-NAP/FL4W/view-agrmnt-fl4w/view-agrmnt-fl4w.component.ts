import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';

@Component({
  selector: 'app-view-agrmnt-fl4w',
  templateUrl: './view-agrmnt-fl4w.component.html'
})

export class ViewAgrmntFl4wComponent implements OnInit {
  dmsObj: DMSObj;
  isDmsReady: boolean;
  appNo: string;
  custNo: string;

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
  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfo.json";

    var AgrmntObj = {
      Id: this.AgrmntId
    }
    this.http.post(URLConstant.GetAgrmntByAgrmntId, AgrmntObj).subscribe(
      (response) => {
        this.AppId = response["AppId"];

        var AppObj = {
          Id: this.AppId
        }
        this.http.post(URLConstant.GetAppCustByAppId, AppObj).subscribe(
          (response) => {
            this.MrCustTypeCode = response["MrCustTypeCode"];
          });
      }
    );
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-agrmnt-fl4w',
  templateUrl: './view-agrmnt-fl4w.component.html',
  styleUrls: ['./view-agrmnt-fl4w.component.scss']
})

export class ViewAgrmntFl4wComponent implements OnInit {

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
  MrCustTypeCode : string;
  ngOnInit() {
    this.viewAgrMainInfo = "./assets/ucviewgeneric/viewAgrMainInfo.json";

    var AgrmntObj = {
      AgrmntId: this.AgrmntId
    }
    this.http.post(AdInsConstant.GetAgrmntByAgrmntId, AgrmntObj).subscribe(
      (response) => { 
        this.AppId = response["AppId"];
        console.log(this.AppId);

        var AppObj = {
          AppId: this.AppId
        }
        this.http.post(AdInsConstant.GetAppCustByAppId, AppObj).subscribe(
          (response) => { 
           this.MrCustTypeCode = response["MrCustTypeCode"];
           console.log(this.MrCustTypeCode);
          });
      }
    );
  }

}

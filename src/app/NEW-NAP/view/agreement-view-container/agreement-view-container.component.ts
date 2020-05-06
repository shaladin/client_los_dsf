import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-agreement-view-container',
  templateUrl: './agreement-view-container.component.html',
  styleUrls: ['./agreement-view-container.component.scss']
})
export class AgreementViewContainerComponent implements OnInit {

  AgrmntId;
  constructor(    
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
    });
  }

  async ngOnInit() {
    console.log(this.AgrmntId);
    await this.GetAppAndAppCustDetailByAgrmntId();
  }

  ResponseAppDetailData;
  async GetAppAndAppCustDetailByAgrmntId(){
    var obj = { agrmntId: this.AgrmntId};
    await this.http.post(AdInsConstant.GetAppAndAppCustDetailByAgrmntId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ResponseAppDetailData=response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

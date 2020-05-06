import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from '../../../shared/AdInstConstant';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {
  AppId: number;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetAppCust();
  }

  GetAppCust() {
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(AdInsConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        this.AppCustObj = response;
        console.log(response);
        this.CustType = this.AppCustObj.MrCustTypeCode;
      }
    );
  }

}

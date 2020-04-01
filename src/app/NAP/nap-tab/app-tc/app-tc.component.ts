import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppIdObj } from 'app/shared/model/AppIdObj.Model';

@Component({
  selector: 'app-app-tc',
  templateUrl: './app-tc.component.html',
  styleUrls: []
})
export class AppTcComponent implements OnInit {

  @Input() AppId: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
   }


  TCCode : any = new Array();
  TCMandatory : any = new Array();
  TCPriorTo : any = new Array();
  AppIdObj : any = new AppIdObj();
  result : any;

  ngOnInit() {
    this.AppIdObj.AppId = this.AppId;
    console.log(this.AppIdObj);
    this.http.post(AdInsConstant.CreateTCRule, this.AppIdObj).subscribe(
      (response) => {
        console.log("CHek Hasil :");
        console.log(response);
        this.TCCode = response["TCCode"];
        this.TCMandatory = response["TCMandatory"];
        this.TCPriorTo = response["TCPriorTo"];
        this.result = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

}

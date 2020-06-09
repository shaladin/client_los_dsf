import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: "view-asset-data",
  templateUrl: "./view-asset-data.component.html",
  providers: [NGXToastrService]
})
export class ViewAssetDataComponent implements OnInit {

  getAppUrl: any;
  getAllAssetDataUrl: any;
  @Input() appId: number = 0;
  appAssetId: number = 0;
  appObj = {
    AppId: 0,
    AppAssetId: 0
  };

  AppObj: any;
  AppAssetObj: any;
  totalRsvFund: number = 0;
  totalHalfResponseAppAssetAttrObjs: number = 0;
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    this.route.queryParams.subscribe(params => {
     if (params['AppId'] != null) {
       this.appId = params['AppId'];
     }
     if (params['AppAssetId'] != null) {
      this.appAssetId = params['AppAssetId'];
    }
    });
  }

  initUrl() {
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getAllAssetDataUrl = AdInsConstant.GetAllAssetDataByAppId;
  }

  initSingleAssetUrl(){
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getAllAssetDataUrl = AdInsConstant.GetAllAssetDataByAppAssetId;
  }

  async ngOnInit(): Promise<void> {
    if (this.appAssetId != 0)
    {
      this.initSingleAssetUrl();
      this.appObj.AppAssetId = this.appAssetId;
    }
    else
      this.initUrl();

    this.appObj.AppId = this.appId;
    console.log(this.appId);
    await this.GetAllAssetData();

  }

  async GetAllAssetData() {
    await this.http.post(this.getAllAssetDataUrl, this.appObj).toPromise().then(
      (response) => {
        console.log(response);
        this.AppAssetObj = response;
        console.log(response);
        if(this.AppAssetObj.ResponseAppAssetAttrObjs != null)
          this.totalHalfResponseAppAssetAttrObjs = Math.ceil(this.AppAssetObj.ResponseAppAssetAttrObjs.length/2);
      },
      (error) => {
        console.log(error);
      }
    );

  }

}

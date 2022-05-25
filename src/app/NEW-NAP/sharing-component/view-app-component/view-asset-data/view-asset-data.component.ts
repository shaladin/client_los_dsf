import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: "view-asset-data",
  templateUrl: "./view-asset-data.component.html",
  providers: [NGXToastrService]
})
export class ViewAssetDataComponent implements OnInit {
  @Input() appId: number = 0;
  appAssetId: number = 0;
  AppAssetObj: any;
  totalRsvFund: number = 0;
  totalHalfResponseAppAssetAttrObjs: number = 0;
  DownPaymentName : string = "Down Payment";

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
     if (params['AppId'] != null) {
       this.appId = params['AppId'];
     }
     if (params['AppAssetId'] != null) {
      this.appAssetId = params['AppAssetId'];
    }
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.appAssetId != 0) {
      await this.GetAllAssetData({ Id: this.appAssetId });
    }
    else
    {
      await this.GetAllAssetData({ Id: this.appId });
    }
  }

  getAssetUrl(): string {
    if(this.appAssetId != 0){
      return URLConstant.GetAllAssetDataByAppAssetId;
    }
    return URLConstant.GetAllAssetDataByAppId;
  }

  async GetAllAssetData(obj: { Id: number }) {
    await this.http.post(this.getAssetUrl(), obj).toPromise().then(
      (response) => {
        this.AppAssetObj = response;
        if(this.AppAssetObj.ResponseAppAssetAttrObjs != null) {
          this.totalHalfResponseAppAssetAttrObjs = Math.ceil(this.AppAssetObj.ResponseAppAssetAttrObjs.length/2);
        }
        
        this.http.post(URLConstant.GetAppById, { Id: this.AppAssetObj.ResponseAppAssetObj.AppId}).subscribe(
          (response : AppObj) => {
            if(response.BizTemplateCode == CommonConstant.FL4W)
            {
              this.DownPaymentName = "Security Deposit";
            }
          }
        );
      }
    );
  }
}
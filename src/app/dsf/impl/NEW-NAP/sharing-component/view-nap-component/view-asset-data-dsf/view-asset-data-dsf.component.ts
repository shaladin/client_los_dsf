import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-view-asset-data-dsf',
  templateUrl: './view-asset-data-dsf.component.html',
  providers: [NGXToastrService]
})
export class ViewAssetDataDsfComponent implements OnInit {
  @Input() appId: number = 0;
  appAssetId: number = 0;
  AppAssetObj: any;
  // Self Custom Changes CR Runner KTB 398912
  AppAssetDsfObj: any;
  // End Self Custom Changes CR Runner KTB 398912
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
        // Self Custom Changes CR Runner KTB 398912
        await this.GetAllAssetDataDsf({ Id: this.appAssetId });
        // End Self Custom Changes CR Runner KTB 398912
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
  // Self Custom Changes CR Runner KTB 398912
  async GetAllAssetDataDsf(obj: any) {
    await this.http.post(URLConstantDsf.GetAppAssetByAppAssetIdDsf, obj).toPromise().then(
      (response) => {
        this.AppAssetDsfObj = response;
      }
    );
  }
  // End Self Custom Changes CR Runner KTB 398912

}
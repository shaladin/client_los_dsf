import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAssetObj } from 'app/shared/model/app-cust-asset/app-cust-asset-obj.model';

@Component({
  selector: 'app-crd-rvw-list-asset',
  templateUrl: './crd-rvw-list-asset.component.html'
})
export class CrdRvwListAssetComponent implements OnInit {
  @Input() AppCustId;

  appCustAssets: Array<AppCustAssetObj>
  constructor(private http: HttpClient) { }

  ngOnInit() {
    if(this.AppCustId && this.AppCustId > 0)
    {
      this.GetAppCustAssetData();
    }
  }

  GetAppCustAssetData()
  {
    this.http.post<Array<AppCustAssetObj>>(URLConstant.GetListAppCustAssetByAppCustId, {Id: this.AppCustId}).toPromise().then(
      (response) => {
        this.appCustAssets = response["AppCustAssetObjList"];
        if(this.appCustAssets.length != 0)
        {
          this.CountTotal();
        }
      }
    )
  }

  total: number = 0;
  CountTotal()
  {
    for(let i = 0; i < this.appCustAssets.length; i++)
    {
      this.total = this.total + this.appCustAssets[i].AssetTotalValue;
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AssetAccObj } from 'app/impl/shared/model/AssetAccObj.model';

@Component({
  selector: 'app-asset-accessory-info',
  templateUrl: './asset-accessory-info.component.html'
})
export class AssetAccessoryInfoComponent implements OnInit {

  @Input() AppId: number = 0;
  ListAssetAndListAccInfo: Array<AssetAccObj>;
  letterIndex: number;
  letter: string;
  InsuranceName: string;
  
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.getAssetAndAccInfoByAppId();
  }
  
  async getAssetAndAccInfoByAppId()
  {
    await this.http.post<Array<AssetAccObj>>(URLConstantX.GetAssetAndAccByAppId, {id : this.AppId}).toPromise().then(
      (response) => {
        this.ListAssetAndListAccInfo = response['ReturnObject'];
      }
    )
    
  }

  letterNumbering(num: number)
  {
    for(this.letter = ""; num >= 0; num = ((num/26) | 0 ) - 1)
    {
      this.letter = String.fromCharCode(num%26 + 0x41) + this.letter;
    }
  }

  InsuranceNaming(str: string)
  {
    this.InsuranceName = str;
    if(str == CommonConstantX.ALLRISK)
    {
      this.InsuranceName = CommonConstantX.ALL_RISK;
    }
    else if(str == CommonConstantX.TLO)
    {
      this.InsuranceName = CommonConstantX.TOTAL_LOSS_ONLY;
    }
    else if(str == CommonConstantX.ALLRISK_MIP)
    {
      this.InsuranceName = CommonConstantX.ALL_RISK_MIP;
    }
    else if(str == CommonConstantX.TLO_MIP)
    {
      this.InsuranceName = CommonConstantX.TOTAL_LOSS_ONLY_MIP;
    }
    else if(str == CommonConstantX.ALLRISK_OTR)
    {
      this.InsuranceName = CommonConstantX.ALL_RISK_OTHER;
    }
  }
}

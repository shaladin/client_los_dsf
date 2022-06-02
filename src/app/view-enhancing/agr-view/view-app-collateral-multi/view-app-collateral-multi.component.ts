import { Component, OnInit, Input } from '@angular/core';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';

@Component({
  selector: 'app-view-app-collateral-multi',
  templateUrl: './view-app-collateral-multi.component.html'
})
export class ViewAppCollateralMultiComponent implements OnInit {
  @Input() agrmntId: number = 0;
  AppCollateralObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();
  SerialNoLabelCollateralList: Array<string> = [];
  IsHidden: boolean = true;
  AppCollateralId: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAgrmntId, {Id: this.agrmntId}).subscribe(
      (response) => {
        this.AppCollateralObj = response[CommonConstant.ReturnObj];

        this.GetSerialNoList();
      });
  }

  async GetSerialNoList()
  {
    let reqByListCodes: GenericListByCodeObj = new GenericListByCodeObj();
    reqByListCodes.Codes = Array.from(new Set(this.AppCollateralObj.map(x => x.AssetTypeCode)));
    
    let x = [];
    let temp = 0;
    for(let i = 0; i < reqByListCodes.Codes.length; i++)
    {
      await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: this.AppCollateralObj[i].AssetTypeCode
      }).toPromise().then(
        (response) => {
          if(i == 0)
          {
            response[CommonConstant.ReturnObj].length <= 3? temp = response[CommonConstant.ReturnObj].length : temp = 3;
          }
          else
          {
            response[CommonConstant.ReturnObj].length >= temp? (response[CommonConstant.ReturnObj].length >= 3? temp = 3 : temp = response[CommonConstant.ReturnObj].length) : temp = temp;
          }
        });

      x = reqByListCodes.Codes.filter(f => f == reqByListCodes.Codes[i]);
    }

    if(x.length == reqByListCodes.Codes.length)
    {
      await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: this.AppCollateralObj[0].AssetTypeCode
      }).toPromise().then(
        (response) => {
          for(let i = 0; i < temp; i++)
          {
            this.SerialNoLabelCollateralList.push(response[CommonConstant.ReturnObj][i].SerialNoLabel)
          }
        });
    }
    else
    {
      for(let i = 0; i < temp; i++)
      {
        this.SerialNoLabelCollateralList.push("Serial No " + (i+1))
      }
    }
  }

  viewDetailHandler(AppCollateralId){
    this.IsHidden = false;
    this.AppCollateralId = AppCollateralId;
  }

  getValue(event){
    this.IsHidden = event;
  }
}

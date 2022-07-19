import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { ViewAssetCollateralDetailComponent } from './view-asset-collateral-detail/view-asset-collateral-detail.component';
import { AssetTypeSerialNoLabelCustomObj } from 'app/shared/model/asset-type-serial-no-label-custom-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';

@Component({
  selector: 'view-asset-collateral',
  templateUrl: './view-asset-collateral.component.html'
})
export class ViewAssetCollateralComponent implements OnInit {
  @Input() agrmntId: number = 0;
  @Input() appId: number = 0;
  appAssetList: Array<AppAssetObj> = new Array<AppAssetObj>();
  AppCollateralObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();
  SerialNoLabelAssetList: Array<AssetTypeSerialNoLabelCustomObj>;
  SerialNoLabelCollateralList: Array<string> = [];
  AppCollateralId: number;
  IsHidden: boolean = true;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    var AgrmntObj = {
      Id: this.agrmntId
    }
    this.http.post<Array<AppAssetObj>>(URLConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, AgrmntObj).subscribe(
      (response) => {
        this.appAssetList = response[CommonConstant.ReturnObj];
        if(this.appAssetList.length > 0) {
          this.appId = this.appAssetList[0]['AppId'];
        }

        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
          Code: this.appAssetList[0].AssetTypeCode
        }).subscribe(
          (response) => {
            this.SerialNoLabelAssetList = response[CommonConstant.ReturnObj];
          });
      });

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

  viewDetailHandler(appAssetId) {
    const modalAssetDetail = this.modalService.open(ViewAssetCollateralDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AgrmntId = this.agrmntId;
    modalAssetDetail.componentInstance.AppId = this.appId;
    modalAssetDetail.result.then().catch((error) => {
    });
  }

  viewDetailCollateralHandler(AppCollateralId){
    this.IsHidden = false;
    this.AppCollateralId = AppCollateralId;
  }

  getValue(event){
    this.IsHidden = event;
  }
}
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetDataDetailFl4wComponent } from 'app/NEW-NAP/FL4W/view-agrmnt-fl4w/app-asset-data-fl4w/app-asset-data-detail-fl4w/app-asset-data-detail-fl4w.component';

@Component({
  selector: 'agrmnt-view-collateral',
  templateUrl: './view-collateral.component.html'
})
export class ViewCollateralComponent implements OnInit {

  @Input() agrmntId: number = 0;
  appAssetList: Array<AppAssetObj> = new Array<AppAssetObj>();

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    var AgrmntObj = {
      AgrmntId: this.agrmntId
    }
    this.http.post<Array<AppAssetObj>>(AdInsConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, AgrmntObj).subscribe(
      (response) => {
        this.appAssetList = response["ReturnObject"];
        console.log(this.appAssetList);
      });
  }

  viewDetailHandler(appAssetId) {
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailFl4wComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AgrmntId = this.agrmntId;
    modalAssetDetail.result.then().catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }
}

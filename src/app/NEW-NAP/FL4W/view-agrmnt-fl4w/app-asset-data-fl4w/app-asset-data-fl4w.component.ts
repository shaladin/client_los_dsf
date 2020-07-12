import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetDataDetailFl4wComponent } from './app-asset-data-detail-fl4w/app-asset-data-detail-fl4w.component';
import { URLConstant } from 'app/shared/constant/URLConstant';


@Component({
  selector: 'app-app-asset-data-fl4w',
  templateUrl: './app-asset-data-fl4w.component.html'
})
export class AppAssetDataFl4wComponent implements OnInit {
  @Input() AgrmntId: number;
  appAssetList: Array<any>;
  AppId: any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    var request = { AgrmntId: this.AgrmntId };
    this.httpClient.post(URLConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, request).subscribe(
      (response) => {
        this.appAssetList = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewDetailHandler(appAssetId){
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailFl4wComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AgrmntId = this.AgrmntId;
    modalAssetDetail.result.then().catch((error) => {
      if(error != 0){
        console.log(error);
      }
    });
  }

}

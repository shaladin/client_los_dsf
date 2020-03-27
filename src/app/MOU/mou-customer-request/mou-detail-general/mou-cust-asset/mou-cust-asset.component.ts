import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MouCustAssetObj } from 'app/shared/model/MouCustAssetObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustAssetDetailComponent } from './mou-cust-asset-detail/mou-cust-asset-detail.component';

@Component({
  selector: 'app-mou-cust-asset',
  templateUrl: './mou-cust-asset.component.html',
  styleUrls: ['./mou-cust-asset.component.scss']
})
export class MouCustAssetComponent implements OnInit {
  @Input() MouCustId: number;
  isAssetSelected: boolean;
  mouAssetList: any;
  listExclude: Array<string>;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService
  ) { 
    this.isAssetSelected = false;
    this.listExclude = new Array<string>();
  }

  ngOnInit() {
    var mouAsset = new MouCustAssetObj();
    mouAsset.MouCustId = this.MouCustId;
    this.httpClient.post(AdInsConstant.GetMouCustAssetByMouCustId, mouAsset).subscribe(
      (response: any) => {
        if(response.ReturnObject != null || response.ReturnObject != "undefined" || response.ReturnObject.length > 0){
          this.isAssetSelected = true;
          this.mouAssetList = [...response.ReturnObject];

          for(const item in this.mouAssetList){
            this.listExclude.push(item["FullAssetCode"]);
          }
        }
      }
    );
  }

  openModalAddMouAsset(){
    const modalMouAsset = this.modalService.open(MouCustAssetDetailComponent);
    modalMouAsset.componentInstance.ListExcludeFullAssetCode = this.listExclude;
    modalMouAsset.result.then(
      (response) => {
        this.spinner.show();
        var mouAsset = new MouCustAssetObj();
        mouAsset.MouCustId = this.MouCustId;
        this.httpClient.post(AdInsConstant.GetMouCustAssetByMouCustId, mouAsset).subscribe(
          (response: any) => {
            if(response.ReturnObject != null || response.ReturnObject != "undefined" || response.ReturnObject.length > 0){
              this.isAssetSelected = true;
              this.mouAssetList = [...response.ReturnObject];
              this.listExclude = new Array<string>();
              for(const item in this.mouAssetList){
                this.listExclude.push(item["FullAssetCode"]);
              }
            }
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    );
  }

  deleteMouAsset(mouCustAssetId, idx){
    var mouAsset = new MouCustAssetObj();
    mouAsset.MouCustAssetId = mouCustAssetId;
    this.httpClient.post(AdInsConstant.DeleteMouCustAsset, mouAsset).subscribe(
      (response: any) => {
        this.mouAssetList.splice(idx, 1);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}

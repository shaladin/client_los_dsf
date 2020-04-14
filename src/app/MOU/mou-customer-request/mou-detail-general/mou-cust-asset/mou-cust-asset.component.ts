import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MouCustAssetObj } from 'app/shared/model/MouCustAssetObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustAssetDetailComponent } from './mou-cust-asset-detail/mou-cust-asset-detail.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-mou-cust-asset',
  templateUrl: './mou-cust-asset.component.html',
  styleUrls: ['./mou-cust-asset.component.scss']
})
export class MouCustAssetComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() IsAssetSelected: boolean;
  mouAssetList: any;
  assetTypeList: any;
  listExclude: Array<string>;

  MouCustClauseAssetForm = this.fb.group({
    AssetTypeCode: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { 
    this.listExclude = new Array<string>();
    this.httpClient.post(AdInsConstant.GetAssetTypeKeyValueCode, null).subscribe(
      (response: any) => {
        this.assetTypeList = response;
        this.MouCustClauseAssetForm.patchValue({
          AssetTypeCode: response.ReturnObject[0].Key
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    var mouAsset = new MouCustAssetObj();
    mouAsset.MouCustId = this.MouCustId;
    this.httpClient.post(AdInsConstant.GetMouCustAssetByMouCustId, mouAsset).subscribe(
      (response: any) => {
        if(response.ReturnObject != null && response.ReturnObject.length > 0){
          this.IsAssetSelected = true;
          this.mouAssetList = [...response.ReturnObject];

          for(const item of this.mouAssetList){
            this.listExclude.push(item["FullAssetCode"]);
          }
          console.log(this.IsAssetSelected);
        }
      }
    );
  }

  openModalAddMouAsset(){
    const modalMouAsset = this.modalService.open(MouCustAssetDetailComponent);
    if(this.listExclude.length == 0){
      this.listExclude.push("");
    }
    modalMouAsset.componentInstance.ListExcludeFullAssetCode = this.listExclude;
    modalMouAsset.componentInstance.MouCustId = this.MouCustId;
    modalMouAsset.componentInstance.AssetTypeCode = this.MouCustClauseAssetForm.controls["AssetTypeCode"].value;
    modalMouAsset.result.then(
      (response) => {
        this.spinner.show();
        this.IsAssetSelected = true;
        var mouAsset = new MouCustAssetObj();
        mouAsset.MouCustId = this.MouCustId;
        this.httpClient.post(AdInsConstant.GetMouCustAssetByMouCustId, mouAsset).subscribe(
          (response: any) => {
            this.IsAssetSelected = true;
            this.mouAssetList = [...response.ReturnObject];
            this.listExclude = new Array<string>();
            for(const item of this.mouAssetList){
              this.listExclude.push(item["FullAssetCode"]);
            }
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {
      if(error != 0){
        console.log(error);
      }
    });
  }

  deleteMouAsset(mouCustAssetId, idx){
    var mouAsset = new MouCustAssetObj();
    mouAsset.MouCustAssetId = mouCustAssetId;
    this.httpClient.post(AdInsConstant.DeleteMouCustAsset, mouAsset).subscribe(
      (response: any) => {
        for(const value of this.mouAssetList){
          if(value["MouCustAssetId"] == mouCustAssetId){
            var idxExclude = this.listExclude.indexOf(value["FullAssetCode"]);
            this.listExclude.splice(idxExclude, 1);
            break;
          }
        }
        this.mouAssetList.splice(idx, 1);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}

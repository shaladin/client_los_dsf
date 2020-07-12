import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MouCustAssetObj } from 'app/shared/model/MouCustAssetObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustAssetDetailComponent } from './mou-cust-asset-detail/mou-cust-asset-detail.component';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-cust-asset',
  templateUrl: './mou-cust-asset.component.html'
})
export class MouCustAssetComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() IsAssetSelected: boolean;
  @Input() AssetTypeCode: string;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  index: number = 0;
  tempResponseMouCustAsset: any;
  mouAssetList: Array<object> = [];
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
    this.httpClient.post(URLConstant.GetListAssetTypeByCode, null).subscribe(
      (response: any) => {
        this.assetTypeList = response;
        if (this.AssetTypeCode != null) {
          this.MouCustClauseAssetForm.patchValue({
            AssetTypeCode: this.AssetTypeCode
          });
        } else {
          this.MouCustClauseAssetForm.patchValue({
            AssetTypeCode: response.ReturnObject[0].Key
          });
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.IsAssetSelected = false;
    console.log(this.IsAssetSelected)
    var mouAsset = new MouCustAssetObj();
    mouAsset.MouCustId = this.MouCustId;

    this.httpClient.post(URLConstant.GetMouCustAssetByMouCustId, mouAsset).subscribe(
      (response: any) => {
        console.log(this.IsAssetSelected);

        this.IsAssetSelected = false;
        if (response.ReturnObject != null && response.ReturnObject.length > 0) {
          this.IsAssetSelected = true;

          this.tempResponseMouCustAsset = response["ReturnObject"]

          var listMou = this.parentForm.controls[this.identifier] as FormArray;
          for (var i = this.index; i < this.tempResponseMouCustAsset.length; i++) {

            var tempMouAsset = {
              FullAssetCode: this.tempResponseMouCustAsset[i].FullAssetCode,
              FullAssetName: this.tempResponseMouCustAsset[i].FullAssetName
            }
            this.mouAssetList.push(tempMouAsset);

            var eachDataDetail = this.fb.group({
              FullAssetName: [this.tempResponseMouCustAsset[i].FullAssetName],
              FullAssetCode: [this.tempResponseMouCustAsset[i].FullAssetCode]
            }) as FormGroup;
            listMou.push(eachDataDetail);
          }

        }
      }
    );
  }

  openModalAddMouAsset() {
    this.listExclude = new Array<string>();
    for (const item of this.mouAssetList) {
      this.listExclude.push(item["FullAssetCode"]);
    }

    const modalMouAsset = this.modalService.open(MouCustAssetDetailComponent);
    if (this.listExclude.length == 0) {
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
        var tempMouAsset = {
          FullAssetCode: response.FullAssetCode,
          FullAssetName: response.FullAssetName
        }
        this.mouAssetList.push(tempMouAsset);

        this.spinner.hide();
        this.toastr.successMessage(response["message"]);

        var listMou = this.parentForm.controls[this.identifier] as FormArray;
        for (var i = 0; i < this.mouAssetList["length"]; i++) {
          var eachDataDetail = this.fb.group({
            FullAssetName: [tempMouAsset.FullAssetName],
            FullAssetCode: [tempMouAsset.FullAssetCode]
          }) as FormGroup;
          listMou.push(eachDataDetail);
          this.parentForm.controls[this.identifier]["controls"][i]["controls"].patchValue({
            FullAssetName: [tempMouAsset.FullAssetName],
            FullAssetCode: [tempMouAsset.FullAssetCode]
          });

        }
        this.index++;
        console.log(this.index);

      }
    ).catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }

  deleteMouAsset(mouCustAssetId, idx) {
    var confirmation = confirm("Are you sure to delete this data ?");
    if (confirmation == true) {
      var mouAsset = new MouCustAssetObj();
      mouAsset.MouCustAssetId = mouCustAssetId;
      this.mouAssetList.splice(idx, 1);
      var listMou = this.parentForm.controls[this.identifier] as FormArray;
      listMou.removeAt(idx);
      this.index--;
      if (this.mouAssetList.length == 0) {
        this.IsAssetSelected = false;
      }
    }
    // this.httpClient.post(AdInsConstant.DeleteMouCustAsset, mouAsset).subscribe(
    //   (response: any) => { 
    //       this.IsAssetSelected = false; 
    //     for(const value of this.mouAssetList){
    //       if(value["MouCustAssetId"] == mouCustAssetId){
    //         var idxExclude = this.listExclude.indexOf(value["FullAssetCode"]);
    //         this.listExclude.splice(idxExclude, 1);
    //         break;
    //       }
    //     }
    //     this.mouAssetList.splice(idx, 1);
    //     this.toastr.successMessage(response["message"]);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );


  }

}

import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MouCustAssetObj } from 'app/shared/model/MouCustAssetObj.Model';
import { ChangeMouCustAssetDetailComponent } from './change-mou-cust-asset-detail/change-mou-cust-asset-detail.component';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-change-mou-cust-asset',
  templateUrl: './change-mou-cust-asset.component.html'
})
export class ChangeMouCustAssetComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() IsAssetSelected: boolean;
  @Input() AssetTypeCode: string;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  index: number = 0;
  tempResponseMouCustAsset: Array<MouCustAssetObj>;
  tempResponseChangeMouAsset: Array<MouCustAssetObj>;
  mouAssetList: Array<object> = [];
  assetTypeList: Array<KeyValueObj>;
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
        this.assetTypeList = response.ReturnObject;
        if (this.AssetTypeCode != null) {
          this.MouCustClauseAssetForm.patchValue({
            AssetTypeCode: this.AssetTypeCode
          });
        } else {
          this.MouCustClauseAssetForm.patchValue({
            AssetTypeCode: response.ReturnObject[0].Key
          });
        }

      });
  }

  ngOnInit() {

    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.IsAssetSelected = false;

    this.httpClient.post(URLConstant.GetChangeMouCustAssetByMouCustId, { Id: this.MouCustId }).subscribe(
      (response: any) => {

        if (response.ReturnObject != null && response.ReturnObject.length > 0) {
          this.IsAssetSelected = true;

          this.tempResponseChangeMouAsset = response[CommonConstant.ReturnObj]

          var listMou = this.parentForm.controls[this.identifier] as FormArray;
          for (var i = this.index; i < this.tempResponseChangeMouAsset.length; i++) {

            var tempMouAsset = {
              FullAssetCode: this.tempResponseChangeMouAsset[i].FullAssetCode,
              FullAssetName: this.tempResponseChangeMouAsset[i].FullAssetName
            }
            this.mouAssetList.push(tempMouAsset);

            var eachDataDetail = this.fb.group({
              FullAssetName: [this.tempResponseChangeMouAsset[i].FullAssetName],
              FullAssetCode: [this.tempResponseChangeMouAsset[i].FullAssetCode]
            }) as FormGroup;
            listMou.push(eachDataDetail);
          }
        }
        else {
          this.httpClient.post(URLConstant.GetMouCustAssetByMouCustId, { Id: this.MouCustId }).subscribe(
            (response: any) => {

              this.IsAssetSelected = false;
              if (response.ReturnObject != null && response.ReturnObject.length > 0) {
                this.IsAssetSelected = true;

                this.tempResponseMouCustAsset = response[CommonConstant.ReturnObj]

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
      }
    );
  }

  openModalAddMouAsset() {
    this.listExclude = new Array<string>();
    for (const item of this.mouAssetList) {
      this.listExclude.push(item["FullAssetCode"]);
    }

    const modalMouAsset = this.modalService.open(ChangeMouCustAssetDetailComponent);
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

      }
    ).catch((error) => {
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
  }

}

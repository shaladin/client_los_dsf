import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateDoMultiAssetComponent } from '../create-do-multi-asset/create-do-multi-asset.component';
import { map, mergeMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-delivery-order-multi-asset-detail',
  templateUrl: './delivery-order-multi-asset-detail.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetDetailComponent implements OnInit {
  appId: number;
  agrmntId: number;
  doList: any;
  doAssetList: any;
  custType: string;
  licensePlateAttr: string;
  isCreateDOInvalid: boolean;
  createDOInvalidMsg: string;
  arrValue: Array<any> = new Array<any>();
  wfTaskListId: number;
  isFinal: boolean;

  DOAssetForm = this.fb.group({
    DOAssetList: this.fb.array([])
  });

  AppTcForm = this.fb.group({});

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private location: Location
  ) { 
    this.doList = new Array();
    this.doAssetList = new Array();
    this.isFinal = false;
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['AgrmntId'] != null) {
        this.agrmntId = params['AgrmntId'];
      }
      if(params['WfTaskListId'] != null){
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  ngOnInit() {
    if (this.wfTaskListId != null || this.wfTaskListId != undefined){
      this.claimTask();
    }
    this.arrValue.push(this.agrmntId);
    var doRequest = { AppId: this.appId, AgrmntId: this.agrmntId };
    let getDOAssetList = this.httpClient.post(AdInsConstant.GetAssetListForDOMultiAsset, doRequest);
    let getDOList = this.httpClient.post(AdInsConstant.GetListDeliveryOrderHByAppIdAgrmntId, doRequest);
    let checkAllDO = this.httpClient.post(AdInsConstant.CheckAllDeliveryOrderData, { AgrmntId: this.agrmntId });
    forkJoin([getDOAssetList, getDOList, checkAllDO]).subscribe(
      (response) => {
        // console.log("DO List: " + JSON.stringify(response[1]));
        this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
        this.custType = response[0]["MrCustTypeCode"];
        this.licensePlateAttr = response[0]["LicensePlateAttr"];
        this.doList = response[1]["DeliveryOrderHObjs"];
        var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

        for (const item of this.doAssetList) {
          var formGroup = this.fb.group({
            AppAssetId: [item.AppAssetId],
            AssetSeqNo: [item.AssetSeqNo],
            FullAssetName: [item.FullAssetName],
            AssetPriceAmt : [item.AssetPriceAmt],
            DownPaymentAmt : [item.DownPaymentAmt],
            SerialNo1 : [item.SerialNo1],
            SerialNo2 : [item.SerialNo2],
            SerialNo3 : [item.SerialNo3],
            SerialNo4 : [item.SerialNo4],
            SerialNo5 : [item.SerialNo5],
            OwnerName : [item.OwnerName],
            DeliveryNo : [item.DeliveryNo],
            DeliveryDt : [item.DeliveryDt],
            IsAvailable : [item.IsAvailable],
            ManufacturingYear: [item.ManufacturingYear],
            TempLetterNo: [item.TempLetterNo],
            IsSelected: false
          });
          formArray.push(formGroup);
        }

        this.isFinal = response[2]["IsFinal"];
        console.log("Is Final : " + this.isFinal);
      }
    );
  }

  async claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.wfTaskListId, pUserID: currentUserContext["UserName"]};
    console.log(wfClaimObj);
    this.httpClient.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  showModalDO(formArray: FormArray, mode: string, deliveryOrderHId: number){
    const modalCreateDO = this.modalService.open(CreateDoMultiAssetComponent);
    modalCreateDO.componentInstance.SelectedDOAssetList = formArray.value;
    modalCreateDO.componentInstance.LicensePlateAttr = this.licensePlateAttr;
    modalCreateDO.componentInstance.CustType = this.custType;
    modalCreateDO.componentInstance.AppId = this.appId;
    modalCreateDO.componentInstance.AgrmntId = this.agrmntId;
    modalCreateDO.componentInstance.Mode = mode;
    modalCreateDO.componentInstance.DeliveryOrderHId = deliveryOrderHId;
    modalCreateDO.result.then(
      (response) => {
        this.spinner.show();
        var doRequest = { AppId: this.appId, AgrmntId: this.agrmntId };
        let getDOAssetList = this.httpClient.post(AdInsConstant.GetAssetListForDOMultiAsset, doRequest);
        let getDOList = this.httpClient.post(AdInsConstant.GetListDeliveryOrderHByAppIdAgrmntId, doRequest);
        let checkAllDO = this.httpClient.post(AdInsConstant.CheckAllDeliveryOrderData, { AgrmntId: this.agrmntId });
        forkJoin([getDOAssetList, getDOList, checkAllDO]).subscribe(
          (response) => {
            this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
            this.custType = response[0]["MrCustTypeCode"];
            this.licensePlateAttr = response[0]["LicensePlateAttr"];
            this.doList = response[1]["DeliveryOrderHObjs"];
            var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

            while(formArray.length !== 0){
              formArray.removeAt(0);
            }

            for (const item of this.doAssetList) {
              var formGroup = this.fb.group({
                AppAssetId: [item.AppAssetId],
                AssetSeqNo: [item.AssetSeqNo],
                FullAssetName: [item.FullAssetName],
                AssetPriceAmt : [item.AssetPriceAmt],
                DownPaymentAmt : [item.DownPaymentAmt],
                SerialNo1 : [item.SerialNo1],
                SerialNo2 : [item.SerialNo2],
                SerialNo3 : [item.SerialNo3],
                SerialNo4 : [item.SerialNo4],
                SerialNo5 : [item.SerialNo5],
                OwnerName : [item.OwnerName],
                DeliveryNo : [item.DeliveryNo],
                DeliveryDt : [item.DeliveryDt],
                IsAvailable : [item.IsAvailable],
                ManufacturingYear: [item.ManufacturingYear],
                IsSelected: false
              });
              formArray.push(formGroup);
            }

            this.isFinal = response[2]["IsFinal"];
            console.log("Is Final : " + this.isFinal);
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

  editDOHandler(deliveryOrderHId){
    var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;
    this.showModalDO(formArray, "edit", deliveryOrderHId);
  }

  createDOHandler(){
    this.isCreateDOInvalid = true;
    var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      if(formArray.at(i).get("IsSelected").value == true){
        this.isCreateDOInvalid = false;
        break;
      }
    }
    if(this.isCreateDOInvalid){
      this.createDOInvalidMsg = "At Least 1 Asset Must Be Selected";
      return false;
    }
    else{
      this.showModalDO(formArray, "add", 0);
    }
  }

  deleteDO(deliveryOrderHId){
    var confirmation = confirm("Are you sure to delete this data ?");
    if(confirmation == true){
      this.spinner.show();
      var requestObj = { DeliveryOrderHId: deliveryOrderHId }
      this.httpClient.post(AdInsConstant.DeleteDeliveryOrderMultiAsset, requestObj).pipe(
        map((response) => {
          return response;
        }),
        mergeMap((response) => {
          var doRequest = { AppId: this.appId, AgrmntId: this.agrmntId };
          let getDOAssetList = this.httpClient.post(AdInsConstant.GetAssetListForDOMultiAsset, doRequest);
          let getDOList = this.httpClient.post(AdInsConstant.GetListDeliveryOrderHByAppIdAgrmntId, doRequest);
          let checkAllDO = this.httpClient.post(AdInsConstant.CheckAllDeliveryOrderData, { AgrmntId: this.agrmntId });
          var tempResponse = [response];
          return forkJoin([getDOAssetList, getDOList, tempResponse, checkAllDO]);
        })
      ).subscribe(
        (response) => {
          var deleteResponse = response[2];
          this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
          this.custType = response[0]["MrCustTypeCode"];
          this.licensePlateAttr = response[0]["LicensePlateAttr"];
          this.doList = response[1]["DeliveryOrderHObjs"];
          var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

          while(formArray.length !== 0){
            formArray.removeAt(0);
          }

          for (const item of this.doAssetList) {
            var formGroup = this.fb.group({
              AppAssetId: [item.AppAssetId],
              AssetSeqNo: [item.AssetSeqNo],
              FullAssetName: [item.FullAssetName],
              AssetPriceAmt : [item.AssetPriceAmt],
              DownPaymentAmt : [item.DownPaymentAmt],
              SerialNo1 : [item.SerialNo1],
              SerialNo2 : [item.SerialNo2],
              SerialNo3 : [item.SerialNo3],
              SerialNo4 : [item.SerialNo4],
              SerialNo5 : [item.SerialNo5],
              OwnerName : [item.OwnerName],
              DeliveryNo : [item.DeliveryNo],
              DeliveryDt : [item.DeliveryDt],
              IsAvailable : [item.IsAvailable],
              ManufacturingYear: [item.ManufacturingYear],
              TempLetterNo: [item.TempLetterNo],
              IsSelected: false
            });
            formArray.push(formGroup);
          }

          this.isFinal = response[3]["IsFinal"];
          console.log("Is Final : " + this.isFinal);

          this.spinner.hide();
          this.toastr.successMessage(deleteResponse["Message"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  Back(){
    this.location.back();
  }

  SaveForm(){
    if(this.doList.length > 0){
      // var tcFormData = this.AppTcForm.value.TCList;
      var tcFormData = { "ListAppTcObj": [...this.AppTcForm.value.TCList]};
      this.httpClient.post(AdInsConstant.EditAppTc, tcFormData).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigate(['/Nap/FinanceLeasing/AdminProcess/DeliveryOrderMultiAsset/Paging'], { queryParams: { BizTemplateCode: 'FL4W' }});
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else{
      this.toastr.errorMessage("At Least 1 Delivery Order Needed To Save");
    }
  }

  DOSubmitHandler(){
    if(!this.isFinal){
      this.toastr.errorMessage("All Asset Must Be Processed to Submit");
    }
    else{
      // var tcFormData = this.AppTcForm.value.TCList;
      var tcFormData = { "ListAppTcObj": [...this.AppTcForm.value.TCList]};
      let editTc = this.httpClient.post(AdInsConstant.EditAppTc, tcFormData);
      let submitDO = this.httpClient.post(AdInsConstant.SubmitDeliveryOrderMultiAsset, { TaskListId: this.wfTaskListId });
      forkJoin([editTc, submitDO]).subscribe(
        (response) => {
          this.toastr.successMessage(response[1]["Message"]);
          this.router.navigate(['/Nap/FinanceLeasing/AdminProcess/DeliveryOrderMultiAsset/Paging'], { queryParams: { BizTemplateCode: 'FL4W' }});
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

}

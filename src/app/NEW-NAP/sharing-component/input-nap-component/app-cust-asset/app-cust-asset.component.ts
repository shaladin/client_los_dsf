import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppCustAssetDetailComponent } from './app-cust-asset-detail/app-cust-asset-detail.component';

@Component({
  selector: 'app-app-cust-asset',
  templateUrl: './app-cust-asset.component.html',
  styles: []
})

export class AppCustAssetComponent implements OnInit {
  @Input() AppCustId: number;
  @Output() ResponseAppCustAsset: EventEmitter<any>;
  inputGridObj: InputGridObj;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { 
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppCustAsset.json";
    this.inputGridObj.resultData = {
      Data: []
    }
    this.inputGridObj.resultData["Data"] = new Array();
    this.ResponseAppCustAsset = new EventEmitter<any>();
  }

  ngOnInit() {
    if(this.AppCustId && this.AppCustId > 0){
      this.GetAppCustAssetData();
    }
  }

  Continue(){
    this.ResponseAppCustAsset.emit();
  }

  GetAppCustAssetData(){
    this.spinner.show();
    this.http.post(URLConstant.GetListAppCustAssetByAppCustId, { AppCustId: this.AppCustId }).toPromise().then(
      (response) => {
        this.inputGridObj.resultData = {
          Data: []
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppCustAssetObjList"];
        this.spinner.hide();
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  GetCallback(e){
    if(e.Key == "edit"){
      this.EditAppCustAsset(e.RowObj.AppCustAssetId);
    }
    else if(e.Key == "delete"){
      this.DeleteAppCustAsset(e.RowObj.AppCustAssetId);
    }
  }

  OpenModalHandler(appCustAssetId){
    const modal = this.modalService.open(AppCustAssetDetailComponent);
    modal.componentInstance.AppCustAssetId = appCustAssetId;
    modal.componentInstance.AppCustId = this.AppCustId;
    modal.result.then(
      (response) => {
        this.GetAppCustAssetData();
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  AddAppCustAsset(){
    this.OpenModalHandler(0);
  }

  EditAppCustAsset(appCustAssetId){
    this.OpenModalHandler(appCustAssetId);
  }

  DeleteAppCustAsset(appCustAssetId){
    var confirmation = confirm("Are you sure to delete this data ?");
    if(confirmation){
      this.http.post(URLConstant.DeleteAppCustAsset, { AppCustAssetId: appCustAssetId }).toPromise().then(
        (response) => {
          if(response["StatusCode"] == 200){
            this.toastr.successMessage(response["Message"]);
            this.GetAppCustAssetData();
          }
          else{
            this.toastr.errorMessage("Error Deleting AppCustAsset");
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

}

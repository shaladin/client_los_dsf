import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAssetObj } from 'app/shared/model/AppCustAsset/AppCustAssetObj.Model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppCustAssetOldNapDetailComponent } from './app-cust-asset-old-nap-detail/app-cust-asset-old-nap-detail.component';

@Component({
  selector: 'app-app-cust-asset-old-nap',
  templateUrl: './app-cust-asset-old-nap.component.html',
  styles: []
})
export class AppCustAssetOldNapComponent implements OnInit {
  @Input() AppCustId: number;
  ListAppCustAsset: Array<AppCustAssetObj>;
  @Output() ResponseAppCustAsset: EventEmitter<any>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { 
    this.ListAppCustAsset = new Array<AppCustAssetObj>();
    this.ResponseAppCustAsset = new EventEmitter();
  }

  ngOnInit() {
    console.log("AppCustId: " + this.AppCustId);
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
        this.ListAppCustAsset = response["AppCustAssetObjList"];
        console.log("ListAppCustAsset: " + JSON.stringify(this.ListAppCustAsset));
        this.spinner.hide();
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  OpenModalHandler(idx, mode){
    const modal = this.modalService.open(AppCustAssetOldNapDetailComponent);
    modal.componentInstance.AppCustAssetObj = this.ListAppCustAsset[idx];
    modal.componentInstance.AppCustId = this.AppCustId;
    modal.result.then(
      (response) => {
        if(mode == "ADD"){
          this.ListAppCustAsset.push(response);
        }
        else{
          this.ListAppCustAsset[idx] = response;
        }
        this.ResponseAppCustAsset.emit(this.ListAppCustAsset);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  AddAppCustAsset(){
    this.OpenModalHandler(0, "ADD");
  }

  EditAppCustAsset(idx){
    this.OpenModalHandler(idx, "EDIT");
  }

  DeleteAppCustAsset(idx){
    var confirmation = confirm("Are you sure to delete this data ?");
    if(confirmation){
      this.ListAppCustAsset.splice(idx, 1);
      this.toastr.successMessage("Success");
    }
  }

}

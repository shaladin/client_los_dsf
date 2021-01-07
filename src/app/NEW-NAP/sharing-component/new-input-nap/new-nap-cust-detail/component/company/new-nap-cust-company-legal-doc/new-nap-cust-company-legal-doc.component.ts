import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-company-legal-doc',
  templateUrl: './new-nap-cust-company-legal-doc.component.html',
  styles: []
})
export class NewNapCustCompanyLegalDocComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() AppCustCompanyId: number;
  @Output() ResponseLegalDoc: EventEmitter<object> = new EventEmitter();
  AppCustCompanyLegalDoc : AppCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();
  IsDetail: boolean = false;
  ListLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array();
  InputGridObj: InputGridObj = new InputGridObj();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { }

  ngOnInit() {
    this.InputGridObj.pagingJson =  "./assets/ucgridview/gridCustCompletionLegalDoc.json";
    this.LoadListLegalDocData();
  }

  LoadListLegalDocData(){
    if(this.AppCustCompanyId && this.AppCustCompanyId > 0){
      this.http.post(URLConstant.GetAppCustCompanyLegalDocsByAppCustCompanyId, { AppCustCompanyId: this.AppCustCompanyId }).subscribe(
        (response) => {
          this.InputGridObj.resultData = {
            Data: ""
          }
          this.InputGridObj.resultData["Data"] = new Array();
          this.InputGridObj.resultData.Data = response["ListCompanyLegalDoc"];
          this.ListLegalDoc = this.InputGridObj.resultData.Data;
        }
      );
    }
    else{
      this.InputGridObj.resultData = {
        Data: ""
      }
      this.InputGridObj.resultData["Data"] = new Array();
      this.InputGridObj.resultData.Data = this.ListLegalDoc;
    }
  }

  Add(){
    this.IsDetail = true;
    this.AppCustCompanyLegalDoc = new AppCustCompanyLegalDocObj();
  }

  GetCallback(event){
    if(event.Key == "edit"){
      this.AppCustCompanyLegalDoc = event.RowObj
      this.IsDetail = true;
    }else if(event.Key == "delete"){
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        if(event.RowObj["AppCustCompanyLegalDocId"] && event.RowObj["AppCustCompanyLegalDocId"] > 0){
          this.http.post(URLConstant.DeleteAppCustCompanyLegalDoc,  {AppCustCompanyLegalDocId : event.RowObj["AppCustCompanyLegalDocId"]}).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.LoadListLegalDocData();
            }
          );
        }
        else{
          var idxToDelete = this.ListLegalDoc.findIndex(x => x.MrLegalDocTypeCode == event.RowObj["MrLegalDocTypeCode"]);
          this.ListLegalDoc.splice(idxToDelete, 1);
        }
      }
    }
  }

  // Continue(){
  //   if(this.ListLegalDoc.length > 0){
  //     this.OutputTab.emit({IsComplete: true});
  //   }else{
  //     this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA)
  //     return;
  //   }
  // }

  GetEvent(e){
    this.IsDetail = false;
    this.ListLegalDoc = e.ListAppCustCompanyLegalDoc;
    this.LoadListLegalDocData();
    this.ResponseLegalDoc.emit(this.ListLegalDoc);
  }
}

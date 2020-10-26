import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-legal-doc-tab',
  templateUrl: './legal-doc-tab.component.html',
  styleUrls: ['./legal-doc-tab.component.scss']
})
export class LegalDocTabComponent implements OnInit {

  @Input() AppCustId: number;
  @Input() AppCustCompanyId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  AppCustCompanyLegalDoc : AppCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();
  IsDetail: boolean = false;
  ListLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array();
  InputGridObj: InputGridObj = new InputGridObj();
  
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) { }

  ngOnInit() {
    this.InputGridObj.pagingJson =  "./assets/ucgridview/gridCustCompletionLegalDoc.json";
    this.LoadListLegalDocData();
  }

  LoadListLegalDocData(){
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

  Add(){
    this.IsDetail = true;
    this.AppCustCompanyLegalDoc = new AppCustCompanyLegalDocObj();
  }

  GetCallback(event){
    if(event.Key == "edit"){
      this.AppCustCompanyLegalDoc = event.RowObj
      this.IsDetail = true;
    }else if(event.Key == "delete"){
      this.http.post(URLConstant.DeleteAppCustCompanyLegalDoc,  {AppCustCompanyLegalDocId : event.RowObj["AppCustCompanyLegalDocId"]}).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.LoadListLegalDocData();
        }
      );
    }
  }

  Continue(){
    this.OutputTab.emit();
  }

  GetEvent(){
    this.IsDetail = false;
    this.LoadListLegalDocData();
  }
}

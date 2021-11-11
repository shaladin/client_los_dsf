import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/app-cust-company-legal-doc-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { String } from 'typescript-string-operations';

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
  ReqByCodeObj: GenericObj = new GenericObj();
  ListLegalDocCantDuplicate: Array<string> = new Array<string>();
  ListTempLegalCheck: Array<any> = new Array<any>();
  
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) { }

  ngOnInit() {
    this.InputGridObj.pagingJson =  "./assets/ucgridview/gridCustCompletionLegalDoc.json";
    this.LoadListLegalDocData();
    this.checkGSLegalDoc();
  }

  async checkGSLegalDoc(){
    this.ReqByCodeObj.Code = CommonConstant.GSCodeListLegalDocCantDuplicate;
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, this.ReqByCodeObj).toPromise().then(
      (response) => {
        if (response["GsValue"] != undefined && response["GsValue"] != "") {
          this.ListLegalDocCantDuplicate = response["GsValue"].split('|')
        }
      }
    );
  }

  LoadListLegalDocData(){
    this.http.post(URLConstant.GetAppCustCompanyLegalDocsByAppCustCompanyId, { Id: this.AppCustCompanyId }).subscribe(
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
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        let tempObj: GenericObj = new GenericObj();
        tempObj.Id = event.RowObj["AppCustCompanyLegalDocId"];
        this.http.post(URLConstant.DeleteAppCustCompanyLegalDoc, tempObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.LoadListLegalDocData();
          }
        );
      }
    }
  }

  Continue(){
    if(this.ListLegalDoc.length == 0){
      this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA)
      return;
    }

      var groupedCustLegalDoc = this.groupBy(this.ListLegalDoc, function (item) {
        return [item.MrLegalDocTypeCode, item.DocNo];
      });
  
      var duplCustLegalDoc = groupedCustLegalDoc.filter(x => x.length > 1);
  
      if(duplCustLegalDoc != undefined){
        for(var i = 0; i < duplCustLegalDoc.length ; i++){
          this.ListTempLegalCheck = duplCustLegalDoc[i];
          var checkGSValue = this.ListLegalDocCantDuplicate.find(x => x == this.ListTempLegalCheck[0].MrLegalDocTypeCode);
          if(checkGSValue != null){
            this.toastr.warningMessage(String.Format(ExceptionConstant.DUPLICATE_LEGAL_DOC, duplCustLegalDoc[0].MrLegalDocTypeCode, duplCustLegalDoc[0].DocNo));
            return;
          }
        }
      }

    this.OutputTab.emit({IsComplete: true});
  }

  GetEvent(){
    this.IsDetail = false;
    this.LoadListLegalDocData();
  }

  groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }
}

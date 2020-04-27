import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-commission-reserved-fund-detail',
  templateUrl: './commission-reserved-fund-detail.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class CommissionReservedFundDetailComponent implements OnInit {

  TaskId;
  appId;
  ReturnHandlingHId;
  ReturnHandlingDId;
  show : boolean = false;

  HandlingForm = this.fb.group({
    ReturnHandlingNotes: [''],
    ReturnHandlingExecNotes: [''],
  });

  constructor(
    private route: ActivatedRoute,private http: HttpClient,private fb: FormBuilder,private toastr: NGXToastrService) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.TaskId =params["TaskId"];
      this.ReturnHandlingHId = params["ReturnHandlingHId"];
      this.ReturnHandlingDId = params["ReturnHandlingDId"];
    });
  }

  viewProdMainInfoObj;
  ngOnInit() {
    
    if(this.ReturnHandlingDId!=0){
      this.show = true;
    }

    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    
  }

  isTab1;
  isTab2;
  EnterTab(type){
    if (type == "tab1") {
      this.isTab1 = true;
      this.isTab2 = false;
    }
    if (type == "tab2") {
      this.isTab1 = false;
      this.isTab2 = true;
    }
  }

  
  EditReturnHandling(){
    var object = new ReturnHandlingDObj();
    object.AppId = this.appId;
    object.ReturnHandlingDId=this.ReturnHandlingDId;
    object.ReturnHandlingHId = this.ReturnHandlingHId;
    object.WfTaskListId = this.TaskId;
    object.ReturnHandlingNotes = this.HandlingForm.controls.ReturnHandlingNotes.value;
    object.ReturnHandlingExecNotes = this.HandlingForm.controls.ReturnHandlingExecNotes.value;
    object.ReturnStat ="REQ";
    object.MrReturnTaskCode = "RTN_EDIT_COM_RSV_FND";

    
    this.http.post(AdInsConstant.EditReturnHandlingD, object).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
      },
      error => {
        console.log(error);
      }
    );
  }

}

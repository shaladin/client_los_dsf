import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { CustPersonalObj } from 'app/shared/model/CustPersonalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';

@Component({
  selector: 'app-lead-input-page',
  templateUrl: './lead-input-page.component.html',
  providers: [NGXToastrService],
})
export class LeadInputPageComponent implements OnInit {
  private stepper: Stepper;
  LeadId: number;
  CopyFrom: number;
  isCustData: boolean;
  isLeadData: boolean;
  TaskListId: number;
  titlePageType: string;
  viewLeadHeaderMainInfo : string; 
  pageType: string;
  @ViewChild("LeadMainInfo", { read: ViewContainerRef }) leadMainInfo: ViewContainerRef;
  AppStepIndex :number =1;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if(params["mode"] == "update"){
        this.pageType = params["mode"];
        this.titlePageType = "UPDATE";
      }
      else if(params["mode"] == "edit" || params["mode"] == undefined){
        this.pageType = params["mode"];
        this.titlePageType = "INPUT";
      }
      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
    });
  }

  ngOnInit() {
    if (this.TaskListId > 0) {
      this.claimTask();
    }
    this.viewLeadHeaderMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.EnterTab('custData');
    this.stepper.to(1);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    this.leadMainInfo.clear();
    const component = this.leadMainInfo.createComponent(componentFactory);
    component.instance.viewInput = this.viewLeadHeaderMainInfo;
  }

  EnterTab(type) {
    if (type == "custData") {
      this.isCustData = true;
      this.isLeadData = false;
      this.AppStepIndex = 1;
    }
    if (type == "leadData") {
      this.isCustData = false;
      this.isLeadData = true;
      this.AppStepIndex = 2;
    }
  }
  
  editMainInfoHandler(){
    var modeName : string;
    if(this.pageType == undefined){
      modeName = "edit";
    }
    else{
      modeName = this.pageType;
    }
    this.router.navigate(["/Lead/LeadInput/MainInfo"], { queryParams: { LeadId: this.LeadId, mode: modeName }});
  }

  cancelHandler(){
    if(this.pageType == "update"){
      this.router.navigate(['/Lead/LeadUpdate/Paging']);  
    }
    else{
      this.router.navigate(['/Lead/Lead/Paging']);  
    }
  }

  getValue(ev){
    if (ev.stepMode != undefined){
      if (ev.stepMode == "next"){
        this.stepper.next();
        this.EnterTab("leadData");

        if(this.isLeadData == true){
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
          this.leadMainInfo.clear();
          const component = this.leadMainInfo.createComponent(componentFactory);
          component.instance.viewInput = this.viewLeadHeaderMainInfo;
        }
      }
      else{
        this.stepper.previous();
      }
    }
  }
  
  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.TaskListId, pUserID: currentUserContext["UserName"] };
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
    }	
}
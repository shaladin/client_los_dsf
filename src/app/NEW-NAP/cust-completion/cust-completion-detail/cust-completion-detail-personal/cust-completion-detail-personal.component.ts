import { Component, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-detail-personal',
  templateUrl: './cust-completion-detail-personal.component.html',
  styleUrls: ['./cust-completion-detail-personal.component.scss']
})
export class CustCompletionDetailPersonalComponent implements OnInit {
  private stepper: Stepper;
  stepIndex: number = 1;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  CustStep = {
    "Detail": 1,
    "Address": 2,
    "Family": 3,
    "Job": 4,
    "Emergency": 5,
    "Financial": 6,
    "CustAttr": 7,
  }
  constructor() { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionPersonalData.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      }
    ];
    
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
  }

  EnterTab(type: string) {
    switch (type) {
      case "Detail":
        this.stepIndex = this.CustStep["Detail"];
        break;
      case "Address":
        this.stepIndex = this.CustStep["Address"];
        break;
      case "Family":
        this.stepIndex = this.CustStep["Family"];
        break;
      case "Job":
        this.stepIndex = this.CustStep["Job"];
        break;
      case "Emergency":
        this.stepIndex = this.CustStep["Emergency"];
        break;
      case "Financial":
        this.stepIndex = this.CustStep["Financial"];
        break;
      case "CustAttr":
        this.stepIndex = this.CustStep["CustAttr"];
        break;
    }
    this.stepper.to(this.stepIndex);
  }

  NextStep(){
    this.stepper.next();
  }
}

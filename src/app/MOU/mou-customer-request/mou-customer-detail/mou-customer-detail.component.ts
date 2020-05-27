import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Location } from '@angular/common';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustTcComponent } from '../mou-cust-tc/mou-cust-tc.component';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-mou-customer-detail',
  templateUrl: './mou-customer-detail.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerDetailComponent implements OnInit {
  private stepper: Stepper;
  @ViewChild("MouTcGeneral") public mouTcGeneral: MouCustTcComponent;
  @ViewChild("MouTcFactoring") public mouTcFactoring: MouCustTcComponent;
  mouType: string;
  mouCustId: number;
  currentStepIndex: number;
  mode : string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('MOUType') != null) {
        this.mouType = params.get('MOUType');
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['mouCustId'] != null) {
        this.mouCustId = params['mouCustId'];
      }
    });
    this.currentStepIndex = 1;
   }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.stepper.to(this.currentStepIndex);
    console.log(this.stepper);
  }

  mouDetailGeneral(e){
    this.stepHandler(e);
  }

  mouDetailFactoring(e){
    this.stepHandler(e);
  }

  mouCustFee(e){
    this.stepHandler(e);
  }

  mouAddColl(e){
    this.stepHandler(e);
  }
  getModeDetail(e){
    if(e!=null){
      this.mode = e.mode;
      console.log(e);
      console.log(this.mode);
    }
  }
  mouCustTc(e){
    this.stepHandler(e);
  }

  saveMouTc(){
    if(this.mouType == AdInsConstant.GENERAL){
      this.mouTcGeneral.Save();
    }
    else if(this.mouType == AdInsConstant.FACTORING){
      this.mouTcFactoring.Save();
    }
  }

  backFromMouTc(){
    this.stepHandler({StatusCode: "-1"});
  }

  mouDocumentBack(){
    this.stepper.previous();
  }

  editMainInfoHandler(){
    this.router.navigate(["/Mou/Request/Detail"], { queryParams: { MouCustId: this.mouCustId, mode: "edit", MrMouTypeCode: this.mouType }});
  }

  cancelHandler(){
    this.router.navigate(['/Mou/Request/Paging']);
  }

  submitHandler(){
    if((this.mouType == AdInsConstant.GENERAL && this.currentStepIndex == 4 ) || (this.mouType == AdInsConstant.FACTORING && this.currentStepIndex == 6) ){
      var mouObj = { MouCustId: this.mouCustId}
      this.httpClient.post(AdInsConstant.SubmitWorkflowMouRequest, mouObj).subscribe(
        (response: any) => {
          this.toastr.successMessage("Success");
          this.router.navigate(['/Mou/Request/Paging']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else{
      this.toastr.errorMessage("Please follow the steps first");
    }
  }

  stepHandler(response){
    switch (response["StatusCode"].toString()) {
      case "200":
        this.stepper.next();
        this.currentStepIndex++;
        break;

      case "-1":
        this.stepper.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        this.router.navigate(['/Mou/Request/Paging']);
        break;
    
      default:
        break;
    }
  }

}

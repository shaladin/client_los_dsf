import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mou-customer-detail',
  templateUrl: './mou-customer-detail.component.html',
  styleUrls: ['./mou-customer-detail.component.scss'],
  providers: [NGXToastrService]
})
export class MouCustomerDetailComponent implements OnInit {
  @ViewChild("WizardMouDetail") public wizard: WizardComponent;
  mouType: string;
  mouCustId: number;

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
   }

  ngOnInit() {
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

  mouCustTc(e){
    this.stepHandler(e);
  }

  mouDocumentBack(){
    this.wizard.goToPreviousStep();
  }

  editMainInfoHandler(){
    this.router.navigate(["/Mou/Request/Detail"], { queryParams: { mouCustId: this.mouCustId, mode: "edit", mrMouTypeCode: this.mouType }});
  }

  cancelHandler(){
    this.router.navigate(['/Mou/Request/Paging']);
  }

  submitHandler(){
    if(this.wizard.isLastStep()){
      this.toastr.successMessage("Success");
      this.router.navigate(['/Mou/Request/Paging']);
    }
    else{
      this.toastr.errorMessage("Please follow the steps first");
    }
  }

  stepHandler(response){
    switch (response["StatusCode"].toString()) {
      case "200":
        this.wizard.goToNextStep();
        break;

      case "-1":
        this.wizard.goToPreviousStep();
        break;

      case "-2":
        this.router.navigate(['/Mou/Request/Paging']);
        break;
    
      default:
        break;
    }
  }

}

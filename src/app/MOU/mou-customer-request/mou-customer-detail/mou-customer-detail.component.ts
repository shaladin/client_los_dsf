import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  @ViewChild(WizardComponent) public wizard: WizardComponent;
  currentWizardIdx: number;
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
    this.currentWizardIdx = 0;
    this.route.queryParams.subscribe(params => {
      if (params['MOUType'] != null) {
        this.mouType = params['MOUType'];
      }
      if (params['mouCustId'] != null) {
        this.mouCustId = params['mouCustId'];
      }
    });
   }

  ngOnInit() {
  }

  enterTab(){

  }

  nextStep(){
    this.wizard.goToNextStep();
    this.currentWizardIdx++;
  }

}

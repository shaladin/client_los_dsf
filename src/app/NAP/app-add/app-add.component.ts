import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-app-add',
  templateUrl: './app-add.component.html',
  styleUrls: ['./app-add.component.scss'],
  providers: [NGXToastrService]
})
export class AppAddComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService
  ) { }

  NapAppForm = this.fb.group({
    AppId : [''],
    MouCustId : [''],
    LeadId : [''],
    AppNo : [''],
    OriOfficeCode : [''],
    OriOfficeName : [''],
    CrtOfficeCode : [''],
    CrtOfficeName : [''],
    ProdOfferingCode : [''],
    ProdOfferingName : [''],
    ProdOfferingVersion : [''],
    AppCreatedDt : [''],
    AppStat : [''],
    AppCurrStep : [''],
    AppLastStep : [''],
    CurrCode : [''],
    LobCode : [''],
    RefProdTypeCode : [''],
    Tenor : [''],
    NumOfInst : [''],
    PayFreqCode : [''],
    MrFirstInstTypeCode : [''],
    NumOfAsset : [''],
    MrLcCalcMethodCode : [''],
    LcInstRatePrml : [''],
    LcInsRatePrml : [''],
    MrAppSourceCode : [''],
    MrWopCode : [''],
    SrvyOrderNo : [''],
    ApvDt : [''],
    SalesHeadNo : [''],
    SalesNotes : [''],
    SalesOfficerNo : [''],
    CreditAdminNo : [''],
    CreditAnalystNo : [''],
    CreditRiskNo : [''],
    DataEntryNo : [''],
    MrSalesRecommendCode : [''],
    MrCustNotifyOptCode : [''],
    PreviousAppId : [''],
    IsAppInitDone : [''],
    MrOrderInfoCode : [''],
    ApprovalStat : [''],
    RsvField1 : [''],
    RsvField2 : [''],
    RsvField3 : [''],
    RsvField4 : [''],
    RsvField5 : ['']
  });

  ngOnInit() {
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
  }

  SaveForm() {

  }

}

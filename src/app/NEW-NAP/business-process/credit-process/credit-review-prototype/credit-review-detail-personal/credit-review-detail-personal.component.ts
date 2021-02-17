import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-credit-review-detail-personal',
  templateUrl: './credit-review-detail-personal.component.html',
  styleUrls: ['./credit-review-detail-personal.component.scss']
})
export class CreditReviewDetailPersonalComponent implements OnInit {

  listDeviation : any = new Array();
  listAppAgr : any = new Array();
  listObligor : any = new Array();
  closeResultAppl: string;
  custType: any = "C";
  return : any = "Yes";

  readonly ViewSrvyLink: string = NavigationConstant.VIEW_SRVY;
  readonly CancelLink: string = NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PROTOTYPE_PAGING;
  constructor(private http: HttpClient, private spinner: NgxSpinnerService,
    private toastr: NGXToastrService, private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private router : Router) {
      this.route.queryParams.subscribe(params => {
        if (params["custType"] != null) {
          this.custType = params["custType"];
        }
      });
     }


  ngOnInit() {
    for (var i = 0; i < 3; i++) {
      var number = i + 1;
      var obj = {
        DeviationCriteria: "Criteria " + number,
        ApprovalAt: "BM",
        Notes: "-",
      }
      this.listDeviation.push(obj);
    }
    for(var i = 0; i < 4; i++){
      var number = i + 1;
      var objAppAgr = {
        AppNo: "APP00" + number,
        AgrNo: "AGR00" + number,
        GoLiveDt:  "0" +(number+7) + "/02/2020",
        OfferingName: "PROD CF",
        ContractStatus: "LIV",
        OSPrincipal: "5.000.00" + number + ",00",
        FPD: "No",
      }
      if(i==0){
        objAppAgr.FPD = "Yes (6)";
      }
      if(i==2 || i == 3){
        objAppAgr.GoLiveDt =  (number+7) + "/02/2020";
      }
      
      this.listAppAgr.push(objAppAgr);
    }
    for(var i = 0; i < 3; i++){
      var number2 = i + 4;
      var number3 = i + 7;
      var objObligor = {
        AppNo: "APP00" + number2,
        AgrNo: "AGR00" + number2,
        ProductOfferingName: "PROD 00" + number3,
        OutstandingAR: "130.000.000,00",
        ApplicationStep: "-",
        ApplicationStatus: "-",
        ContractStatus: "LIV",
        CustomerName : "Bunga",
        CustomerNameGuarantor : "Budi",
        CustomerNameShareholder : "PT ABC",
      }
      if(i==0){
        objObligor.OutstandingAR = "120.000.000,00";
        objObligor.CustomerNameShareholder = "PT 123";

      }
      if(i==2){
        objObligor.ApplicationStep = "TC";
        objObligor.ApplicationStatus = "PRP";
        objObligor.ContractStatus = "-";
        objObligor.AgrNo = "-";
        objObligor.CustomerNameGuarantor = "Spouses";
        objObligor.CustomerNameShareholder = "PT MUNDUR";
      }
      this.listObligor.push(objObligor);
    }
  }

  deleteData(i) {
    if (confirm("Are You sure to delete this data?")) {
      this.listDeviation.splice(i, 1);
    }
  }
  addDeviation(){
    var obj = {
      DeviationCriteria: "Criteria 1",
      ApprovalAt: "BM",
      Notes: "-",
    }
    this.listDeviation.push(obj);
  }
  openAppl(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResultAppl = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResultAppl = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  saveForm(){
    this.toastr.successMessage('Submit Success !');
    AdInsHelper.RedirectUrl(this.router,[this.CancelLink], {});
  }
  switchForm1(){
    this.return = "No";
  }
  switchForm2(){
    this.return = "Yes";
  }
}

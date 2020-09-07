import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-credit-review-paging',
  templateUrl: './credit-review-paging.component.html',
  styleUrls: ['./credit-review-paging.component.scss']
})
export class CreditReviewComponent implements OnInit {

  listCreditReview : any;
  isSearch : string = '0';

  CreditReviewForm = this.fb.group({
    AppNo : [''],
    CustName : [''],
    ProdOfferingName : ['']
  });

  constructor(private http: HttpClient, private spinner: NgxSpinnerService,
    private toastr: NGXToastrService, private fb: FormBuilder) { }

  ngOnInit() {
    this.listCreditReview = [
      {
        CreditReviewId: 1,
        AppNo: "201907APP010001",
        CustName: "Andi",
        ProdOfferingName: "Prod Offering 001",
        OrderInformation: "New Order",
        ApplicationDate: "12/06/2019",
        CustType: "P",
        OfficeName: "Office Dummy II"
      },
      {
        CreditReviewId: 2,
        AppNo: "201907APP010002",
        CustName: "PT. Maju Mundur",
        ProdOfferingName: "Prod Offering 002",
        OrderInformation: "Repeat Order",
        ApplicationDate: "13/06/2019",
        CustType: "C",
        OfficeName: "Office Dummy I"

      },
      {
        CreditReviewId: 3,
        AppNo: "201907APP010003",
        CustName: "Cindy",
        ProdOfferingName: "Prod Offering 003",
        OrderInformation: "New Order",
        ApplicationDate: "14/08/2019",
        CustType: "P",
        OfficeName: "Office Dummy III"

      },
      {
        CreditReviewId: 4,
        AppNo: "201907APP010004",
        CustName: "Dini",
        ProdOfferingName: "Prod Offering 004",
        OrderInformation: "New Order",
        ApplicationDate: "22/08/2019",
        CustType: "P",
        OfficeName: "Office Dummy II"

      }];
  }

  Search(){
    this.isSearch = '1';
  }

  Reset(){
     this.isSearch = '0';
  }

  delete(creditReviewId: any) {
    if (confirm("Are you sure to delete this record?")) {
        this.listCreditReview.splice(creditReviewId-1 , 1);
  }
}

}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-customer-doc-printing-detail',
  templateUrl: './customer-doc-printing-detail.component.html',
  styleUrls: ['./customer-doc-printing-detail.component.css']
})
export class CustomerDocPrintingDetailComponent implements OnInit {
  viewObj: string;
  MouCustId: any;
  GetListMouCustDocPrintForViewByMouCustIdUrl  = AdInsConstant.GetListMouCustDocPrintForViewByMouCustId;
  responseObj: any;
  EditMouCustDocPrintSequenceNoUrl =  AdInsConstant.EditMouCustDocPrintSequenceNo;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    // private adInsService: AdInsService,
    // private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.viewObj = "./assets/ucviewgeneric/viewCustomerDocPrinting.json";
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
    });
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetListMouCustDocPrintForViewByMouCustIdUrl, mouObj).subscribe(
      response => {
        this.responseObj = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
  }
  print(MouCustDocPrintId){
    var mouObj = { "MouCustDocPrintId": MouCustDocPrintId };
    this.http.post(this.EditMouCustDocPrintSequenceNoUrl, mouObj).subscribe(
      response => {
        var message = response['Message'];
        var mouCustObj = { "MouCustId": this.MouCustId };
        this.http.post(this.GetListMouCustDocPrintForViewByMouCustIdUrl, mouCustObj).subscribe(
          response => {
            this.responseObj = response['ReturnObject'];
          },
          error => {
            this.router.navigateByUrl('Error');
          }
        );
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
    
  }
}
 
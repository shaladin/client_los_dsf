import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-comm-after-approval-inquiry-detail',
  templateUrl: './edit-comm-after-approval-inquiry-detail.component.html',
  styleUrls: ['./edit-comm-after-approval-inquiry-detail.component.css']
})
export class EditCommAfterApprovalInquiryDetailComponent implements OnInit {


  BizTemplateCode:string="";
  TrxId:number=0;
  AppId:number=0;
  IsViewReady:boolean=false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) {
      this.route.queryParams.subscribe(params => {
        if (params["EditCommAftApvTrxNoId"] != null) {
          this.TrxId = params["EditCommAftApvTrxNoId"];
        }
        if (params['BizTemplateCode'] != null) {
          this.BizTemplateCode = params['BizTemplateCode'];
        }
        if (params['AppId'] != null) {
          this.AppId = params['AppId'];
        }
        this.IsViewReady = true;
      });
     }
  


  async ngOnInit() {
    
  }

  

}

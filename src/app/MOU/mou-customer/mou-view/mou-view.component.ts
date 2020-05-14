import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';

@Component({
  selector: 'app-mou-view',
  templateUrl: './mou-view.component.html',
})
export class MouViewComponent implements OnInit {
 @Input() inputMouCustId;
  
  getMouCustByIdUrl : any;
  MouCustId : any;
  mouCustObj : any;
  resultData : any;
  MrMouTypeCode : any;
  constructor(private http: HttpClient, private route: ActivatedRoute) { 
    this.getMouCustByIdUrl = AdInsConstant.GetMouCustById;
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null)
        this.MouCustId = params["MouCustId"];
      else
       this.MouCustId = this.inputMouCustId;
    });
   
  }
  viewMouHeader: any;
  ngOnInit() {
    this.viewMouHeader = "./assets/ucviewgeneric/viewMouHeader.json";
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
     
    this.http.post(this.getMouCustByIdUrl, this.mouCustObj).subscribe(
      (response) => {
        this.resultData = response;
        this.MrMouTypeCode = this.resultData['MrMouTypeCode']; 
      },
      (error) =>{
        console.log(error);
      }
    );
  }
}
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustRvwHObj } from 'app/shared/model/MouCustRvwHObj.Model';
import { MouCustRvwDObj } from 'app/shared/model/MouCustRvwDObj.Model';

@Component({
  selector: 'app-mou-view-approval-history',
  templateUrl: './mou-view-approval-history.component.html',
})
export class MouViewApprovalHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  GetMouCustRvwHByMouCustIdUrl : string;
  GetListMouCustRvwDUrl : string;
  responseMouCustRvwH: MouCustRvwHObj;
  mouCustRvwHObj : MouCustRvwHObj;
  mouCustRvwDObj : MouCustRvwDObj;
  listMouCustRvwDObj : any;
  constructor(private http: HttpClient, private router: Router) { 
    this.GetMouCustRvwHByMouCustIdUrl = AdInsConstant.GetMouCustRvwHByMouCustId;
    this.GetListMouCustRvwDUrl = AdInsConstant.GetListMouCustRvwD;

  }

  ngOnInit() {

    console.log(this.GetMouCustRvwHByMouCustIdUrl); 
    this.mouCustRvwHObj = new  MouCustRvwHObj();
    this.mouCustRvwDObj = new MouCustRvwDObj();
    this.mouCustRvwHObj.MouCustId = this.MouCustId;

    this.http.post(this.GetMouCustRvwHByMouCustIdUrl, this.mouCustRvwHObj).subscribe(
      (response: MouCustRvwHObj) => {
        this.responseMouCustRvwH = response ; 

        this.mouCustRvwDObj.MouCustRvwHId =  this.responseMouCustRvwH.MouCustRvwHId;
        this.http.post(this.GetListMouCustRvwDUrl, this.mouCustRvwDObj).subscribe(
          response => {
            this.listMouCustRvwDObj = response['ReturnObject'];
         
          });


      },
      () => {
        this.router.navigateByUrl('Error');
      });

    }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agreement-view-container',
  templateUrl: './agreement-view-container.component.html',
  styleUrls: ['./agreement-view-container.component.scss']
})
export class AgreementViewContainerComponent implements OnInit {

  AgrmntId: number;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params["AgrmntId"];
    })
  }

  ngOnInit() {
  }

}

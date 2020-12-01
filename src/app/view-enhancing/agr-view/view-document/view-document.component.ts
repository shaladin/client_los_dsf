import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "agrmnt-view-document",
  templateUrl: "./view-document.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntDocumentComponent implements OnInit {

  @Input() agrmntId: any;

  agrmntObj = {
    AgrmntId: 0,
  };

  AgrmntSignerObj: any;
  AgrmntDocObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }


  ngOnInit() {
    this.agrmntObj.AgrmntId = this.agrmntId;
    this.GetAgrmntSigner();
    this.GetAgrmntDoc();
  }

  GetAgrmntSigner() {
    this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        console.log(response);
        this.AgrmntSignerObj = response;
      }
    );
  }

  GetAgrmntDoc() {
    this.http.post(URLConstant.GetListAgrmntDocPrintByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        this.AgrmntDocObj = response;
      }
    );
  }

}

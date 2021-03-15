import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
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
  agrmntIdObj = {
    Id: 0,
  };
  AgrmntSignerObj: any;
  AgrmntDocObj: any;

  constructor(private http: HttpClient) {
    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }

  ngOnInit() {
    this.agrmntObj.AgrmntId = this.agrmntId;
    this.agrmntIdObj.Id = this.agrmntId;
    this.GetAgrmntSigner();
    this.GetAgrmntDoc();
  }

  GetAgrmntSigner() {
    this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        this.AgrmntSignerObj = response;
      }
    );
  }

  GetAgrmntDoc() {
    this.http.post(URLConstant.GetListAgrmntDocPrintByAgrmntId, this.agrmntIdObj).subscribe(
      (response) => {
        this.AgrmntDocObj = response;
      }
    );
  }
}
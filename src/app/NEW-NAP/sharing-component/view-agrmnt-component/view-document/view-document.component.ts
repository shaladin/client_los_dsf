import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AgrmntSignerObj } from 'app/shared/model/AgrmntSignerObj.Model';
import { AgrmntDocObj } from 'app/shared/model/AgrmntDocObj.Model';

@Component({
  selector: "agrmnt-view-document",
  templateUrl: "./view-document.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntDocumentComponent implements OnInit {
  @Input() agrmntId: number;
  AgrmntSignerObj: any;
  AgrmntDocObj: AgrmntDocObj;

  constructor(private http: HttpClient) {
    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }

  ngOnInit() {
    this.GetAgrmntSigner();
    this.GetAgrmntDoc();
  }

  GetAgrmntSigner() {
    this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response: AgrmntSignerObj) => {
        this.AgrmntSignerObj = response;
      }
    );
  }

  GetAgrmntDoc() {
    this.http.post(URLConstant.GetListAgrmntDocPrintByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response: AgrmntDocObj) => {
        this.AgrmntDocObj = response;
      }
    );
  }
}
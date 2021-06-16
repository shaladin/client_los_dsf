import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: "agrmnt-view-document",
  templateUrl: "./view-document.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntDocumentComponent implements OnInit {
  @Input() agrmntId: any;
  @Input() BizTemplateCode: string;

  agrmntObj = {
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
    this.agrmntObj.Id = this.agrmntId;
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
    this.http.post(URLConstant.GetListAgrmntDocPrintByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        this.AgrmntDocObj = response[CommonConstant.ReturnObj];
      }
    );
  }
}
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit} from '@angular/core';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-crd-rvw-ica-verdict-dsf',
  templateUrl: './crd-rvw-ica-verdict-dsf.component.html',
  styleUrls: ['./crd-rvw-ica-verdict-dsf.component.css']
})
export class CrdRvwIcaVerdictDsfComponent implements OnInit {

  @Input() AppId: number = 0;
  @Input() IsInput: boolean = false;
  @Input() IsView: boolean = false;
  
  IsIcaVerdictEmpty: boolean= false;
  IcaVerdictColor: string = ""
  IcaVerdictValue: string = ""

  constructor(
    private http: HttpClient,
  ) {

  }

  async ngOnInit() {
    await this.GetAppCrdRvwHDsfByAppId()
  }

  async GetAppCrdRvwHDsfByAppId() {
    let req = {
      AppId: this.AppId
    }

    this.http.post(URLConstantDsf.GetAppCrdRvwHDsfByAppId, req).subscribe(
      (response) => {
        this.IsIcaVerdictEmpty = !(response['IcaVerdictColor'] && response['IcaVerdictColor'])
        if (this.IsIcaVerdictEmpty) {
          return
        }

        this.IcaVerdictColor = response['IcaVerdictColor'],
        this.IcaVerdictValue = response['IcaVerdictValue']
      });
  }
}

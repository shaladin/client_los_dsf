import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-lead-main-info',
  templateUrl: './lead-main-info.component.html',
  styleUrls: ['./lead-main-info.component.scss'],
  providers: [NGXToastrService, DatePipe]
})
export class LeadMainInfoComponent implements OnInit {
  @Input() LeadId: any;

  LeadNo: any;
  CrtOfficeName: any;
  OrderNo: any;
  LobCode: any;
  MrLeadSourceCode: any;
  AgencyName: any;
  leadUrl: string;

  constructor(private fb: FormBuilder, private http: HttpClient, public datepipe: DatePipe) { }

  ngOnInit() {
    var leadObj = { Id: this.LeadId }
    this.http.post(URLConstant.GetLeadByLeadId, leadObj).subscribe(
      (response) => {
        this.LeadNo = response['LeadNo'];
        this.CrtOfficeName = response['CrtOfficeName'];
        this.OrderNo = response['OrderNo'];
        this.LobCode = response['LobCode'];
        this.MrLeadSourceCode = response['MrLeadSourceCode'];
        this.AgencyName = response['AgencyName'];
      }
    )
    this.leadUrl = '/View/Lead?LeadId=' + this.LeadId;
  }

  MainInfoForm = this.fb.group({})
}
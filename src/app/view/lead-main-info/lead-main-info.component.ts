import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { AdInsConstant } from 'app/shared/AdInstConstant';
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

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, public datepipe: DatePipe) { }


  ngOnInit() {
    var leadObj = { LeadId: this.LeadId }
    console.log(leadObj);
    this.http.post(URLConstant.GetLeadByLeadId, leadObj).subscribe(
      (response) => {
        this.LeadNo = response['LeadNo'];
        this.CrtOfficeName = response['CrtOfficeName'];
        this.OrderNo = response['OrderNo'];
        this.LobCode = response['LobCode'];
        this.MrLeadSourceCode = response['MrLeadSourceCode'];
        this.AgencyName = response['AgencyName'];
      })
      this.leadUrl = '/Lead/View?LeadId=' + this.LeadId;
  }

  MainInfoForm = this.fb.group({
  })

}

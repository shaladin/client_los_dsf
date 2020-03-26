import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mou-view-survey',
  templateUrl: './mou-view-survey.component.html',
  styleUrls: ['./mou-view-survey.component.scss']
})
export class MouViewSurveyComponent implements OnInit {
  @Input() MouCustId: any;
  constructor() { }

  ngOnInit() {
  }

}

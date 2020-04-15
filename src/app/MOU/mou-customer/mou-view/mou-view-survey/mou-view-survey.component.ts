import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mou-view-survey',
  templateUrl: './mou-view-survey.component.html',
})
export class MouViewSurveyComponent implements OnInit {
  @Input() MouCustId: any;
  constructor() { }

  ngOnInit() {
  }

}

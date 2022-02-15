import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputPageXComponent } from './new-lead-input-page-x.component';

describe('NewLeadInputPageXComponent', () => {
  let component: NewLeadInputPageXComponent;
  let fixture: ComponentFixture<NewLeadInputPageXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputPageXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputPageXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

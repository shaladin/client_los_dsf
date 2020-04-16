import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalComponent } from './view-approval.component';

describe('ViewApprovalComponent', () => {
  let component: ViewApprovalComponent;
  let fixture: ComponentFixture<ViewApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

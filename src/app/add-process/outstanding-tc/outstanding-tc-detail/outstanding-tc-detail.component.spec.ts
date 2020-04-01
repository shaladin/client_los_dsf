import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingTcDetailComponent } from './outstanding-tc-detail.component';

describe('OutstandingTcDetailComponent', () => {
  let component: OutstandingTcDetailComponent;
  let fixture: ComponentFixture<OutstandingTcDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingTcDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingTcDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

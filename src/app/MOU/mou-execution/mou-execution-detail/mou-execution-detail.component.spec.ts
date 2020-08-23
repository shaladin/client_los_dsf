import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouExecutionDetailComponent } from './mou-execution-detail.component';

describe('MouExecutionDetailComponent', () => {
  let component: MouExecutionDetailComponent;
  let fixture: ComponentFixture<MouExecutionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouExecutionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouExecutionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

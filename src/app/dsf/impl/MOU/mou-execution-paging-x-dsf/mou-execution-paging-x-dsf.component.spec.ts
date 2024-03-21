import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouExecutionPagingXDsfComponent } from './mou-execution-paging-x-dsf.component';

describe('MouExecutionPagingXDsfComponent', () => {
  let component: MouExecutionPagingXDsfComponent;
  let fixture: ComponentFixture<MouExecutionPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouExecutionPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouExecutionPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

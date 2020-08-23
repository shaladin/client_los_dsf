import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouExecutionPagingComponent } from './mou-execution-paging.component';

describe('MouExecutionPagingComponent', () => {
  let component: MouExecutionPagingComponent;
  let fixture: ComponentFixture<MouExecutionPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouExecutionPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouExecutionPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

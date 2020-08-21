import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouDupCheckPagingComponent } from './mou-dup-check-paging.component';

describe('MouDupCheckPagingComponent', () => {
  let component: MouDupCheckPagingComponent;
  let fixture: ComponentFixture<MouDupCheckPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouDupCheckPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouDupCheckPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

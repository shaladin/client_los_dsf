import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwDiffWithInProcessAppComponent } from './crd-rvw-diff-with-in-process-app.component';

describe('CrdRvwDiffWithInProcessAppComponent', () => {
  let component: CrdRvwDiffWithInProcessAppComponent;
  let fixture: ComponentFixture<CrdRvwDiffWithInProcessAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwDiffWithInProcessAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwDiffWithInProcessAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

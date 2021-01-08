import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwNegCheckListComponent } from './crd-rvw-neg-check-list.component';

describe('CrdRvwNegCheckListComponent', () => {
  let component: CrdRvwNegCheckListComponent;
  let fixture: ComponentFixture<CrdRvwNegCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwNegCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwNegCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

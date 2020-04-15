import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoExtensionPagingComponent } from './po-extension-paging.component';

describe('PoExtensionPagingComponent', () => {
  let component: PoExtensionPagingComponent;
  let fixture: ComponentFixture<PoExtensionPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoExtensionPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoExtensionPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

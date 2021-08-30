import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDataAddEditXComponent } from './asset-data-add-edit-x.component';

describe('AssetDataAddEditXComponent', () => {
  let component: AssetDataAddEditXComponent;
  let fixture: ComponentFixture<AssetDataAddEditXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDataAddEditXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDataAddEditXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

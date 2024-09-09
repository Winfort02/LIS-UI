import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HematologyDetailComponent } from './hematology-detail.component';

describe('HematologyDetailComponent', () => {
  let component: HematologyDetailComponent;
  let fixture: ComponentFixture<HematologyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HematologyDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HematologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

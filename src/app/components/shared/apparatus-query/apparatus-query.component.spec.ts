import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusQueryComponent } from './apparatus-query.component';

describe('ApparatusQueryComponent', () => {
  let component: ApparatusQueryComponent;
  let fixture: ComponentFixture<ApparatusQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApparatusQueryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApparatusQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LokalFormComponent } from './lokal-form.component';

describe('LokalFormComponent', () => {
  let component: LokalFormComponent;
  let fixture: ComponentFixture<LokalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LokalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LokalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

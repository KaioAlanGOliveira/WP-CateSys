import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesqAlunoLst } from './pesq-aluno-lst';

describe('PesqAlunoLst', () => {
  let component: PesqAlunoLst;
  let fixture: ComponentFixture<PesqAlunoLst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesqAlunoLst],
    }).compileComponents();

    fixture = TestBed.createComponent(PesqAlunoLst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

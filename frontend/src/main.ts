// ESTA LINHA É A PRIMEIRA E MAIS IMPORTANTE:
import 'zone.js'; 

import { bootstrapApplication } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background: #fff; color: #333;">
      <h2 style="color: #007bff;">🚀Cadastrar Funcionários</h2>
      
      <div style="margin-bottom: 20px; display: flex; gap: 10px;">
        <input [(ngModel)]="novoFuncionario.nome" placeholder="Nome completo" style="padding: 10px; flex: 1; border: 1px solid #ddd; border-radius: 4px;">
        <input [(ngModel)]="novoFuncionario.cargo" placeholder="Cargo" style="padding: 10px; flex: 1; border: 1px solid #ddd; border-radius: 4px;">
        <button (click)="cadastrar()" style="padding: 10px 20px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 4px; font-weight: bold;">Salvar</button>
      </div>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

      <h3>Funcionários Ativos ({{ funcionarios.length }})</h3>
      <div *ngIf="funcionarios.length === 0" style="color: #666; font-style: italic;">Nenhum funcionário encontrado.</div>
      
      <ul style="list-style: none; padding: 0;">
        <li *ngFor="let f of funcionarios" style="padding: 12px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between; align-items: center;">
          <span>
            <strong>{{ f.nome }}</strong> 
            <small style="display: block; color: #666;">{{ f.cargo }}</small>
          </span>
          <button (click)="deletar(f.id)" style="color: #dc3545; border: 1px solid #dc3545; background: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Excluir</button>
        </li>
      </ul>
    </div>
  `
})
export class App implements OnInit {
  funcionarios: any[] = [];
  novoFuncionario = { nome: '', cargo: '' };
  private apiUrl = '/api/funcionarios';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.listar(); }

  listar() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.funcionarios = data,
      error: (err) => console.error('Erro ao buscar funcionários:', err)
    });
  }

  cadastrar() {
    if (!this.novoFuncionario.nome || !this.novoFuncionario.cargo) return;
    this.http.post(this.apiUrl, this.novoFuncionario).subscribe({
      next: () => {
        this.novoFuncionario = { nome: '', cargo: '' };
        this.listar();
      },
      error: (err) => console.error('Erro ao cadastrar:', err)
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.listar(),
        error: (err) => console.error('Erro ao deletar:', err)
      });
    }
  }
}

// Bootstrap simples para evitar conflitos de hidratação
bootstrapApplication(App, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));

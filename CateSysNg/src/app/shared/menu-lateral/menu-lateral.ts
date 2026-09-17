import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
})
export class MenuLateral {
  larguraMenu = '200px'; // Largura padrão (aberto)

  encolher() {
    // Se estiver em 300px, muda para 260px. Se não, volta para 300px.
    if (this.larguraMenu === '150px') {
      this.larguraMenu = '56px';
    } else {
      this.larguraMenu = '300px';
    }
  }
}

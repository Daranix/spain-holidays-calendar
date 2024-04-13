import { Component, model, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-icon',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './menu-icon.component.html',
  styleUrl: './menu-icon.component.scss'
})
export class MenuIconComponent {


  readonly toggleMenu = model<boolean>(false);


}

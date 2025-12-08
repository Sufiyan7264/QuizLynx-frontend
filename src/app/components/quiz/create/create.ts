import { Component } from '@angular/core';
import { InputText, InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create',
  imports: [InputText,InputTextModule],
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class Create {

}

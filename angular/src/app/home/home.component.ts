import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RouterLink]
})
export class HomeComponent { }


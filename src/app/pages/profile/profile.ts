import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatchValidator } from '../../shared/validators/match-validator';
import { IUser } from '@recipe/shared';
import { AuthService } from '../../shared/services/auth-service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user!: IUser;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {}

  onEdit() {}
}

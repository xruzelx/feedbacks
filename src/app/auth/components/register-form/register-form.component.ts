import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { EMAIL_REGEXP } from 'src/configs/consts.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AurhService } from 'src/app/auth.service';
import { FeedbackService } from 'src/app/feedback.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {

  iserrorMessage: boolean = false;
  errorMessage: string;

  registerForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.pattern(EMAIL_REGEXP)]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
    
  });

  constructor(
    public authService: AurhService,
    public feedbackService: FeedbackService,
    public afs: AngularFirestore,
    public router: Router,
  ){}


  tryRegister(){
    if(this.registerForm.valid){
      this.authService.doRegister(this.registerForm.value)
      .then(res => {
        this.router.navigate(['/']);
      }, err => {
        this.showError(err.message)
      })
    } else {
      Object.keys(this.registerForm.controls).forEach(control => this.registerForm.controls[control].markAsTouched());
    }
  }

  showError(msg){
    this.iserrorMessage = true;
    this.errorMessage = msg
  }
}

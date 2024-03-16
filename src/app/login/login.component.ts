import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private fB:FormBuilder, private api:ApiService, private router:Router){}

  loginForm = this.fB.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.pattern('[a-zA-z0-9]*')]]
  })

  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.value.email
      const password = this.loginForm.value.password

      const user = {email, password}
      this.api.loginapi(user).subscribe({
        next:(res:any)=>{
          console.log(res);
          
          sessionStorage.setItem("username",res.existingUser.username)
          sessionStorage.setItem("token",res.token)

          Swal.fire({
            position: "top",
            title: "Wow...",
            text: "Login successfull",
            icon: "success"
          });
          this.router.navigateByUrl('')
        },
        error:(err:any)=>{
          console.log(err);
          Swal.fire({
            position: "top",
            title: "Oops...",
            text: err.error,
            icon: "error"
          });
          
        }
      })
    }
    else{
      Swal.fire({
        position: "top",
        title: "Oops...",
        text: "Invalid form",
        icon: "error"
      });
    }
  }

}

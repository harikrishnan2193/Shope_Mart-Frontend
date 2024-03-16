import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private fB:FormBuilder, private api:ApiService, private router:Router){}

  registerForm = this.fB.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.pattern('[a-zA-z0-9]*')]]
  })

  register(){
    if(this.registerForm.valid){
      const username = this.registerForm.value.username
      const email = this.registerForm.value.email
      const password = this.registerForm.value.password

      const user = {username, email, password}
      this.api.registerapi(user).subscribe({
        next:(res:any)=>{
          console.log(res);
          
          Swal.fire({
            position: "top",
            title: "Wow...",
            text: "Registration complitted",
            icon: "success"
          });
          this.router.navigateByUrl('/login')
          
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

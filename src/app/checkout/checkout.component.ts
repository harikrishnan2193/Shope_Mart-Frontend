import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  public payPalConfig ? : IPayPalConfig;

  procedToPaystatus:boolean = false
  mackPaymentStatus:boolean = false

  grandtotal:any = ""

  checkoutForm = this.fb.group({
    uname:["",[Validators.required , Validators.pattern('[a-zA-Z]*')]],
    flat:["",[Validators.required , Validators.pattern('[0-9a-zA-Z:,.]*')]],
    place:["",[Validators.required , Validators.pattern('[a-zA-Z]*')]],
    pincode:["",[Validators.required , Validators.pattern('[0-9]*')]]
  })

  constructor(private fb:FormBuilder, private api:ApiService, private router:Router){}

  cancel(){
    this.checkoutForm.reset()
  }

  proceedToPay(){
    if(this.checkoutForm.valid){
      this.procedToPaystatus = true
      this.grandtotal = sessionStorage.getItem("total")
    }
    else{
      Swal.fire({
        position: "top",
        title: "Oops...",
        text: "Enter valid input",
        icon: "info"
      });
    }
  }

  back(){
    this.procedToPaystatus = false
  }

  mackPayment(){
    this.mackPaymentStatus = true
    this.initConfig()
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: this.grandtotal,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: this.grandtotal
                        }
                    }
                },  
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },

        //invoke when payment is successfull
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.api.getCartCount()
            Swal.fire({
              position: "top",
              title: "Wow...",
              text: "Payment Successfull ",
              icon: "success"
            });
            this.procedToPaystatus = false
            this.mackPaymentStatus = false
            this.api.emptyAllCartProduct().subscribe((res:any)=>{
              this.api.getCartCount()
            Swal.fire({
              position: "top",
              title: "Wow...",
              text: "Payment Successfull ",
              icon: "success"
            });
            this.procedToPaystatus = false
            this.mackPaymentStatus = false
            this.router.navigateByUrl("/")
            })
  
        },
        //when payment cancelled
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            Swal.fire({
              position: "top",
              title: "Oops...",
              text: "Payment Cancelled",
              icon: "info"
            });

            this.procedToPaystatus = true

        },
        //erroe in gateway
        onError: err => {
            console.log('OnError', err);
            Swal.fire({
              position: "top",
              title: "Oops...",
              text: "Transaction failed please try again after sometime",
              icon: "error"
            });

            this.procedToPaystatus = true
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            
        }
    };
}
}

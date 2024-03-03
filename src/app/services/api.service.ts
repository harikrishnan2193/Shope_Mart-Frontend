import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverUrl = 'http://localhost:3000'

  wishlistCount = new BehaviorSubject(0)   //behaviour subject
  cartCount = new BehaviorSubject(0)

  constructor(private http:HttpClient) { 
    if(sessionStorage.getItem("token")){
      this.getWishlistCount() // to avoid removal of the value while refreshing
      this.getCartCount()
    }
  }

  getallproductapi(){
    return this.http.get(`${this.serverUrl}/all-products`)
  }

  registerapi(user:any){
    return this.http.post(`${this.serverUrl}/register`,user)
  }

  loginapi(user:any){
    return this.http.post(`${this.serverUrl}/login`,user)
  }

  getaproductapi(id:any){
    return this.http.get(`${this.serverUrl}/get-product/${id}`)
  }

  addTokenToHeader(){
    // create an object for the class HttpHeaders
    let headers = new HttpHeaders()
    const token = sessionStorage.getItem("token") //getting token for the session storage
    if(token){
      // appending token to the headers of the request
      headers = headers.append('Authorization',`Bearer ${token}`)
    }
    return {headers}
  }

  addtowishlistapi(product:any){
    return this.http.post(`${this.serverUrl}/add-wishlist`,product,this.addTokenToHeader())
  }

  getWishlistItemapi(){
    return this.http.get(`${this.serverUrl}/wishlist/allproduct`,this.addTokenToHeader())
  }

  getWishlistCount(){
    this.getWishlistItemapi().subscribe((res:any)=>{
      this.wishlistCount.next(res.length)
    })
  }

  removeItermFromWishlist(id:any){
    return this.http.delete(`${this.serverUrl}/wishlist/removeItem/${id}`,this.addTokenToHeader())
  }

  //add to cart
  addToCartapi(product:any){
    return this.http.post(`${this.serverUrl}/add-cart`,product,this.addTokenToHeader())
  }

  //get items to cart
  getCartItemapi(){
    return this.http.get(`${this.serverUrl}/cart/all-product`,this.addTokenToHeader())
  }

  //get cart count
  getCartCount(){
    this.getCartItemapi().subscribe((res:any)=>{
      this.cartCount.next(res.length)
    })
  }

  //remove item from cart Summary
  removeCartItem(id:any){
    return this.http.delete(`${this.serverUrl}/cart/remove-item/${id}`,this.addTokenToHeader())
  }

  //increment item
  incrementCartItem(id:any){
    return this.http.get(`${this.serverUrl}/cart/increment/${id}`,this.addTokenToHeader())
  }

  //decrement item
  decrementCartItem(id:any){
    return this.http.get(`${this.serverUrl}/cart/decrement/${id}`,this.addTokenToHeader())
  }

  //empty cart
  emptyAllCartProduct(){
    return this.http.delete(`${this.serverUrl}/empty-cart`,this.addTokenToHeader())
  }
}

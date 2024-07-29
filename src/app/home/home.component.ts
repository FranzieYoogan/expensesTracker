import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) {}

  data:any
  ngOnInit(): void {

    this.http.get('http://localhost:3000/expenses').subscribe(config => {
      console.log(config)
      this.data = config
    });

  }

  add() {

    const name:any = document.getElementById('name')
    const date:any = document.getElementById('date')
    const amount:any = document.getElementById('amount')
    const error:any = document.getElementById('error')
    
    if(name.value && date.value && amount.value) {


    const body = {

      "expenseName": name.value,
      "expenseDate": date.value,
      "expenseAmount": amount.value

    }

    this.http.post('http://localhost:3000/expenses', body).subscribe(config => {
      console.log('Updated config:', config);

    });


    setTimeout(() => {

      window.location.href = "/"

    }, 2000);
  

  } else if(name.value == "" || date.value == "" || amount.value == "") {

   

    error.style.visibility = "visible"

    setTimeout(() => {

      window.location.href = "/"

    }, 2000);

  }

  }

  delete(item: any) {
  
    this.http.delete(`http://localhost:3000/expenses/${item}`)
    .subscribe((config) => console.log(config,'deleted successfully'));


  }

}

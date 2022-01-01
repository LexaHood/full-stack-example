import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }
}

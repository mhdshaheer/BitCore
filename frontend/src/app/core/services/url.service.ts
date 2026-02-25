import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Url } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private readonly apiUrl = `${environment.apiUrl}/url`;

  constructor(private http: HttpClient) {}

  shorten(originalUrl: string): Observable<ApiResponse<Url>> {
    return this.http.post<ApiResponse<Url>>(`${this.apiUrl}/shorten`, { originalUrl });
  }

  getMyUrls(): Observable<ApiResponse<Url[]>> {
    return this.http.get<ApiResponse<Url[]>>(`${this.apiUrl}/my-urls`);
  }

  deleteUrl(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`, {});
  }

  getShortUrl(code: string): string {
    return `${environment.apiUrl}/${code}`;
  }
}

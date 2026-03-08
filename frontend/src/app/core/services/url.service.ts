import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Url } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { API_ROUTES } from '../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private readonly _apiUrl = `${environment.apiUrl}/${API_ROUTES.URL.PREFIX}`;

  constructor(private _http: HttpClient) {}

  shorten(originalUrl: string): Observable<ApiResponse<Url>> {
    return this._http.post<ApiResponse<Url>>(`${this._apiUrl}/${API_ROUTES.URL.SHORTEN}`, { originalUrl });
  }

  getMyUrls(): Observable<ApiResponse<Url[]>> {
    return this._http.get<ApiResponse<Url[]>>(`${this._apiUrl}/${API_ROUTES.URL.MY_URLS}`);
  }

  deleteUrl(id: string): Observable<ApiResponse<void>> {
    return this._http.post<ApiResponse<void>>(`${this._apiUrl}/${API_ROUTES.URL.DELETE(id)}`, {});
  }

  getShortUrl(code: string): string {
    return `${environment.apiUrl}/${code}`;
  }
}

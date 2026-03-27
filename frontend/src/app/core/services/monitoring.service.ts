import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { API_ROUTES } from '../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${environment.apiUrl}/${API_ROUTES.MONITORING.PREFIX}`;

  ping(): Observable<ApiResponse<{ success: boolean; message: string; timestamp: string }>> {
    return this._http.get<ApiResponse<{ success: boolean; message: string; timestamp: string }>>(`${this._apiUrl}/${API_ROUTES.MONITORING.PING}`);
  }

  registerMonitor(url: string): Observable<ApiResponse<{ success: boolean; message: string; monitorId?: string }>> {
    return this._http.post<ApiResponse<{ success: boolean; message: string; monitorId?: string }>>(`${this._apiUrl}/${API_ROUTES.MONITORING.REGISTER}`, { url });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(
    baseUrl: string,
    endpoint: string,
    params?: any,
    headers?: HttpHeaders
  ): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(`${baseUrl}/${endpoint}`, {
      params: httpParams,
      headers,
    });
  }

  post<T>(
    baseUrl: string,
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.post<T>(`${baseUrl}/${endpoint}`, body, { headers });
  }

  put<T>(
    baseUrl: string,
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.put<T>(`${baseUrl}/${endpoint}`, body, { headers });
  }

  delete<T>(
    baseUrl: string,
    endpoint: string,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.delete<T>(`${baseUrl}/${endpoint}`, { headers });
  }
}

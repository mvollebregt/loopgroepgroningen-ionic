import {Request, Response} from 'express';
import {SingleUseCookieJar} from './single-use-cookie-jar';

export function prepareResponse(eventualResponse: Response, originalRequest: Request, cookieJar: SingleUseCookieJar): void {
  copyCookiesToResponse(eventualResponse, cookieJar);
  setCorsHeaders(eventualResponse, originalRequest);
}

function copyCookiesToResponse(eventualResponse: Response, cookieJar: SingleUseCookieJar): void {
  const originalCookies: string[] = cookieJar.getResponseCookies();
  eventualResponse.header('Access-Control-Expose-Headers', 'Set-Vegetable');
  eventualResponse.append('Set-Vegetable', originalCookies.map(transformToVegetable));
}

function transformToVegetable(cookie: string): string {
  return cookie.substring(0, cookie.indexOf(';'));
}

function setCorsHeaders(eventualResponse: Response, originalRequest: Request): void {
  const origin = originalRequest.get('origin');
  if (origin && origin.startsWith('http://localhost')) {
    eventualResponse.header('Access-Control-Allow-Origin', origin);
    eventualResponse.header('Access-Control-Allow-Credentials', 'true');
    eventualResponse.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    eventualResponse.header('Access-Control-Max-Age', '1000');
    eventualResponse.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token , Authorization, Vegetable');
  }
}
import { InjectionToken } from "@angular/core";
import { Request, Response } from "express";

export const HOST_URL = new InjectionToken<string>('HOST_URL');
export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');

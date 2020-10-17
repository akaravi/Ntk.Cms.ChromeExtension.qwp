import { InjectionToken } from '@angular/core';
/**
 * provides the currently opened tab id
 */
export const TAB_ID = new InjectionToken<number>('CHROME_TAB_ID');
export const TAB = new InjectionToken<any>('CHROME_TAB');

import { FileUploadComponent } from './pages/upload-file/fileUpload.component';
import Flow from '@flowjs/flow.js';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  CoreAuthService, EnumDeviceType, EnumOperatingSystemType, TokenDeviceClientInfoDtoModel,
  LinkManagementTargetService
} from 'ntk-cms-api';
import { environment } from 'src/environments/environment';

import { OptionsComponent } from './pages/options/options.component';
import { PopupComponent } from './pages/popup/popup.component';

import { FlowInjectionToken, NgxFlowModule } from '@flowjs/ngx-flow';



@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    OptionsComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxFlowModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    CoreAuthService,
    LinkManagementTargetService,
    {
      provide: FlowInjectionToken,
      useValue: Flow,
    },
  ],
})
export class AppModule {

  constructor(private coreAuthService: CoreAuthService) {
    // karavi:Important For Test To Local Service
    if (environment.cmsServerConfig.configApiServerPath && environment.cmsServerConfig.configApiServerPath.length > 0) {
      this.coreAuthService.setConfig(environment.cmsServerConfig.configApiServerPath);
    }
    const DeviceToken = this.coreAuthService.getDeviceToken();
    if (!DeviceToken || DeviceToken.length === 0) {

      const model: TokenDeviceClientInfoDtoModel = {
        SecurityKey: environment.cmsTokenConfig.SecurityKey,
        ClientMACAddress: '',
        OSType: EnumOperatingSystemType.Chromium,
        DeviceType: EnumDeviceType.WebSite,
        PackageName: '',
        AppBuildVer: 0,
        AppSourceVer: '',
        Country: '',
        DeviceBrand: '',
        Language: '',
        LocationLat: '',
        LocationLong: '',
        NotificationId: '',
        SimCard: '',
      };



      this.coreAuthService.ServiceGetTokenDevice(model).toPromise();
    }
  }

}

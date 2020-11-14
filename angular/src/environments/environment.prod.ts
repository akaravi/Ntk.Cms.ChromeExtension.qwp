import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';
export const environment = {
  production: false,
  cmsServerConfig : {
    configApiRetry: 1,
    configApiServerPath: 'https://apicms.ir/api/v1/',
    // configApiServerPath: 'http://localhost:2390/api/v1/',
    // configApiServerPath: 'http://878cb0a6366f.ngrok.io/api/v1/',
    configRouteThumbnails: 'https://oco.ir/imageThumbnails/',
    configRouteUploadFileContent: 'https://apicms.ir/api/v1/FileContent/upload/',
  },
  cmsTokenConfig : {
    SecurityKey: 'qwp123456',
    ClientMACAddress: '',
    OSType: EnumOperatingSystemType.Windows,
    DeviceType: EnumDeviceType.WebSite,
    PackageName: '',
  }
};

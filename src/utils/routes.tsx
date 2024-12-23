export const ROUTES = {
  CAMERA: 'Camera',
  PERMISSION: 'Permission',
  NO_CAMERA_DEVICE: 'nocameradevice',
  PASSPORT_DETECTED: 'passport',
};
export type Routes = (typeof ROUTES)[keyof typeof ROUTES];

export const ROUTES = {
  CAMERA: 'Camera',
  PERMISSION: 'Permission',
  NO_CAMERA_DEVICE: 'nocameradevice',
};
export type Routes = (typeof ROUTES)[keyof typeof ROUTES];

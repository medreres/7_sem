import { ComponentLoader, OverridableComponent } from 'adminjs';
import path from 'path';
import * as url from 'url';

// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();

// componentLoader.override('Sidebar', './sidebar-resource-section');

// export const add = (url: string, componentName: string): string =>
//   componentLoader.add(componentName, path.join(__dirname, url));

// export const override = (
//   url: string,
//   componentName: OverridableComponent,
// ): string => componentLoader.override(componentName, path.join(__dirname, url));

// override('Sidebar', 'SidebarResourceSection');

export const components = {
  ImagePreview: componentLoader.add('ImagePreview', './image-preview'),
  ApproveInvoice: componentLoader.add('ApproveInvoice', './approve-invoice'),
  RejectInvoice: componentLoader.add('RejectInvoice', './reject-invoice'),
  Dashboard: componentLoader.add('Dashboard', './dashboard'),
};

import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const components = {
  ImagePreview: componentLoader.add('ImagePreview', './image-preview'),
  ApproveInvoice: componentLoader.add('ApproveInvoice', './approve-invoice'),
  RejectInvoice: componentLoader.add('RejectInvoice', './reject-invoice'),
};

export { componentLoader, components };

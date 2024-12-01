// @ts-nocheck
import { Loader } from '@adminjs/design-system';
import { ActionProps, ApiClient } from 'adminjs';
import React, { useEffect } from 'react';

const PdfGenerator: React.FC<ActionProps> = (props) => {
  const { record, resource } = props;
  const api = new ApiClient();

  useEffect(() => {
    api
      .recordAction({
        recordId: record.id,
        resourceId: resource.id,
        actionName: 'PDFGenerator',
      })
      .then(async (response) => {
        const content = response.data.file as string;

        const filename = 'order.pdf';

        // Decode the Base64 content to a Blob
        const binaryData = atob(content); // Decode Base64 to binary

        console.log('binaryData', binaryData);

        const arrayBuffer = new Uint8Array(binaryData.length).map((_, i) =>
          binaryData.charCodeAt(i),
        );

        console.log('arrayBuffer', arrayBuffer);

        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

        console.log('blob', blob);

        // Create a Blob URL and open the PDF
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, '_blank');
      })
      .catch((err) => {
        console.error('error when fetching file', err);
      });
  }, []);

  return <Loader />;
};

export default PdfGenerator;

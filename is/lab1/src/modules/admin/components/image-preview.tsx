import { BasePropertyProps } from 'adminjs';
import React, { useState } from 'react';
import Viewer from 'react-viewer/dist';

import { WithAttachment } from '../../attachment/types/with-attachment.js';

const IMAGE_PLACEHOLDER =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNLEL-qmmLeFR1nxJuepFOgPYfnwHR56vcw&s';

const ImagePreview: React.FC<BasePropertyProps> = ({ record }) => {
  const entity = record?.params as WithAttachment;

  const [isImageVisible, setIsImageVisible] = useState(false);

  const imageUrl = entity.attachments?.at(0)?.fileUrl ?? IMAGE_PLACEHOLDER;

  return (
    <>
      <button type="button" onClick={() => setIsImageVisible((prev) => !prev)}>
        <img alt="invoice" src={imageUrl} width={300} />
      </button>
      <Viewer
        visible={isImageVisible}
        images={[{ src: imageUrl }]}
        onClose={() => setIsImageVisible(false)}
      />
    </>
  );
};

export default ImagePreview;

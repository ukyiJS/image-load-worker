import { useState } from 'react';
import ImageContainer from '@/components/imageContainer';
import { useImageLoadWorker } from '@/hooks/useImageLoadWorker';
import { useRandomImage } from '@/hooks/useRandomImage';

enum UpdateType {
  ALL = 'ALL',
  INCREMENTALLY = 'INCREMENTALLY',
}

export default function Worker(): JSX.Element {
  const [imageLength, setImageLength] = useState(60);
  const [updateType, setUpdateType] = useState(UpdateType.ALL);
  const images = useRandomImage(imageLength);
  const { imageBlobs, maxWorkers } = useImageLoadWorker({ images, incrementalUpdate: updateType === UpdateType.INCREMENTALLY });

  const onUpdateTypeChange = async (type: UpdateType) => {
    const length = imageLength;

    setUpdateType(type);
    setImageLength(0);

    await new Promise(resolve => setTimeout(resolve, 100));
    setImageLength(length);
  };

  return (
    <section className="flex flex-col gap-4 w-full h-full">
      <form className="flex justify-center gap-4">
        {Object.values(UpdateType).map((type, i) => (
          <label key={i}>
            <input type="radio" name="update-type" value={type} checked={updateType === type} onChange={() => onUpdateTypeChange(type)} />
            {type.toLowerCase()}
          </label>
        ))}
      </form>
      <ImageContainer>
        {imageBlobs.map((image, i) => (
          <span key={i} className={`inline-flex justify-center items-center rounded w-24 h-36 bg-cover transition-all ease-linear delay-1000 ${image === undefined && 'bg-gray-300'} ${image === null && 'accent-red-600'}`} style={{ backgroundImage: image && `url(${image})` }}>
            {image === null && 'error'}
            {image === undefined && 'loading...'}
          </span>
        ))}
      </ImageContainer>
    </section>
  );
}

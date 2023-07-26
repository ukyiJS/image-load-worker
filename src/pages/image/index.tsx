import ImageContainer from '@/components/imageContainer';
import { useRandomImage } from '@/hooks/useRandomImage';

export default function Image(): JSX.Element {
  const images = useRandomImage(100);

  return (
    <section className="w-full h-full">
      <ImageContainer>
        {images.map((image, i) => <img key={i} src={image} alt={`${i}-image`} className="w-24 rounded" />)}
      </ImageContainer>
    </section>
  );
}

import { useCallback, useEffect, useState } from 'react';
import ImageWorker from '../workers/imageLoaderWorker.ts?worker';

type UseImageLoadWorker = {
  imageBlobs: string[];
  maxWorkers: number;
};

export function useImageLoadWorker({ images, incrementalUpdate }: { images: string[]; incrementalUpdate: boolean; }): UseImageLoadWorker {
  const maxWorkers = window.navigator.hardwareConcurrency || 2;
  const chunkSizeForWorker = Math.ceil(images.length / maxWorkers);

  const [imageBlobs, setImageBlobs] = useState<string[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    if (!workers.length) setWorkers(Array.from({ length: maxWorkers }, () => new ImageWorker()));

    return () => workers.forEach((worker) => worker.terminate());
  }, [maxWorkers, workers]);

  const getImageChunks = (imageUrls: string[]): string[][] => Array.from({ length: maxWorkers }, (_, i) => {
    const startIndex = i * chunkSizeForWorker;

    return imageUrls.slice(startIndex, startIndex + chunkSizeForWorker);
  });

  const revokeObjectUrls = (objectUrls: string[]) => {
    if (!objectUrls.length) return;

    objectUrls.forEach((url) => url && URL.revokeObjectURL(url));
  };

  const loadAllImagesAtOnce = useCallback(async (imageUrls: string[]) => {
    if (!window.Worker) return;

    revokeObjectUrls(imageBlobs);
    setImageBlobs(new Array(imageUrls.length).fill(undefined));

    const imagePromises = getImageChunks(imageUrls).map((chunk, chunkIndex) => new Promise<string[]>(resolve => {
      const chunkWorker = workers[chunkIndex];
      if (!chunkWorker) return;

      chunkWorker.postMessage(chunk);
      chunkWorker.onmessage = (e) => resolve(e.data);
    }));

    const imageBlobsChunks = await Promise.all(imagePromises);
    setImageBlobs(imageBlobsChunks.flat());
  }, [workers]);

  const loadImagesIncrementally = useCallback(async (imageUrls: string[]) => {
    if (!window.Worker || !workers.length) return;
    const imageBlobs: string[] = Array.from({ length: imageUrls.length });
    setImageBlobs(imageBlobs);

    const imagePromises = getImageChunks(imageUrls).map((chunk, chunkIndex) => new Promise<{ imageUrls: string[]; chunkIndex: number; }>((resolve) => {
      const chunkWorker = workers[chunkIndex];
      if (!chunkWorker) return;

      chunkWorker.postMessage(chunk);
      chunkWorker.onmessage = (e) => resolve({ imageUrls: e.data, chunkIndex });
    }));

    for (const imagePromise of imagePromises) {
      try {
        const { imageUrls, chunkIndex } = await imagePromise;
        imageUrls.forEach((url, index) => (imageBlobs[chunkIndex * chunkSizeForWorker + index] = url));
        setImageBlobs(imageBlobs.slice());
      } catch (e) {
        console.error(e);
      }
    }
  }, [workers]);

  useEffect(() => {
    if (incrementalUpdate) loadImagesIncrementally(images).finally();
    else loadAllImagesAtOnce(images).finally();
  }, [images, incrementalUpdate, loadAllImagesAtOnce, loadImagesIncrementally]);

  return {
    imageBlobs,
    maxWorkers,
  };
}

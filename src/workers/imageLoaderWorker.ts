self.addEventListener('message', async (e: MessageEvent<string[]>) => {
  const urls = e.data;

  const images = await Promise.all(urls.map(async (url) => {
    const fileBlob = await fetch(url).then(r => r.blob()).catch(()=> null);

    return (fileBlob && /image\/.+/.test(fileBlob.type)) ? URL.createObjectURL(fileBlob) : null;
  }));

  self.postMessage(images);
});

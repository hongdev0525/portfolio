import Image from 'next/image'
import sharp from 'sharp'

async function ImageComponent({ width, height, src, alt }) {
  const image = sharp(src)

  const webpBuffer = await image.webp().toBuffer()
  const webpSrc = `data:image/webp;base64,${webpBuffer.toString('base64')}`

  return (
    <div>
      <ImageComponent width={width} height={height} src={webpSrc} alt={alt} />
    </div>
  )
}

export default ImageComponent
declare module 'svg2img'{
  const svg2img: (svg: string, cb: (err: any, buffer: Buffer) => void) => void
  
  export default svg2img
}
declare module "formidable" {
  export type File = {
    filepath: string;
    originalFilename?: string | null;
    /** nombre final que formidable asigna al guardar */
    newFilename?: string;
    mimetype?: string | null;
    size: number;
  };
  const formidable: any;
  export default formidable;
}

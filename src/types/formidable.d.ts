declare module "formidable" {
  export type File = {
    filepath: string;
    originalFilename?: string | null;
    mimetype?: string | null;
    size: number;
  };
  const formidable: any;
  export default formidable;
}

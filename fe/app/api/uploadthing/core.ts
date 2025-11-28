import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 1
        }
    }).onUploadComplete(async ( { file }) => {
        console.log("File uploaded:", file);
    return { fileUrl: file.ufsUrl };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
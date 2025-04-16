import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import { Readable } from "stream";
import path from "path";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IncomingMessage } from "http";


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};


const form = formidable({
  multiples: true,
  keepExtensions: true,
  uploadDir: path.join(process.cwd(), "public/assets/app/images/products"),
  filter: ({ mimetype }) => mimetype?.includes("image") ?? false,
  filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
});

const parseForm = async (req: Request) => {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    throw new Error("Invalid content type");
  }

  const buffer = await req.arrayBuffer();
  const stream = Readable.from(Buffer.from(buffer));

  const mockReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: "",
  });

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(mockReq as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const { fields, files } = await parseForm(req);

    const getField = (field: any) => Array.isArray(field) ? field[0] : field;
    const product = await prisma.product.findUnique({ where: { id } });
    const oldImages: string[] = product?.images ?? [];

    const newImages: string[] = files.images
      ? Array.isArray(files.images)
        ? files.images.map((file: any) => path.basename(file.filepath))
        : [path.basename(files.images.filepath)]
      : [];

    const finalImages = newImages.length > 0 ? newImages : oldImages;

    const uploadedImages = files.images
      ? Array.isArray(files.images)
        ? files.images.map((file: File) => path.basename(file.filepath || file.originalFilename || ""))
        : [path.basename(files.images.filepath || files.images.originalFilename || "")]
      : [];

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: getField(fields.name),
        shortDescription: getField(fields.shortDescription),
        description: getField(fields.description),
        price: parseFloat(getField(fields.price)),
        salePrice: parseFloat(getField(fields.salePrice)),
        quantity: parseInt(getField(fields.quantity)),
        SKU: getField(fields.SKU),
        featured: getField(fields.featured) === "1",
        hot: getField(fields.hot) === "1",
        category: {
          connect: {
            id: getField(fields.cateId),
          },
        },
        images: finalImages,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = err.meta?.target as string[] || [];
        return NextResponse.json({
          success: false,
          message: `Value duplicate unique: ${target.join(", ")}`,
        }, { status: 400 });
      }
    }

    console.error("❌ Error updating product:", err);
    return NextResponse.json({ success: false, error: "Error updating" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context : { params: { id: string } }) {
  try {
    const { id } = context.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}

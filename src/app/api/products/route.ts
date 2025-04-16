import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import { Readable } from "stream";
import path from "path";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const minimal = searchParams.get("minimal") === "true";

    if (minimal) {
      const products = await prisma.product.findMany({
        select: { id: true, name: true },
      });
      return NextResponse.json(products);
    }

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    const sort = searchParams.get("sort") || "default";

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "name_asc" ? { name: Prisma.SortOrder.asc } :
        sort === "name_desc" ? { name: Prisma.SortOrder.desc } :
          sort === "salePrice_asc" ? { salePrice: Prisma.SortOrder.asc } :
            sort === "salePrice_desc" ? { salePrice: Prisma.SortOrder.desc } :
              { createdAt: Prisma.SortOrder.desc };

    const products = await prisma.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
      include: { category: true },
    });

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    });

  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

const parseForm = async (req: Request): Promise<{ fields: any; files: any }> => {
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

  return new Promise((resolve, reject) => {
    form.parse(mockReq as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const uploadedImages = files.images
      ? Array.isArray(files.images)
        ? files.images.map((file: File) => `${path.basename(file.filepath || file.originalFilename || "")}`)
        : [`${path.basename(files.images.filepath || files.images.originalFilename || "")}`]
      : [];

      const getField = (field: any) => Array.isArray(field) ? field[0] : field;
      const newProduct = await prisma.product.create({
        data: {
          name: getField(fields.name),
          shortDescription: getField(fields.shortDescription),
          description: getField(fields.description),
          price: parseFloat(getField(fields.price)),
          salePrice: parseFloat(getField(fields.salePrice)),
          quantity: parseInt(getField(fields.quantity)),
          SKU: getField(fields.SKU),
          featured: getField(fields.featured) === "true",
          hot: getField(fields.hot) === "true",
          category: {
            connect: {
              id: getField(fields.cateId), 
            }
          },
          images: uploadedImages,
        },
      });
      
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = err.meta?.target as string[] || [];
        return NextResponse.json({
          success: false,
          message: `Value duplicate unique: ${target.join(", ")}`
        }, { status: 400 });
      }
    }
    console.error("❌ Error creating product:", err);
    return NextResponse.json({ success: false, error: "Error uploading" }, { status: 500 });
  }
}

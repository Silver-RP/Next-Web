import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import formidable, { File } from "formidable";
import { Readable } from "stream";
import path from "path";

export async function GET() {
  try {
    const categories = await prisma.category.findMany(); 
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
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
  uploadDir: path.join(process.cwd(), "public/assets/app/images/home/demo3"),
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

export async function POST(request: Request) {
  try {
    const { fields, files } = await parseForm(request);

    const name = fields.name?.[0];
    const slug = fields.slug?.[0];
    const imageFile = files.image?.[0]; 

    if (!name || !slug || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const imagePath = imageFile.newFilename;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: imagePath, 
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}


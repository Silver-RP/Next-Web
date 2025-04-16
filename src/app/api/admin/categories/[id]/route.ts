import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import { Readable } from "stream";
import path from "path";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: category }, { status: 200 });
    } catch (error) {
        console.error("Error fetching category:", error);
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


export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { fields, files } = await parseForm(request);

        const name = fields.name?.[0];
        const slug = fields.slug?.[0];
        const imageFile = files.image?.[0];

        if (!name || !slug || !imageFile) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                image: imageFile.newFilename,
            },
        });

        return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
            }
        }
        return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const deletedCategory = await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, data: deletedCategory }, { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
            }
        }
        return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
}
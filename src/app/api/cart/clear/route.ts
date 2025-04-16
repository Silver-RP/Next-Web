import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        await prisma.cartProduct.deleteMany({
            where: {
                cart: {
                    userId: userId,
                },
            },
        });

        await prisma.cart.deleteMany({
            where: {
                userId: userId,
            },
        });


        return new Response(
            JSON.stringify({ success: true, message: "Cart cleared successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error clearing cart:", error);
        return new Response(
            JSON.stringify({ success: false, message: "An error occurred" }),
            { status: 500 }
        );
    }
}

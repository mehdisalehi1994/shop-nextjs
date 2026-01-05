export async function getFeaturedProducts() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/featured`, 
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error('مشکلی در دریافت محصولات پر بازدید رخ داده است.');
    }
    return response.json(); 
}
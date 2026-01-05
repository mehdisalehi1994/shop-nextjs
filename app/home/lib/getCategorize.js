export async function getCategorize() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categorize/home-menu`, 
        {
            cache: "force-cache",
        }
    );

    if (!response.ok) {
        throw new Error('مشکلی در دریافت دسته بندی ها رخ داده است.');
    }
    return response.json(); 
}
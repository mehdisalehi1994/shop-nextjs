const MELIPAYAMAK_API_URL = "https://rest.payamak-panel.com/api/SendSMS/SendSMS";

export async function sendSms(phone, message) {
    const payload = {
        username: process.env.MELIPAYAMAK_USERNAME,
        password: process.env.MELIPAYAMAK_PASSWORD,
        to: phone,
        from: process.env.MELIPAYAMAK_FROM_NUMBER,
        text: message,
    };

    try {
        const response = await fetch(MELIPAYAMAK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data || data.RetStatus !== 1) {
            console.log("Payamak Error:", data);
            throw new Error(data.StrRetStatus || "ارسال پیامک ناموفق بود");
        }

        return data;
    } catch (error) {
        console.log("SMS Error:", error);
        throw new Error("خطایی در ارسال پیامک رخ داده است.");
    }
}

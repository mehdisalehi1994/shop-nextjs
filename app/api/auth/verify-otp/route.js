import connectToDatabase from "@/app/lib/db";
import Users from "@/models/Users";
import Otp from "@/models/Otp";

export async function POST(request) {
    await connectToDatabase();

    try{
const { phone, code, name } = await request.json();

if(!phone || !code || !name){
    return new Response(JSON.stringify({message: "فیلد ها الزامی میباشند"}), {
        status: 400,
    });
}

const otp = await Otp.findOne({phone, code });
if(!otp){
    return new Response(JSON.stringify({message: "کد وارد شده صحیح نمی باشد"}),{
        status: 400,
    });
}

if(otp.expiresAt < new Date()) {
    return new Response(JSON.stringify({message: "کد منقضی شده است"}),
    {
        status: 400,
    });
}

const user = await Users.create({ 
    name, 
    phone,
    isAdmin: true,
    isActive: true,
 });

 await Otp.deleteOne();

 return new Response(JSON.stringify({message: "ثبت نام با موفقیت انجام شد"}));
    }
    catch(error){
        return new Response(JSON.stringify({ message: error.message }),{
            status: 500,
        });
    }
}
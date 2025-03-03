import {PrismaClient} from '@prisma/client';
import {jwtVerify} from 'jose';


const prisma = new PrismaClient();

const authMiddleWare = async(req, record, next)=>{

    try {
        const cookieValidation = req.cookies.token;
            if(!cookieValidation){
                return res.status(401).json({error: 'No token provided'});
            }
            
        const {payload} = await jwtVerify(
            cookieValidation,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )

        const user = await prisma.user.findUnique({
            where: {id: payload.userId}
        });

        if(!user){
            return res.status(401).json({error: 'User not found'});
        }

        req.user = user;
        next();
            
    } catch (error) {
        return res.status(401).json({error: 'Invalid token'});
    }

}    

export default authMiddleWare;
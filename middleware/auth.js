import prisma from '@prisma/client';
import JWTVerify from 'jose';


const prisma = new prisma();

const authMiddleWare = async(req, record, next)=>{

    try {
        const cookieValidation = req.cookies.token;
            if(!cookieValidation){
                return res.status(401).json({error: 'No token provided'});
            }
            
        const {payload} = await JWTVerify(
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
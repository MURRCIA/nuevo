import {PrismaClient} from '@prisma/client';
import bycript from 'bcryptjs';

const prisma = new PrismaClient();

const main = async()=>{
    try {
        const adminData = {
            email: 'admin@gmail.com',
            password: 'admin123',
            name: 'Admin',
             role: 'ADMIN'
        }
        
        const existingAdmin = await prisma.user.findFirst({
            where: {role: 'ADMIN'}
        });
        if(!existingAdmin){
            const hashedPassword = await bycript.hash(adminData.password, 10);
            
            // Create the admin user
            const admin = await prisma.user.create({
                data: {
                    email: adminData.email,
                    password: hashedPassword, 
                    name: adminData.name,
                    role: adminData.role
                }
                
            });
            console.log('Admin creado exitosamente:', admin);
        
        }
        else{
            console.log('Admin ya existe');
        }
        // Hash the password before storing
        
    } catch (error) {
        console.error('Error al crear admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
    
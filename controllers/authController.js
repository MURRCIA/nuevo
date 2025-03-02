import bycript from 'bcryptjs';
import prisma from '@prisma/client';
import SignJWT from 'jose'; // libreria para crear tokens
import {loginShema, registerShema} from '../validation/authShema.js';

const prisma = new prisma();
const createToken = async(userId)=>{
    const token = await new SignJWT({userId})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

const getCookieOptions = ()=>{
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        domain: isProd ? 'yourdomain.com' : 'localhost',
        path: '/',
        maxAge: 1 * 24 * 60 * 60 * 1000,
    }
}

// funcion para iniciar sesion
const login = async(res, req)=>{
    try {
        const validacion = loginShema.safeParse(req.body);
        if(!validacion.success){
            return res.status(400).json({error: validacion.error.flatten().fieldErrors});
        }
        const {email, password} = validacion.data;
        const user = await prisma.user.findUnique({
            where: {email}
        });
        if(!user){
            return res.status(400).json({error: 'Usuario no encontrado'});
        }
        const passwordMatch = await bycript.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({error: 'Contraseña incorrecta'});
        }
        const token = await createToken(user.id);
        res.cookie('token', token, getCookieOptions());
        res.json({
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({error: 'Error al iniciar sesión'});
    }
}
 // funcion para registrar un usuario
 const register = async(res, req)=>{
    try {
        const validacion = registerShema.safeParse(req.body);
        if(!validacion.success){
            return res.status(400).json({error: validacion.error.flatten().fieldErrors});
        } 
        const {name, email, password} = validacion.data;
        const existingUSer = await prisma.user.findUnique({
            where: {email}
        });
        if(existingUSer){
            return res.status(400).json({error: 'El usuario ya existe'});
        }
        const hashedPassword = await bycript.hash(password, 10);
        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }, select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        });
        const token = await createToken(createdUser.id);
        res.cookie('token', token, getCookieOptions());
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: createdUser
        });



    } catch (error) {
        res.status(500).json({error: 'Error al registrar usuario'});
    }
 }






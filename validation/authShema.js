import zod from 'zod';


const loginShema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
});

const registerShema = zod.object({
    name: zod.string().min(1),
    email: zod.string().email(),
    password: zod.string().min(8),
});

export {loginShema, registerShema};






import {User} from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async(req, res) => {
    const {email, password} = req.body
    try {
        const user = new User({email, password});
        await user.save();

        //jwt token

        return res.status(201).json({ok: true})
    } catch (error) {
        console.log(error)
        // ALternativa por defecto mongoose
        if(error.code === 11000){
            return res.status(400).json({error: "Ya existe este usuario"})
        }
        return res.status(500).json({error: "Algo falló en el servidor"})
    }
}

export const login = async(req, res) => {
    try {
        const {email, password} = req.body
        
        let user = await User.findOne({email});
        if(!user) return res.status(403).json({error: "No existe este usuario"});

        const respuestaPassword = user.comparePassword(password)
        if(!respuestaPassword)
            return res.status(403).json({error: "Contraseña incorrecta"});

        //Generar Token JWT
        const token = jwt.sign({uid: user._id}, process.env.JWT_SECRET)


        return res.json({token});

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Algo falló en el servidor"})
    }
}

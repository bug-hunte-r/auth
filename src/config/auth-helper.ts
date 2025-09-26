import { hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";

const hashdPassHandler = async (password: any) => {
    const hashedPass = hash(password, 12)
    return hashedPass
}

const generateToken = (data: any) => {
    const token = sign({ ...data }, process.env.privatKey, {
        expiresIn: '48h'
    })
    return token
}

const verifyPassHandler = async (password: any, hashedPass: any) => {
    const verifedPass = compare(password, hashedPass)
    return verifedPass
}

const verifyTokenHandler = async (token: any) => {
    try {
        const verifedToken = verify(token, process.env.privatKey)
        return verifedToken
    } catch (error) {
        console.log(error);
    }
}

export { hashdPassHandler, generateToken, verifyPassHandler, verifyTokenHandler }
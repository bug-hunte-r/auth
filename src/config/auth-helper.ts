import { hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";

const hashdPassHandler = async (password: string) => {
    const hashedPass = hash(password, 12)
    return hashedPass
}

const generateToken = (data: object) => {
    const token = sign({ ...data }, process.env.privatKey, {
        expiresIn: '48h'
    })
    return token
}

const verifyPassHandler = async (password: string, hashedPass: string) => {
    const verifedPass = compare(password, hashedPass)
    return verifedPass
}

const verifyTokenHandler = async (token: string) => {
    try {
        const verifedToken = verify(token, process.env.privatKey)
        return verifedToken
    } catch (error) {
        console.log(error);
    }
}

export { hashdPassHandler, generateToken, verifyPassHandler, verifyTokenHandler }
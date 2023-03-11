import type { NextApiRequest, NextApiResponse } from "next";
import {customAlphabet}  from "nanoid";
import { Url } from "@/mongo/models/url";

const regex = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;

// Cria um alfabeto com letras maiúsculas, minúsculas e números
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// Cria uma função que gera um hash de 5 caracteres com base no alfabeto criado acima
const getHash = customAlphabet(characters, 5);



// Endpoint para a API que recebe uma URL e retorna um hash exclusivo para a URL
export default async function ShortLink(req: NextApiRequest, res: NextApiResponse) {
    // Verifica se o método da requisição é POST, caso contrário retorna um erro 405 Method Not Allowed
    if(req.method != "POST") {        
        return res.status(405).json({
            type: "Error",
            code: 405,
            message: "Only POST method is accepted on this route",
        });
    }
     // Verifica se o link é válido
    if (!req.body.url || !regex.test(req.body.url)) {
        return res.status(400).json({
            type: "Error",
            code: 400,
            message: "Invalid URL",
        });
    }

    // Se o método da requisição é POST, tenta criar um novo hash para a URL e salvá-lo no banco de dados
    if(req.method === "POST") {        
        try {
            

            // Verifica se a URL já existe no banco de dados
            const existingUrl = await Url.findOne({ url: req.body.url });
            if (existingUrl) {
                // Se a URL já existe, retorna o hash existente
                return res.status(200).json({url: req.body.url ,hash: existingUrl.hash });
            }

            // Se a URL não existe, cria um novo hash e salva a URL e o hash no banco de dados
            const newUrl = new Url({
                hash: getHash(),
                url: req.body.url,
                createdAt: Date.now()
            }); 
            
            await newUrl.save();
            return res.status(200).json({url: req.body.url, hash: newUrl.hash });

        } catch(error){
            // Se ocorrer um erro durante a criação do hash e a gravação no banco de dados, retorna um erro 500 Internal Server Error
            console.error('Error creating short link:', error);
            return res.status(500).json({
            type: 'Error',
            code: 500,
            message: 'Internal server error'
            });
        }
    }
}
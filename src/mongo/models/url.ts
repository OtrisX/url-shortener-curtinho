import mongoose from "@/mongo/db";

// Define a interface para um documento do tipo URL
interface IUrl {
    hash: String,
    url: String,
    createdAt: Date,
}

// Define o esquema do banco de dados para o documento URL
const urlSchema = new mongoose.Schema<IUrl>({
    hash: {type: String, required: true},
    url: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
}, { collection: 'data' });

// Cria um modelo do Mongoose para o esquema URL se ele não existir, caso contrário usa o modelo existente
export const Url = mongoose.models.Url || mongoose.model<IUrl>('Url', urlSchema)



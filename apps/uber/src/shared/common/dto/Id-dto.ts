import { IsMongoId, IsNotEmpty } from "class-validator";

export class IdDto {
    @IsNotEmpty()
    @IsMongoId() // Valida se a string é um ObjectId válido do MongoDB
    id: string;
}

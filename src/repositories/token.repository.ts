import { Token } from "../entities/token.entity";
import { dataSource } from "../globals/data-source";

export const tokenRepository = dataSource.getRepository(Token).extend({});
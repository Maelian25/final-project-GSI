import { EnumMember } from "typescript";

export enum ArticleType {
    Product, 
    Material
}

export interface IArticle {
    article_type: ArticleType;
}
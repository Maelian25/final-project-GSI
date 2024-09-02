import { ArticleType } from "./IArticle";

export interface IMaterial {
    article_type: ArticleType.Material;
    id_material: number;
    name: string;
}
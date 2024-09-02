import { ArticleType, IArticle } from "./IArticle";

export interface IProduct extends IArticle {
  readonly article_type: ArticleType.Product;
  id_product: number;
  name: string;
  fabricant: string;
  quantity_masse: number;
  quantity_vol: number;
  score_danger: number;
  description: string;
  cas_number: string;
  etat_physique: string;
  cid_number?: string;
  phase_risque: string;
  classif_sgh: string;
  icpe: string;
  ph: number;
  temp_ebullition: string;
  pression_vapeur: string;
  code_tunnel: string;
  danger_codes?: string[];
  salle?: string;
  date?: string;
  storage_unit?: string;
  // blabla
}

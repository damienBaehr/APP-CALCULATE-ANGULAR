import { UnitOptions } from "./UnitOptions";

export interface Item{
    id: number;
    name: string;
    quantity: number;
    calcul?: string;
    unit?: UnitOptions;
    
}
import { UnitOptions } from "./UnitOptions";

export interface Item{
    id: number;
    name: string;
    quantity: number;
    unit?: UnitOptions;
    
}
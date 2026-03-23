export interface Dish {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export type Person = string;

export type Assignments = Record<Person, Dish['id'][]>;

export interface NewDish {
  name: string;
  price: string;
  quantity: number;
}

export interface Totals {
  [person: string]: number;
}
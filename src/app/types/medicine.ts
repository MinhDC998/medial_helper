export interface IMedicine {
  name: string;
  symptoms: string;
  medicineCode: string;
  medicineName: string;
  morbidness: string;
  dosage: string;
  specificDisease: string;
  specificObject: string;
  ingredients: string;
  note?: string;
}

export interface ICreateMedicine extends IMedicine {
  submitError?: string;
}

export type TSearchMedicine = Pick<IMedicine, 'name' | 'morbidness'>;
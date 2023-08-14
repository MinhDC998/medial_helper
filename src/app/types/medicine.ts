export interface IMedicine {
  id: number;
  name?: string;
  symptoms: string;
  medicineCode: string;
  medicineName: string;
  morbidness: string;
  dosage: string;
  specificDisease: string;
  specificObject: string;
  ingredients: string;
  note?: string;
  diseaseStatus?: string;
}

export interface ICreateMedicine extends IMedicine {
  submitError?: string;
}

export type TSearchMedicine = Pick<IMedicine, 'morbidness' | 'diseaseStatus' | 'specificObject'> & { key: string };

export interface TListMedicineRes {
  diseaseStatus: string[];
  specificObject: string[];
}

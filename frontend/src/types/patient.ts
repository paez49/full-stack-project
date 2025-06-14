export type CancerType = 'CARCINOMA' | 'SARCOMA' | 'LEUKEMIA' | 'LYMPHOMA' | string; // ajusta según tus valores reales

export interface PatientBaseDTO {
    name: string;
    age: number;
    oncological: boolean;
    birth_date: string; // ISO 8601 date string
    cancer_type?: CancerType;
}

export interface PatientCreateDTO extends PatientBaseDTO { }

export interface PatientUpdateDTO {
  name?: string;
  age?: number;
  oncological?: boolean;
  birth_date?: string;
  cancer_type?: CancerType | null | "";
}


export interface PatientResponseDTO extends PatientBaseDTO {
    id: number;
    hospital_id?: number;
}

export interface Patient {
    id: number
    name: string;
    age: number;
    oncological: boolean;
    birth_date: string; // ISO 8601 date string
    cancer_type?: CancerType;
}
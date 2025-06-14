export interface HospitalBaseDTO {
    name: string;
    address: string;
    capacity: number;
}

export interface HospitalCreateDTO extends HospitalBaseDTO {}

export interface HospitalUpdateDTO {
    name?: string;
    address?: string;
    capacity?: number;
}

export interface Hospital {
    id: number;
    name: string;
    address: string;
    capacity: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
} 
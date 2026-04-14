export interface Medication {
    id: string;
    name: string;
    activeIngredient: string;
    dosage: string;
    frequency: 'daily' | 'twice-daily' | 'as-needed' | 'custom';
    startDate: string;
    notes?: string;
    addedAt: number;
}

export interface ScanResult {
    name: string;
    activeIngredient: string;
    dosage: string;
    sideEffects: string[];
    interactions: Interaction[];
    safeToTake: boolean;
    warning: string | null;
    error?: string;
}

export interface Interaction {
    drug: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
}
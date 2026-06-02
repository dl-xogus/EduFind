export interface Academy {
    id: number;
    name: string;
    region: string;
    address: string;
    category: string;
    subjects: string[];
    fee: number;
    description: string;
    tags: string[];
    certIds: number[];
    image: string;
    openTime: string;
    phone: string;
    wishCount: number;
}

export interface ExamSchedule {
    round: string;
    apply: string;
    exam: string;
    result: string;
}

export interface Cert {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    level: string;
    issuer: string;
    passRate: number;
    examFee: number;
    description: string;
    examSchedule: ExamSchedule[];
    nextExam: string;
    examType: string;
    requirements: string;
    subjects: string[];
    tags: string[];
    relatedJobs: string[];
    academyIds: number[];
}
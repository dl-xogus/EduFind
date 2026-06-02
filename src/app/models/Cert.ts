import mongoose, { Schema, Document } from 'mongoose'

export interface ICert extends Document {
  id: number
  name: string
  category: string
  subcategory: string
  level: string
  issuer: string
  passRate: number
  examFee: number
  description: string
  examSchedule: { round: string; apply: string; exam: string; result: string }[]
  nextExam: string
  examType: string
  requirements: string
  subjects: string[]
  tags: string[]
  relatedJobs: string[]
  academyIds: number[]
}

const CertSchema = new Schema<ICert>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  subcategory: { type: String },
  level: { type: String },
  issuer: { type: String },
  passRate: { type: Number },
  examFee: { type: Number },
  description: { type: String },
  examSchedule: [{ round: String, apply: String, exam: String, result: String }],
  nextExam: { type: String },
  examType: { type: String },
  requirements: { type: String },
  subjects: [{ type: String }],
  tags: [{ type: String }],
  relatedJobs: [{ type: String }],
  academyIds: [{ type: Number }],
})

const Cert = mongoose.models.Cert || mongoose.model<ICert>('Cert', CertSchema, 'certs')

export default Cert


import mongoose, { Schema, Document } from 'mongoose'

export interface IAcademy extends Document {
  id: number
  name: string
  region: string
  address: string
  category: string
  subjects: string[]
  fee: number
  description: string
  tags: string[]
  certIds: number[]
  image: string
  openTime: string
  phone: string
  wishCount: number
}

const AcademySchema = new Schema<IAcademy>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  address: { type: String },
  category: { type: String, required: true },
  subjects: [{ type: String }],
  fee: { type: Number, default: 0 },
  description: { type: String },
  tags: [{ type: String }],
  certIds: [{ type: Number }],
  image: { type: String },
  openTime: { type: String },
  phone: { type: String },
  wishCount: { type: Number, default: 0 },
})

const Academy = mongoose.models.Academy || mongoose.model<IAcademy>('Academy', AcademySchema, 'academies')

export default Academy

import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import Academy from '@/app/models/Academy'
import Cert from '@/app/models/Cert'
import academiesData from '@/app/data/academies.json'
import certsData from '@/app/data/certs.json'

export async function POST() {
  await connectDB()

  await Academy.deleteMany({})
  await Cert.deleteMany({})

  await Academy.insertMany(academiesData)
  await Cert.insertMany(certsData)

  return NextResponse.json({ message: `학원 ${academiesData.length}개, 자격증 ${certsData.length}개 저장 완료` })
}

import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlist extends Document {
  userEmail: string
  itemId: number
  itemType: 'academy' | 'cert'
  createdAt: Date
}

const WishlistSchema = new Schema<IWishlist>({
  userEmail: { type: String, required: true },
  itemId: { type: Number, required: true },
  itemType: { type: String, enum: ['academy', 'cert'], required: true },
  createdAt: { type: Date, default: Date.now },
})

const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema, 'wishlist')

export default Wishlist

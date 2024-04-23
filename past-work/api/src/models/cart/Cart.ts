//import { string } from "joi";
import { Schema, Document, model } from "mongoose";

export interface ICartItem {
  itemId: String;
  quantity: number;
}

export interface ICartDocument extends Document {
  customerId: string;
  cartItems: ICartItem[];
}

const cartItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
}
);

const cartSchema = new Schema(
  {
    customerId: { type: String, required: true },
    cartItems: [cartItemSchema],
  },
  { timestamps: { createdAt: true }, optimisticConcurrency: true},
);

//const Cart = mongoose.model('Cart', cartSchema);
//module.exports = Cart;

export default model<ICartDocument>("Cart", cartSchema);
export const cartItem =  model<ICartItem>("CartItem", cartItemSchema);
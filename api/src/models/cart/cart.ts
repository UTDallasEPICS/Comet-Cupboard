import { Schema, Document, model } from "mongoose";
export interface ICartItem {
  itemId: string;
  quantity: number;
}

export interface ICartDocument extends Document {
  customerId: string;
  cartItems: ICartItem[];
}

const cartItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true },
}
);

const cartSchema = new Schema(
  {
    customerId: { type: String, required: true },
    cartItems: [cartItemSchema],
  },
);

export default model<ICartDocument>("Cart", cartSchema);
export const cartItem =  model<ICartItem>("CartItem", cartItemSchema);
//import { string } from "joi";
import { Schema, Document, model } from "mongoose";

export interface ICartItem {
  itemId: Schema.Types.ObjectId;
  quantity: number;
  //size: string;
  categoryId: Schema.Types.ObjectId;
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
);

//const Cart = mongoose.model('Cart', cartSchema);
//module.exports = Cart;

export default model<ICartDocument>("Cart", cartSchema);
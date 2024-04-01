import axios from "axios";
import { create } from 'zustand';


interface OrderState {
    orders: string[] | null;
    fetchOrders: () => Promise<void>

}


const orderStore = create<OrderState>((set, get) => ({
    orders: null,
    fetchOrders: async () => {
        
    }
}))
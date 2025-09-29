// src/types/react-paystack.d.ts
declare module "react-paystack" {
  import React from "react";

  export interface PaystackReference {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
  }

  export interface PaystackProps {
    email: string;
    amount: number;
    publicKey: string;
    text?: string;
    reference?: string;
    metadata?: Record<string, any>;
    onSuccess?: (reference: PaystackReference) => void;
    onClose?: () => void;
    className?: string;
  }

  export const PaystackButton: React.FC<PaystackProps>;
  export default PaystackButton;
}
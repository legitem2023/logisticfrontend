import React, { useState } from 'react';
import { FaMotorcycle, FaMoneyBillWave, FaReceipt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { ACCEPTDELIVERY, SKIPDELIVERY, CANCELEDDELIVERY,FINISHDELIVERY,SENDNOTIFICATION, MARKPAID } from "../../../../graphql/mutation"; 
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';

type data ={
  id:string;
  base:number;
  perKmRate:number;
  distance:number
}
const PaymentComponent = ({data}:{data:data}) => {
    const [markPaid] = useMutation(MARKPAID,{
     onCompleted: () => console.log("Delivery marked as paid", "success"),
     onError: (e: any) => console.log('Finished Error', e)
    })
    const globalUserId = useSelector(selectTempUserId);

  const totalFare = data.distance ? data.base + (data.distance * data.perKmRate) : null;

  const [paymentDetails, setPaymentDetails] = useState({
    orderId: data.id,
    amount: totalFare,
    riderCode: globalUserId,
    paymentMethod: 'cod',
    isPaid: false,
    paymentConfirmation: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    const paymentConfirmation = `COD-${Date.now().toString().slice(-6)}`;
    setTimeout(() => {
      setPaymentDetails(prev => ({
        ...prev,
        isPaid: true,
        paymentConfirmation: paymentConfirmation
      }));
      markPaid({
        variables: {
          deliveryId: data.id,
          riderId: globalUserId,
          code: paymentConfirmation
        }
      })
    }, 1500);


  };

  const handleNewPayment = () => {
    setPaymentDetails({
      orderId: '',
      amount: 0,
      riderCode: '',
      paymentMethod: 'cod',
      isPaid: false,
      paymentConfirmation: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-2xl bg-white overflow-hidden shadow-2xl">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-700 rounded-full -mt-16 -mr-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-700 rounded-full -mb-24 -ml-24 opacity-20"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Deluxe Logistics Payment</h1>
              <p className="text-emerald-200">Secure Cash on Delivery for Premium Service</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaMotorcycle className="text-3xl text-white" />
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="p-8">
          {paymentDetails.isPaid ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 mb-6">
                <FaCheckCircle className="text-5xl text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Payment Successful!</h2>
              
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 max-w-md mx-auto mb-8 border border-emerald-100">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-emerald-200">
                  <span className="text-emerald-600 font-medium">Amount:</span>
                  <span className="text-2xl font-bold text-emerald-800">₱{paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-medium">Confirmation:</span>
                  <span className="font-mono text-emerald-800">{paymentDetails.paymentConfirmation}</span>
                </div>
              </div>
              
              <button
                onClick={handleNewPayment}
                className="bg-gradient-to-r from-emerald-700 to-green-800 text-white font-medium py-3 px-8 rounded-full hover:from-emerald-800 hover:to-green-900 transition-all shadow-lg hover:shadow-xl"
              >
                New Payment
              </button>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-emerald-800 font-medium mb-2">Order ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaReceipt className="text-emerald-600" />
                    </div>
                    <input
                      type="text"
                      name="orderId"
                      value={paymentDetails.orderId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-800"
                      placeholder="Enter Order ID"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-emerald-800 font-medium mb-2">Amount (₱)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMoneyBillWave className="text-emerald-600" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={paymentDetails.amount}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-800"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-emerald-800 font-medium mb-2">Rider Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaShieldAlt className="text-emerald-600" />
                    </div>
                    <input
                      type="text"
                      name="riderCode"
                      value={paymentDetails.riderCode}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-800"
                      placeholder="Enter rider's unique code"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
                <h3 className="text-emerald-800 font-bold mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-emerald-600" /> Payment Method
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <FaMoneyBillWave className="text-xl text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-800">Cash on Delivery</h4>
                      <p className="text-sm text-emerald-600">Pay cash to the rider upon delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentDetails.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white font-bold py-4 rounded-xl hover:from-emerald-700 hover:to-green-800 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Confirm Cash Payment
              </button>
            </form>
          )}
        </div>
        
        {/* Premium Footer */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-t border-emerald-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-emerald-600 p-2 rounded-lg mr-3">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-800">Secure Payment</h4>
                <p className="text-sm text-emerald-600">All transactions are protected</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-emerald-600 p-2 rounded-lg mr-3">
                <FaReceipt className="text-white text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-800">Instant Receipt</h4>
                <p className="text-sm text-emerald-600">Confirmation immediately</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;

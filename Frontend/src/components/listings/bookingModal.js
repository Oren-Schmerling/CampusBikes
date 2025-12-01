import { createPortal } from 'react-dom';
import { Calendar, Clock, DollarSign, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from "react";
import MessageSellerForm from "@/components/listings/messageSellerForm";
import createRental from '@/api/createRental.js';

// Helper function to check if time range conflicts with bookings
const hasConflict = (startDate, startTime, duration, bookings) => {
  if (!startDate || !startTime) return false;
  
  const userStart = new Date(`${startDate}T${startTime}`);
  const userEnd = new Date(userStart.getTime() + duration * 60 * 60 * 1000);

  // console.log('Checking conflict for:', userStart, 'to', userEnd);
  
  return bookings.some(booking => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    // console.log('Comparing with booking:', bookingStart, 'to', bookingEnd);
    
    // // Check if ranges overlap
    // return userStart < bookingEnd && userEnd > bookingStart;
    // check if user start and end are within booking start and end
    return (userStart >= bookingStart && userStart <= bookingEnd) ||
           (userEnd >= bookingStart && userEnd <= bookingEnd) ||
           (userStart <= bookingStart && userEnd >= bookingEnd);
  });
};

const StripePaymentForm = ({ amount, onCancel, onSubmit }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    setProcessing(true);
    onSubmit && await onSubmit();
    setProcessing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <input
          type="text"
          placeholder="xxxx xxxx xxxx xxxx"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          maxLength="19"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            maxLength="5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <input
            type="text"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            maxLength="4"
          />
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-waxwingGreen">${amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={processing}
          className='flex-1 py-3 bg-waxwingGreen text-white rounded-lg font-medium hover:bg-waxwingLightGreen transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          Pay
        </button>
      </div>
    </div>
  );
};

const BookingModal = ({ 
  show, 
  onClose, 
  listingID,
  title,
  price,
  description,
  seller
}) => {
  const [step, setStep] = useState('details');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    startTime: '',
    duration: 1,
  });

  // Fetch bookings when modal opens
  useEffect(() => {
    if (show && listingID) {
      fetchBookings();
    }
  }, [show, listingID]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:8080/booking/rentals/${listingID}`);
      const data = await response.json();
      console.log('Fetched bookings:', data);
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    }
    setLoadingBookings(false);
  };

  if (!show) {
    return null;
  }

  const calculateTotal = () => {
    return price * bookingDetails.duration;
  };

  const hasTimeConflict = hasConflict(
    bookingDetails.startDate,
    bookingDetails.startTime,
    bookingDetails.duration,
    bookings
  );

  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleMessageSeller = () => {
    setStep('message');
  };

  const handlePaymentSuccess = () => {
    setStep('success');
  };

  const handlePaymentFailure = () => {
    setStep('failure');
  };

  const handleSendMessage = (message) => {
    alert('Message sent to seller!');
    onClose();
  };

  const handlePaymentSubmit = async () => {
    const payload = {
      listingID,
      ...bookingDetails,
    };
    console.log('Submitting booking:', payload);

    try {
      const res = await createRental(payload);
    
      if (res.success) {
        setStep('success');
      } else {
        console.log("Booking failed:", res.message);
        fetchBookings(); // refresh bookings in case of conflict
        setStep('details');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setStep('failure');
    }
  };

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-semibold mb-4">Booking: {title}</h2>

          {step === 'details' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="text-green-600" size={20} />
                    <span className="font-semibold">{price} / hour</span>
                  </div>
                  <p className="text-sm text-gray-600 max-h-24 overflow-y-auto">{description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingDetails.startDate}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, startDate: e.target.value })}
                    min={getTodayLocalDate()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline mr-2" size={16} />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={bookingDetails.startTime}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, startTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingDetails.duration}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>

                {hasTimeConflict && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-red-900 text-sm">Time Conflict</p>
                      <p className="text-red-800 text-sm">This bike is already booked during your selected time. Please choose a different time or duration.</p>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-waxwingGreen">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {bookingDetails.duration} hour{bookingDetails.duration > 1 ? 's' : ''} × ${price}/hour
                  </p>
                </div>

                <div className="flex gap-3">
                    <button
                    onClick={handleMessageSeller}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer"
                    >
                        Negotiate with Seller
                    </button>
                    <button
                        onClick={() => setStep('payment')}
                        disabled={!bookingDetails.startDate || !bookingDetails.startTime || hasTimeConflict}
                        className="flex-1 py-3 bg-waxwingGreen text-white rounded-lg font-medium hover:bg-waxwingLightGreen transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Proceed to Payment
                    </button>
                </div>

              </div>
          )} 

          {step === "payment" && (
              <div>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Start Date: {bookingDetails.startDate}</p>
                      <p>Start Time: {bookingDetails.startTime}</p>
                      <p>Duration: {bookingDetails.duration} hour{bookingDetails.duration > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <StripePaymentForm
                    amount={calculateTotal()}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    onCancel={() => setStep('details')}
                    onSubmit={handlePaymentSubmit}
                  />
                
                  <p className="text-xs text-gray-500 text-center">
                    Payments are processed through Stripe
                  </p>
              </div>
            </div>
          )}

        {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h4 className="font-semibold mb-2">Booking Details:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Model: {title}</p>
                  <p>Date: {bookingDetails.startDate}</p>
                  <p>Time: {bookingDetails.startTime}</p>
                  <p>Duration: {bookingDetails.duration} hour{bookingDetails.duration > 1 ? 's' : ''}</p>
                  <p>Total Paid: ${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-waxwingGreen text-white rounded-lg font-medium hover:bg-waxwingLightGreen transition cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {step === 'failure' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please check your card details and try again.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep('details')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer"
                >
                  Back to Booking
                </button>
              </div>
            </div>
          )}

          {step === 'message' && (
            <MessageSellerForm
              seller={seller}
              title={title}
              onSend={handleSendMessage}
              onBack={() => setStep('details')}
            />
          )}

        </div>
      </div>
    </>,
    document.body
  );
}

export default BookingModal;
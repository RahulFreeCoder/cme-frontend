import {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { submitCMERegistration } from "../../redux/events/cmeRegistrationSlice";

const PaymentForm = ({ eventId, email, onClose }) => {
  const dispatch = useDispatch();
  const { submitting, successMessage, errorMessage } = useSelector(
    (state) => state.cmeRegistration
  );

  const [form, setForm] = useState({
    amount: "",
    date: "",
    transactionId: "",
    paymentMode: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const payload = {
      cmeId: eventId,
      emailId: email,
      paymentDetails: [{
        amount: Number(form.amount),
        date: new Date(form.paymentDate).toISOString(),
        status: "Pending",
        modeOfPayment: form.paymentMode,
        transactionId: form.transactionId,
        message: form.message,
      }],
    };

    console.log("Submitting payment:", payload);
    
    dispatch(submitCMERegistration(payload));
  };

  return (
    <div className="mt-4">
      {/* STATUS */}
      {successMessage && (
        <p className="mb-3 text-green-600 bg-green-50 border border-green-200 p-2 rounded">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mb-3 text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {errorMessage}
        </p>
      )}

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="amount"
          placeholder="Amount Paid"
          className="input"
          onChange={handleChange}
        />

        <input
          type="date"
          name="paymentDate"
          className="input"
          onChange={handleChange}
        />

        <input
          name="transactionId"
          placeholder="Transaction ID"
          className="input col-span-2"
          onChange={handleChange}
        />

        <select
          name="paymentMode"
          className="input col-span-2"
          onChange={handleChange}
        >
          <option value="">Select Payment Mode</option>
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>

        <textarea
          name="message"
          placeholder="Message (optional)"
          className="input col-span-2"
          rows={3}
          onChange={handleChange}
        />
      </div>
      {successMessage && <button
        onClick={onClose}
        className="mt-4 w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Close
      </button>}
        
      {!successMessage && <button
          disabled={submitting}
          onClick={handleSubmit}
          className={`mt-4 w-full py-2 rounded-md text-white
            ${
              submitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {submitting ? "Submitting..." : "Submit Registration"}
        </button> 
      }
    </div>
  );
};

export default PaymentForm;
import RegistrationFees from "./RegistrationFees";
import PaymentDetails from "./PaymentDetails";
import PaymentForm from "./PaymentForm";

const EventRegistrationModal = ({ event, user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Complete your registration by making the payment
        </p>

        {/* Registration Fees */}
        <RegistrationFees fees={event.registrationFees} />

        {/* Payment Details */}
        <PaymentDetails paymentDetails={event.paymentDetails} />

        {/* Payment Form */}
        <PaymentForm eventId={event.cmeId} email={user?.email || user?.phone} onClose={onClose}/>

      </div>
    </div>
  );
};

export default EventRegistrationModal;

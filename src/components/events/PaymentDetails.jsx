
const PaymentDetails = ({ paymentDetails }) => {
  if (!paymentDetails) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-medium mb-2">Payment Details</h3>

      <ul className="text-sm text-gray-700 space-y-1">
        <li><strong>Account Name:</strong> {paymentDetails.accountName}</li>
        <li><strong>Account Number:</strong> {paymentDetails.accountNumber}</li>
        <li><strong>IFSC:</strong> {paymentDetails.ifscCode}</li>
        <li><strong>UPI:</strong> {paymentDetails.upiCode}</li>
      </ul>
    </div>
  );
};

export default PaymentDetails;
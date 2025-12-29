const RegistrationFees = ({ fees }) => {
  if (!fees?.length) return null;

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Registration Fees</h3>

      <ul className="space-y-2">
        {fees.map((fee, idx) => {
          const discountedPrice =
            fee.discountPercent > 0
              ? Math.round(fee.price * (1 - fee.discountPercent / 100))
              : fee.price;

          return (
            <li key={idx} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium text-gray-800">{fee.category}</p>
                <p className="text-xs text-gray-500">{fee.rule}</p>
              </div>
              <p className="text-blue-600 font-semibold">
                ₹ {discountedPrice}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
 export default RegistrationFees;
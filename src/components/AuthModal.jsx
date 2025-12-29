import { useState , useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../redux/auth/authSlice";
import { X, Mail, Lock, User, Phone } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    prefix: "Dr",
    name: "",
    email: "",
    password: "",
    phone: "",
    userType: "doctor",
    organizationName: "",
  });
  const [errors, setErrors] = useState({});
  const { status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        prefix: "Dr",
        name: "",
        email: "",
        password: "",
        phone: "",
        userType: "doctor",
        organizationName: "",
      });
      setErrors({});
      setIsLogin(true);
    }
  }, [isOpen]);



  if(!isOpen) return null;


  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^\d{10}$/.test(formData.phone.replace(/[-()\s]/g, ""))
      ) {
        newErrors.phone = "Phone number must be 10 digits";
      }
    }

    if (formData.userType === "organizer" && !formData.organizationName) {
      newErrors.organizationName = "Organization name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const action = isLogin
      ? login({ email: formData.email, password: formData.password })
      : register(formData);

    const result = await dispatch(action);

    if (
      (isLogin && login.fulfilled.match(result)) ||
      (!isLogin && register.fulfilled.match(result))
    ) {
      onClose();
      setIsLogin(true); // After register → login
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "userType" && value !== "organizer"
        ? { organizationName: "" }
        : {}),
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 relative">
          <h2 className="text-white text-lg font-semibold">
            {isLogin ? "Login" : "Create Account"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 space-y-1">

          {!isLogin && (
            <>
              {/* Salutation */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-gray-700 mb-2">
                  Salutation
                </label>

                <select
                  key={formData.prefix}
                  value={formData.prefix}
                  onChange={(e) => handleInputChange("prefix", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg
                    border-blue-200 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Dr">Dr</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                      errors.name ? "border-red-500" : "border-blue-200"
                    }`}
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                      errors.phone ? "border-red-500" : "border-blue-200"
                    }`}
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* User Type */}
              <div className="col-span-2 grid grid-cols-2 gap-2">
                <label className="block text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["doctor", "organizer"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        handleInputChange("userType", type)
                      }
                      className={`py-2 px-4 rounded-lg border-2 transition-all ${
                        formData.userType === type
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-blue-200 hover:border-blue-300"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isLogin && formData.userType === "organizer" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                placeholder="Enter organization name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  errors.organizationName ? "border-red-500" : "border-blue-200"
                }`}
                value={formData.organizationName}
                onChange={(e) =>
                  handleInputChange("organizationName", e.target.value)
                }
              />
              {errors.organizationName && (
                <p className="text-red-500 mt-1">
                  {errors.organizationName}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                    errors.email ? "border-red-500" : "border-blue-200"
                  }`}
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                />
              </div>
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                    errors.password ? "border-red-500" : "border-blue-200"
                  }`}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </div>
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>      
          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 rounded-lg transition-colors shadow-md
              ${status === "loading"
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"}
            `}
          >
            {status === "loading"
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>


          {/* Toggle */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-blue-600 hover:text-blue-700 ml-2"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </form>
        {error && (
          <p className="text-red-600 text-sm text-center mt-2">
            {error}
          </p>
        )}

        {/* Footer note */}
        <div className="bg-blue-50 border-t border-blue-100 p-4 rounded-b-lg">
          <p className="text-blue-800 text-center">
            This is a demo authentication. In production, this would connect to
            a secure backend.
          </p>
        </div>

      </div>
    </div>
  );
}

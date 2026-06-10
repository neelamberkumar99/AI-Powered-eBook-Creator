import { useState} from "react";
import {link, useNavigate} from "react-router-dom";
import {Mail,Lock,User,BookOpen} from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import {useAuth} from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import {API_PATHS} from "../utils/apiPaths";

const SignupPages = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.SIGNUP, formData);
      const { token } = response.data;
      // Fetch user profile after successful signup
      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      login(profileResponse.data, token);
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-state-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="text-center mb-8">   
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-700 text-white rounded-full">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-state-900">Create an account</h1>
        <p className="text-state-600">Please sign up to your account</p>
      </div>  
      <div className="bg-white border border-state-200 rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            name="name"
            type="text"
            placeholder="Enter your name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder=".........."
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            create account
          </Button>
        </form>

        <p className="text-sm text-state-600 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="front-medium text-violet-600 hover:text-violet-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>


  </div>
  )
};

export default SignupPages;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Test basic structure */}
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1>Signup Form</h1>
          <p>This is a test to ensure basic JSX structure works</p>
        </div>
      </div>
    </>
  );
};

export default Signup;

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { FcGoogle } from "react-icons/fc";
import masteryIllustration from "../assets/mastery_illustration.png";
import aiIllustration from "../assets/ai_eye_tracking.png";
import antiCheatIllustration from "../assets/anti_cheat.png";
import analyticsIllustration from "../assets/analytics.png";
import collaborationIllustration from "../assets/collaboration.png";
import mobileIllustration from "../assets/mobile_learning.png";

const Hero = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("student");

  // Mandatory fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Student-specific
  const [studentId, setStudentId] = useState("");

  // Teacher-specific (optional)
  const [degree, setDegree] = useState("");

  // Optional fields
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "Quizi Hub",
      text: "Unleash Your Academic Success with Quizi Hub's Exam Excellence Platform.",
      image: masteryIllustration,
      bgColor: "#91c5e8ff" // Mint Green
    },
    {
      title: "AI Eye-Tracking",
      text: "Our smart proctoring system monitors focus to ensure a fair and honest assessment for everyone.",
      image: aiIllustration,
      bgColor: "#90b7d0ff" // Light Blue
    },
    {
      title: "Anti-Cheat System",
      text: "Stay in the zone. We detect and prevent tab-switching and external distractions automatically.",
      image: antiCheatIllustration,
      bgColor: "#c6a8e4ff" // Lavender
    },
    {
      title: "Real-time Analytics",
      text: "Get instant feedback and deep insights into your performance right after you finish.",
      image: analyticsIllustration,
      bgColor: "#f9f0ea" // Peach
    },
    {
      title: "Collaborative Learning",
      text: "Connect with teachers and peers in a secure environment designed for modern education.",
      image: collaborationIllustration,
      bgColor: "#f9f9ea" // Soft Yellow
    },
    {
      title: "Learn Anywhere",
      text: "A seamless experience across all devices, making assessments flexible and accessible.",
      image: mobileIllustration,
      bgColor: "#eaf9f9" // Soft Teal
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // LOGIN
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast.success("Login Successful!");
      } catch (err) {
        console.error("Login error:", err);
        toast.error(err.message || "An error occurred during login");
      }
    } else {
      // CREATE ACCOUNT
      if (
        !fullName ||
        !email ||
        !mobile ||
        !password ||
        (userType === "student" && !studentId)
      ) {
        toast.error("Please fill all required fields!");
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType === "student" ? 0 : 1,
              mobile,
              student_id: studentId,
              degree,
              department,
              university,
            },
          },
        });
        if (error) throw error;

        toast.success("Account created! Please check your email for verification.");
        setIsLogin(true);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5cb85c] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm text-gray-900 bg-white";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Illustration & Swiper */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{ backgroundColor: slide.bgColor }}
          >
            <div className="w-full max-w-lg text-center relative z-10">
              <div className={`transition-all duration-700 ease-in-out transform ${index === activeSlide ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                <img
                  src={slide.image}
                  alt="Illustration"
                  className="w-full h-auto object-contain max-h-[400px] mb-8"
                />
                <h2 className="text-3xl font-bold text-[#1d2733] mb-4">
                  {slide.title}
                </h2>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {slide.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Indicators */}
        <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? "w-8 bg-[#5cb85c]" : "w-2 bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8 sm:mb-12">
            <div className="text-[#1d2733] flex items-center gap-2">
              <GraduationCap size={32} className="text-[#1d2733] sm:w-[40px] sm:h-[40px]" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Quizi <span className="text-[#5cb85c]">Hub</span>
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="flex gap-4 p-1 bg-gray-50 rounded-xl mb-6">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${userType === "student" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                    onClick={() => setUserType("student")}
                  >Student</button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${userType === "teacher" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                    onClick={() => setUserType("teacher")}
                  >Teacher</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                    <input type="text" placeholder="Mr. Imon Farazi" className={inputStyle} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Mobile</label>
                    <input type="text" placeholder="+8801XXXXXXXXX" className={inputStyle} value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                  </div>
                </div>
                {userType === "student" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Student ID</label>
                    <input type="text" placeholder="223071025" className={inputStyle} value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                  </div>
                )}
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Username or email</label>
              <input type="email" placeholder="farazi@gmail.com" className={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                {isLogin && <button type="button" className="text-xs font-semibold text-[#5cb85c] hover:underline">Forgot password?</button>}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  className={inputStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1d2733] text-white py-4 rounded-lg font-bold hover:bg-[#2c3a4d] transition-colors shadow-lg shadow-gray-200 mt-4 text-sm uppercase tracking-wider">
              {isLogin ? "Sign in" : "Create Account"}
            </button>
          </form>

          {isLogin && (
            <>
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-100"></div>
                <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 border-t border-gray-100"></div>
              </div>

              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <FcGoogle size={20} />
                Sign in with Google
              </button>
            </>
          )}

          <div className="mt-12 text-center text-sm">
            <p className="text-gray-500">
              {isLogin ? "Are you new?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#5cb85c] hover:underline">
                {isLogin ? "Create an Account" : "Sign in now"}
              </button>
            </p>
          </div>

          <p className="mt-8 text-center text-[10px] text-gray-400 max-w-xs mx-auto">
            By continuing, you agree to our{" "}
            <button onClick={() => setShowTerms(true)} className="hover:text-gray-600 underline">Terms</button> and{" "}
            <button onClick={() => setShowPrivacy(true)} className="hover:text-gray-600 underline">Privacy Policy</button>.
          </p>
        </div>
      </div>

      {/* Modals (Keep previous logic) */}
      {(showTerms || showPrivacy) && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{showTerms ? "Terms of Service" : "Privacy Policy"}</h2>
              <button onClick={() => { setShowTerms(false); setShowPrivacy(false); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-600 text-sm leading-relaxed space-y-4">
              {showTerms ? (
                <>
                  <p>Welcome to Quizi (Mastery Hub). By accessing our platform, you agree to these terms of service.</p>
                  <h3 className="font-semibold text-gray-800">1. Usage Policy</h3>
                  <p>You agree to use the platform only for lawful purposes.</p>
                </>
              ) : (
                <>
                  <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your data.</p>
                </>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => { setShowTerms(false); setShowPrivacy(false); }} className="px-6 py-2 bg-[#5cb85c] text-white rounded-lg hover:bg-[#4cae4c] transition font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;

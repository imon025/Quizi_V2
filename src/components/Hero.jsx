import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

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
      text: "Quizi is a silent and secure online quiz system designed to make learning and assessment seamless and effective.",
      author: "What is Quizi",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
    },
    {
      text: "Our AI-powered eye-tracking technology continuously monitors student focus, ensuring absolute fairness during assessments.",
      author: "AI Eye-Tracking",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      text: "Built-in anti-cheat mechanisms instantly detect and prevent off-tab switching, guaranteeing a completely secure exam environment.",
      author: "Tab Switching Prevention",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
    },
    {
      text: "Teachers receive instant grading, real-time focus reports, and detailed analytics to track student progress with precision.",
      author: "Real-time Analytics",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    },
    {
      text: "Join thousands of students and teachers making online education more reliable, fair, and engaging.",
      author: "Join the Community",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const mandatoryInput =
    "border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 text-slate-900 w-full text-sm";
  const optionalInput =
    "border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 text-slate-900 w-full text-sm";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative px-8 py-8 sm:px-16 md:px-24">
        {/* Watermark */}
        <div className="absolute top-8 left-8 text-xs font-semibold text-gray-400 tracking-wider">
          quizi_v2 by imonFarazi
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-2">
              Welcome back <span className="text-3xl">👋</span>
            </h1>
          </div>

          {/* Toggle Switches */}
          <div className="bg-gray-100 rounded-lg p-1 flex mb-8">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Log in
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                {/* Student / Teacher buttons */}
                <div className="flex gap-4 justify-center mb-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${userType === "student"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                      }`}
                    onClick={() => setUserType("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${userType === "teacher"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                      }`}
                    onClick={() => setUserType("teacher")}
                  >
                    Teacher
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className={mandatoryInput}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mobile *"
                    className={mandatoryInput}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
                {userType === "student" && (
                  <input
                    type="text"
                    placeholder="Student ID *"
                    className={mandatoryInput}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                )}
                {userType === "teacher" && (
                  <input
                    type="text"
                    placeholder="Degree (Optional)"
                    className={optionalInput}
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Department"
                    className={optionalInput}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="University"
                    className={optionalInput}
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>
              </>
            )}

            <input
              type="email"
              placeholder="Email address"
              className={mandatoryInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={mandatoryInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm mt-1 mb-2">
                <label className="flex items-center text-gray-600 gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  Stay logged in
                </label>
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-sm w-full"
            >
              {isLogin ? "Log in" : "Sign up"}
            </button>
          </form>

          {isLogin && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-400">Or Log in with</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <button type="button" className="flex justify-center items-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <FcGoogle className="text-xl" />
                </button>
                <button type="button" className="flex justify-center items-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-black">
                  <FaApple className="text-xl" />
                </button>
                <button type="button" className="flex justify-center items-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-[#1877F2]">
                  <FaFacebook className="text-xl" />
                </button>
              </div>
            </>
          )}

          <p className="text-center text-xs text-gray-500 mt-4">
            By {isLogin ? "logging in" : "signing up"}, you agree to the{" "}
            <button type="button" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-blue-600 hover:underline">Terms of Service</button> and{" "}
            <button type="button" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }} className="text-blue-600 hover:underline">Privacy Policy</button>.
          </p>
        </div>
      </div>

      {/* Right Side: Swiper / Info Section */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Images Layering for Smooth Transition */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
          ></div>
        ))}
        {/* Universal Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>

        {/* Carousel Content */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-20">
          <div className="relative h-40">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${index === activeSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
              >
                <p className="text-xl md:text-2xl font-light leading-relaxed mb-6">
                  {index === 0 && <span className="font-semibold text-white">Quizi </span>}
                  {index === 0 ? slide.text.substring(6) : slide.text}
                </p>
                <p className="text-sm font-medium text-gray-300">
                  {slide.author}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? "w-8 bg-white" : "w-2 bg-gray-500"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Terms of Service</h2>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-600 text-sm leading-relaxed space-y-4">
              <p>Welcome to Quizi. By accessing our platform, you agree to these terms of service.</p>
              <h3 className="font-semibold text-gray-800 text-base">1. Usage Policy</h3>
              <p>You agree to use Quizi only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit anyone else's use of the platform.</p>
              <h3 className="font-semibold text-gray-800 text-base">2. Academic Integrity</h3>
              <p>All assessments taken on Quizi must be your own work. Any circumvention of our proctoring tools, including our AI eye-tracking and tab switching prevention, is strictly prohibited and will be reported to your institution.</p>
              <h3 className="font-semibold text-gray-800 text-base">3. Account Security</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account.</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowTerms(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-600 text-sm leading-relaxed space-y-4">
              <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your data while you use Quizi.</p>
              <h3 className="font-semibold text-gray-800 text-base">1. Data Collection</h3>
              <p>We collect information necessary for the functioning of our silent & secure quiz system. This includes basic profile information and metadata collected during active assessments (such as focus analytics and eye-tracking patterns).</p>
              <h3 className="font-semibold text-gray-800 text-base">2. Data Usage</h3>
              <p>Assessment data is shared only with your authorized teachers and institutions to verify academic integrity. We do not sell your personal data to third parties.</p>
              <h3 className="font-semibold text-gray-800 text-base">3. Data Security</h3>
              <p>We implement industry-standard security measures and encryption to protect your personal and academic data from unauthorized access.</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowPrivacy(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;

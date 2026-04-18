import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AccountForm from "./components/AccountForm";
import Navbar from "./components/Navbar";
import ScrollTop from "./components/ScrollTop";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import About from "./components/About";
import Steps from "./components/Steps";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import { supabase } from "./supabaseClient";

const App = () => {
  const [showAccount, setShowAccount] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  // Modern Auth State
  const [session, setSession] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const cached = localStorage.getItem("quizi_userData");
    return cached ? JSON.parse(cached) : null;
  });
  
  // Only show loading screen if we don't have cached data
  const [isInitializing, setIsInitializing] = useState(!localStorage.getItem("quizi_userData"));

  useEffect(() => {
    let mounted = true;

    // Safety fallback: If Supabase network is completely frozen, stop the spinner after 4 seconds
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn("Safety timeout hit: Supabase network might be hanging.");
        setIsInitializing(false);
      }
    }, 4000);

    // Supabase automatically fires 'INITIAL_SESSION' on load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        console.log("Auth Event:", event);
        setSession(currentSession);

        if (event === 'SIGNED_IN') {
          setIsFirstLogin(true);
        } else if (event === 'SIGNED_OUT') {
          setIsFirstLogin(false);
        }

        if (currentSession) {
          try {
            // Add a race condition to ensure the profile fetch doesn't hang forever
            const fetchPromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Profile fetch timeout")), 3000)
            );

            const { data: profile, error } = await Promise.race([fetchPromise, timeoutPromise]);

            if (error) throw error;

            if (profile && mounted) {
              const combinedUser = { ...currentSession.user, ...profile };
              setLoggedInUser(combinedUser);
              localStorage.setItem("quizi_userData", JSON.stringify(combinedUser));
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        } else {
          setLoggedInUser(null);
          localStorage.removeItem("quizi_userData");
        }

        if (mounted) {
          setIsInitializing(false);
          clearTimeout(safetyTimer);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  // Derived state for easy access
  const userType = loggedInUser ? (loggedInUser.user_type === 1 ? "teacher" : "student") : null;

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAccount(true); // Show login modal after logout
  };

  if (isInitializing && !loggedInUser) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Loading Quizi...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {userType === "student" ? (
        <StudentDashboard studentData={loggedInUser} onLogout={handleLogout} isFirstLogin={isFirstLogin} />
      ) : userType === "teacher" ? (
        <TeacherDashboard teacherData={loggedInUser} onLogout={handleLogout} isFirstLogin={isFirstLogin} />
      ) : (
        <div className="bg-primary text-textPrimary w-full h-full">
          <Navbar onLoginClick={() => setShowAccount(true)} />
          <ScrollTop />
          <div className="container px-5 md:px-10 mx-auto">
            <Hero onLoginClick={() => setShowAccount(true)} />
            <div className="flex flex-col xs:flex-row flex-wrap items-center justify-between gap-10 py-20 w-full">
              <Stats end={3800} title="ACTIVE STUDENT & TEACHER" suffix="+" />
              <Stats end={230} title="Total Courses" suffix="+" />
              <Stats end={230} title="Total Users" prefix="$" suffix="M+" />
            </div>
            <Features onLoginClick={() => setShowAccount(true)} />
            <About />
            <Steps onLoginClick={() => setShowAccount(true)} />
            <Testimonials />
            <CTA onLoginClick={() => setShowAccount(true)} />
            <Footer />
          </div>

          {showAccount && <AccountForm setShowAccount={setShowAccount} />}
        </div>
      )}
    </>
  );
};

export default App;

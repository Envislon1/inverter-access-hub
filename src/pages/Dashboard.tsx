
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Welcome to Technautic</h1>
        <p className="text-gray-400 mb-8">Your inverter monitoring dashboard</p>
        {/* More dashboard content will be added here */}
      </div>
    </div>
  );
};

export default Dashboard;

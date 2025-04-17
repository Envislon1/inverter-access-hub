
import { SignInForm } from "@/components/SignInForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Inverter Access Hub</h1>
          <p className="text-gray-500">Monitor and manage your power system</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default Index;

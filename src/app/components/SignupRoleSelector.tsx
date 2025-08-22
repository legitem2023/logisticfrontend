// components/SignupRoleSelector.tsx
"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/Card";
import { FiTruck, FiPackage } from "react-icons/fi";
import { useDispatch,useSelector } from 'react-redux';
import { setActiveIndex } from '../../../Redux/activeIndexSlice';

export default function SignupRoleSelector() {
  const router = useRouter();
  const dispatch = useDispatch();
  const options = [
    {
      role: "Rider",
      icon: <FiTruck className="text-green-600 text-4xl" />,
      description: "Deliver packages and earn with flexible schedules.",
      link: "/Signup/Rider",
    },
    {
      role: "Sender",
      icon: <FiPackage className="text-green-600 text-4xl" />,
      description: "Send packages quickly and easily to anywhere.",
      link: "/Signup/Sender",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-2">Join Our Platform</h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Select your role to get started with your personalized registration process.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {options.map((option, idx) => (
          <Card
            key={idx}
            onClick={() => router.push(option.link)}
            className="cursor-pointer group hover:shadow-xl transition-all duration-300 border border-green-100"
          >
            <CardContent className="flex flex-col items-center p-8">
              <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                {option.icon}
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">{option.role}</h2>
              <p className="text-gray-600 text-center">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Already have an account?{" "}
        <span onClick={()=>{dispatch(setActiveIndex(12))}} className="text-green-600 hover:underline font-medium">
          Login here
        </span>
      </p>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to PrepKit, {session.user?.name}!
            </h1>
            <p className="text-gray-600 mb-6">
              Your interview preparation journey starts here. Choose a learning path to begin mastering technical interviews.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="text-lg font-semibold text-gray-900">Data Structures & Algorithms</h3>
                <p className="text-gray-600 text-sm mt-2">Master the fundamentals of DSA for technical interviews</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900">Machine Coding Round</h3>
                <p className="text-gray-600 text-sm mt-2">Practice building real-world applications</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-2xl mb-2">🏗️</div>
                <h3 className="text-lg font-semibold text-gray-900">System Design</h3>
                <p className="text-gray-600 text-sm mt-2">Learn to design scalable distributed systems</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="text-lg font-semibold text-gray-900">Behavioral Interviews</h3>
                <p className="text-gray-600 text-sm mt-2">Master communication and soft skills</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">Start your first lesson to begin tracking your progress!</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">0% Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

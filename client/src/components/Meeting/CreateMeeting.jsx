import { useState } from "react";
import { Video } from "lucide-react"; // Video icon
export const API_URL = import.meta.env.VITE_API_URL;

export default function CreateMeeting() {
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/createmeeting`);
      const data = await res.json();
      setMeetingLink(data.link);
    } catch (error) {
      console.error("Error creating meeting", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-white flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Video size={48} className="text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Start an Interview</h1>
        <p className="text-gray-500 mb-6">
          Click below to generate a secure video meeting link.
        </p>

        <button
          onClick={handleCreateMeeting}
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg transition-all font-semibold ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Creating..." : "Generate Meeting Link"}
        </button>

        {meetingLink && (
          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-2">Meeting Link:</p>
            <a
              href={meetingLink}
              className="text-blue-600 underline break-all text-sm hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {meetingLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
